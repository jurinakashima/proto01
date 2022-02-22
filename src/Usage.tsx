import React from 'react';
import { useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import { ControlBox } from './Parts';

const Box = styled(Link)`
  width: 100%;
  height: max(5vh, 50px);
  margin-left: 0;
  margin-top: 2%;
  background-color: white;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  border: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  text-decoration: none;
`

const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
  color: #1F3C56;
  height: 100%;

  padding-left: 1.5vw;
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-end;
  align-items: center;
`

type CardProp = {
  title: string;
  to: string;
};

const Card = ({title, to}: CardProp) => {
  return (
    <Box to={to}>
      <Title><div>{title}</div></Title>
    </Box>
  );
}

const ScrollBox = styled.div`
  height: 90%;
  width: 80%;
  padding-left: 10%;
  padding-right: 10%;
  overflow-y: auto;
`

const Usage = () => {
  const { user } = useContext(AuthContext);

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>ご利用の流れ</Header>
        <Restrict>
          <ControlBox back />
          <ScrollBox>
            <Card
              key="constitution"
              title="○○○○の全体構成"
              to="constitution"
            />
            <Card
              key="slack"
              title="Slackの使い方"
              to="#"
            />
            <Card
              key="study"
              title="学習システムの使い方"
              to="#"
            />
            <Card
              key="discord"
              title="Discordの使い方"
              to="#"
            />
            <Card
              key="proceeding"
              title="学習の進め方"
              to="#"
            />
          </ScrollBox>
        </Restrict>
      </Container>
    );
}

export default Usage;
