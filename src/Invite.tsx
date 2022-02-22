import React from 'react';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';

const Title = styled.div`
  padding-top: 3%;
  font-weight: bold;
  font-size: 24px;
  color: #1F3C56;
`

const TitleSmall = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: #1F3C56;
  width: 80%;
  border: 1px solid #A8A8A8;
  box-sizing: border-box;
  text-align: center;
  padding-top: 3%;
  padding-bottom: 3%;
  margin: 0 auto;
  margin-bottom: 2%;
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

const Invite = () => {
  const { user } = useContext(AuthContext);
  const [ enable, setEnable ] = useState(true);
  const [ link, setLink ] = useState("https://engineerbase-app3.bubbleapps.io/version-test/signin?friendcode=1643694182730x871194918413770100");

  const copy = async (event: any) => {
    event?.preventDefault();
    setEnable(false);
    await navigator.clipboard.writeText(link);
    setTimeout(() => setEnable(true), 200);
  }

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>友人紹介</Header>
        <Restrict>
          <ScrollBox>
            <Title>友人紹介</Title>
            <Form onSubmit={copy}>
              <Item>
                <Text>
                  サンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキスト
                </Text>
              </Item>
              <TitleSmall>{link}</TitleSmall>
              <Item>
                <Button disabled={!enable} type="submit">紹介リンクをコピー</Button>
              </Item>
            </Form>
          </ScrollBox>
        </Restrict>
      </Container>
    );
}

export default Invite;
