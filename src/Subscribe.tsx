import React from 'react';
import { useContext, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styled from "styled-components";
import { httpsCallable } from "firebase/functions";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import { reload, getIdToken } from "firebase/auth";

const Title = styled.div`
  padding-top: 3%;
  font-weight: bold;
  font-size: 24px;
  color: #1F3C56;
`

const ScrollBox = styled.div`
  height: 100%;
  width: 92%;
  padding-left: 4%;
  padding-right: 4%;
  overflow-y: auto;
`

const Form = styled.form`
  background: white;
  padding-top: 5%;
  padding-bottom: 5%;
  margin-top: 2%;
  margin-bottom: 2%;
  width: 100%;
`

const Item = styled.div`
  padding-top: 2%;
  padding-bottom: 2%;
  width: max(40%, 800px);
  margin: 0 auto;
`

const Button = styled.button`
  cursor: pointer;
  width: 100%;
  height: 3vh;
  color: white;
  background-color: #5A8FEB;
  border-radius: 30px;
  border: none;
  font-size: 16px;
  :disabled {
  background: #ccc;
  }
`

const Subscribe = () => {
  const { user, functions } = useContext(AuthContext);
  const [ enable, setEnable ] = useState(true);
  const location = useLocation();
  const clientSecret = (location as any).state;
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const changePlan = async (event: any) => {
    event.preventDefault();

    if (!user) return;
    if (!elements) return;
    if (!stripe) return;

    const elem = elements.getElement(CardElement);
    if (!elem) return;
    setEnable(false);
    // Use card Element to tokenize payment details
    let { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elem,
      }
    });
    if (error) {
      alert(error);
      setEnable(true);
      return;
    }
    const charge = httpsCallable(functions, 'continueCharge');
    try {
      await charge();
      await getIdToken(user, true);
      await reload(user);
      navigate("/courses");
    } catch (error) {
      alert(error);
    }
    setEnable(true);
  }

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>プラン変更</Header>
        <Restrict>
          <ScrollBox>
            <Title>決済情報入力</Title>
            <Form onSubmit={changePlan}>
              <Item>
                <CardElement />
              </Item>
              <Item>
                <Button disabled={!enable} type="submit">購入</Button>
              </Item>
            </Form>
          </ScrollBox>
        </Restrict>
      </Container>
    );
}

export default Subscribe;
