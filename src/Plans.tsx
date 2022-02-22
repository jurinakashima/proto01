import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { httpsCallable } from "firebase/functions";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import { reload, getIdToken } from "firebase/auth";
import { ALL_PLANS } from './plans';

const Title = styled.div`
  padding-top: 3%;
  font-weight: bold;
  font-size: 24px;
  color: #1F3C56;
`

const TitleSmall = styled.div`
  font-weight: bold;
  font-size: 14px;
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

const Text = styled.div`
  font-size: 14px;
`

const planToText = (plan: string) => {
  switch (plan) {
    case "JOBHUNTING":
      return "就活コースプラン(11000円/月)";
    case "PROGRAMMING":
      return "学習コースプラン(9800円/月)";
    case "COMMUNITY":
      return "コミュニティプラン(980円/月)";
    case "UNLIMITED":
      return "使い放題コースプラン(19800円/月)";
    case "FREE":
      return "無料体験プラン";
    default:
      return "";
  }
}

const Button = styled.button`
  cursor: pointer;
  width: 100%;
  height: max(3vh, 30px);
  color: white;
  background-color: #5A8FEB;
  border-radius: 30px;
  border: none;
  font-size: 16px;
  :disabled {
  background: #ccc;
  }
`

const Select = styled.select`
  background-color: #EFEFEF;
  display: block;
  width: 100%;
  height: 4vh;
  padding: 0 0;
  border:1px solid #ccc;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  -moz-background-clip: padding;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  font-family: Noto Sans JP;
  font-size: 100%;
  letter-spacing: .8px;
`

const Plans = () => {
  const { user, functions } = useContext(AuthContext);
  const [ plan, setPlan ] = useState("");
  const [ userPlan, setUserPlan ] = useState("");
  const [ enable, setEnable ] = useState(true);
  const navigate = useNavigate();

  const changePlan = async (event: any) => {
    event?.preventDefault();
    if (!user) return;
    setEnable(false);
    const charge = httpsCallable(functions, 'charge');
    try {
      const result = await charge(plan);
      if ((result.data as any).result === "updated") {
        await getIdToken(user, true);
        await reload(user);
        const token = await user.getIdTokenResult();
        setUserPlan((token.claims.plan ?? "FREE") as string);
      }
      if ((result.data as any).result === "created") {
        const clientSecret = (result.data as any).clientSecret as string;
        navigate("/subscribe", {state: clientSecret});
      }
    } catch (error) {
      alert(error);
    }
    setEnable(true);
  }

  useEffect(() => {
    (async () => {
      if (user) {
        const token = await user.getIdTokenResult();
        setUserPlan((token.claims.plan ?? "FREE") as string);
      }
    })();
  }, [user]);

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>プラン変更</Header>
        <Restrict>
          <ScrollBox>
            <Title>申し込みプラン情報</Title>
            <Form onSubmit={changePlan}>
              <Item>
                <TitleSmall>現在のプラン</TitleSmall>
                <Text>{planToText(userPlan)}</Text>
              </Item>
              <Item>
                <TitleSmall>プラン変更</TitleSmall>
                <Select value={plan} onChange={(e) => setPlan(e.target.value)}>
                  <option value="">プランを選択してください</option>
                  {ALL_PLANS.map((v) => <option key={v} value={v}>{planToText(v)}</option>)}
                </Select>
              </Item>
              <Item>
                <Button disabled={!enable} type="submit">プラン変更</Button>
              </Item>
            </Form>
          </ScrollBox>
        </Restrict>
      </Container>
    );
}

export default Plans;
