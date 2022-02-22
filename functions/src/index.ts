import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {ALL_PLANS} from "../../src/plans";
import {Stripe} from "stripe";
import {prices} from "./prices";

const secretKey = functions.config().stripe.key;
const stripe = new Stripe(secretKey, {apiVersion: "2020-08-27"});

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//
export const createStripeCustomer =
  functions.auth.user().onCreate(async (user) => {
    const customer = await stripe.customers.create({email: user.email});
    const intent = await stripe.setupIntents.create({
      customer: customer.id,
    });
    await admin.firestore().collection("stripe_customers").doc(user.uid).set({
      customer_id: customer.id,
      setup_secret: intent.client_secret,
    });
    return;
  });

export const cleanupUser = functions.auth.user().onDelete(async (user) => {
  const dbRef = admin.firestore().collection("stripe_customers");
  const customer = (await dbRef.doc(user.uid).get()).data();
  if (!customer) return;
  await stripe.customers.del(customer.customer_id);
  await dbRef.doc(user.uid).delete();
  const users = admin.firestore().collection("users");
  await users.doc(user.uid).delete();
  return;
});

// TODO: Fix error code
export const charge =
    functions.https.onCall(async (plan, context) => {
      const uid = context?.auth?.uid;
      if (!uid) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError("failed-precondition",
            "The function must be called while authenticated.");
      }
      const user = await admin.auth().getUser(uid);
      if (user.customClaims?.plan === plan) {
        return {result: "nop"};
      }
      const custom = {plan: plan};
      if (!ALL_PLANS.includes(custom.plan)) {
        throw new functions.https.HttpsError("failed-precondition",
            "plan is invalid");
      }
      const dbRef = admin.firestore().collection("stripe_customers");
      const customer = (await dbRef.doc(user.uid).get()).data();
      if (!customer) {
        throw new functions.https.HttpsError("failed-precondition",
            "customer is null");
      }
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.customer_id,
        status: "all",
        expand: ["data.default_payment_method"],
      });
      const subscriptionsdata =
        subscriptions
            .data
            .filter((s) => s.status === "active");
      if (!(custom.plan in prices) && custom.plan !== "FREE") {
        throw new functions.https.HttpsError("failed-precondition",
            "plan is invalid");
      }
      if (user.customClaims?.plan &&
        user.customClaims?.plan !== "FREE" && custom.plan !== "FREE") {
        if (subscriptionsdata.length === 0 ||
          subscriptionsdata.length > 1) {
          throw new functions.https.HttpsError("failed-precondition",
              "subscriptions are invalid");
        }
        const updatedSubscription = await stripe.subscriptions.update(
            subscriptionsdata[0].id, {
              items: [{
                id: subscriptionsdata[0].items.data[0].id,
                price: (prices as any)[custom.plan],
              }],
            }
        );
        if (updatedSubscription.status !== "active") {
          throw new functions.https.HttpsError("failed-precondition",
              "payment failed");
        }
        await admin
            .auth()
            .setCustomUserClaims(uid, custom);
        return {result: "updated"};
      }

      if (user.customClaims?.plan && custom.plan === "FREE") {
        if (subscriptionsdata.length === 0 ||
          subscriptionsdata.length > 1) {
          throw new functions.https.HttpsError("failed-precondition",
              "subscriptions are invalid");
        }
        const deletedSubscription = await stripe.subscriptions.del(
            subscriptionsdata[0].id
        );
        if (deletedSubscription.status === "active") {
          throw new functions.https.HttpsError("failed-precondition",
              "cancel failed");
        }
        await admin
            .auth()
            .setCustomUserClaims(uid, custom);
        return {result: "updated"};
      }
      if (!user.customClaims?.plan ||
        user.customClaims?.plan === "FREE" || (custom.plan === "FREE" &&
          subscriptionsdata.length === 0)) {
        const subscription = await stripe.subscriptions.create({
          customer: customer.customer_id,
          items: [{
            price: (prices as any)[custom.plan],
          }],
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"],
        });
        const latestInvoice =
          subscription?.latest_invoice as Stripe.Invoice | null;
        const paymentIntent =
          latestInvoice?.payment_intent as Stripe.PaymentIntent | null;
        const clientSecret = paymentIntent?.client_secret;
        await admin
            .auth()
            .setCustomUserClaims(uid,
                {plan: user.customClaims?.plan,
                  update: custom.plan});
        return {result: "created", clientSecret};
      }
      throw new functions.https.HttpsError("failed-precondition",
          "assertion: never occurs");
    });

export const continueCharge =
    functions.https.onCall(async (data, context) => {
      const uid = context?.auth?.uid;
      if (!uid) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError("failed-precondition",
            "The function must be called while authenticated.");
      }
      const user = await admin.auth().getUser(uid);
      const custom = user.customClaims;
      if (!custom || !custom.update) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError("failed-precondition",
            "custom is null");
      }
      const dbRef = admin.firestore().collection("stripe_customers");
      const customer = (await dbRef.doc(user.uid).get()).data();
      if (!customer) {
        throw new functions.https.HttpsError("failed-precondition",
            "customer is null");
      }
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.customer_id,
        status: "all",
        expand: ["data.default_payment_method"],
      });
      const subscriptionsdata =
        subscriptions
            .data
            .filter((s) => s.status === "active");
      if (subscriptionsdata.length === 0 ||
        subscriptionsdata.length > 1) {
        throw new functions.https.HttpsError("failed-precondition",
            "subscriptions are invalid");
      }
      await admin
          .auth()
          .setCustomUserClaims(uid, {plan: custom.update});
    });
