import React from 'react';
import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext, logout } from './AuthContext';
import Container, { Header } from './Container';
import SideMenu from './SideMenu';

const Box = styled.button`
  width: 15vw;
  height: max(4vh, 40px);
  margin-top: 0;
  margin-left: 0;
  cursor: pointer;
  border: none;
  background: #FFFFFF;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;

  font-family: Noto Sans JP;
  font-style: normal;
  font-weight: bold;
  line-height: 23px;
`

const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
  color: #1F3C56;
`

type CardProp = {
  style?: any;
  children?: React.ReactNode | undefined;
  to: string;
};

const Card = ({style, to, children}: CardProp) => {
  const navigate = useNavigate();
  const onClick = () => navigate(to);
  return (
    <Box onClick={onClick} style={style}>
      {children}
    </Box>
  );
}

const Item = styled.div`
  margin-top: 3vh;
  margin-bottom: 3vh;
`

const ScrollBox = styled.div`
  height: 80%;
  width: 80%;
  padding-left: 10%;
  padding-right: 10%;
  padding-bottom: 1%;
  margin-bottom: 0;
  margin-top: 0;
  overflow-y: auto;
`

const CardBox = styled.div`
  height: 80%;
  width: 100%;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0;
  padding-top: 1%;
  margin-bottom: 0;
  margin-top: 0;

  display: grid;
  gap: 1vw;
`

const More = () => {
  const { user } = useContext(AuthContext);

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>もっと見る</Header>
        <ScrollBox>
          <Item>
            <Title>ご利用の流れ</Title>
            <CardBox>
              <Card to="#" style={{ gridColumn: 1 }}>全体構成</Card>
              <Card to="#" style={{ gridColumn: 2 }}>Slackの使い方</Card>
              <Card to="#" style={{ gridColumn: 3 }}>学習システムの使い方</Card>
              <Card to="#" style={{ gridColumn: 4 }}>Discordの使い方</Card>
              <Card to="#" style={{ gridColumn: 1 }}>学習の進め方</Card>
            </CardBox>
          </Item>
          <Item>
            <Title>アカウント情報</Title>
            <CardBox>
              <Card to="profile" style={{ gridColumn: 1 }}>プロフィール編集</Card>
              <Card to="#" style={{ gridColumn: 2 }}>友人紹介</Card>
              <Box onClick={logout} style={{ gridColumn: 3 }}>ログアウト</Box>
              <Card to="#" style={{ gridColumn: 4, visibility : "hidden" }}/>
            </CardBox>
          </Item>
          <Item>
            <Title>その他</Title>
            <CardBox>
              <Card to="#" style={{ gridColumn: 1 }}>特定商取引法に基づく記載</Card>
              <Card to="#" style={{ gridColumn: 2 }}>利用規約</Card>
              <Card to="#" style={{ gridColumn: 3 }}>プライバシーポリシー</Card>
              <Card to="#" style={{ gridColumn: 4 }}>お問い合わせ</Card>
            </CardBox>
          </Item>
        </ScrollBox>
      </Container>
    );
}

export default More;
