import React from 'react';
import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import { ControlBox, DoneYet, plan2ja } from './Parts';
import { Content } from './types';

const Box = styled.button`
  width: 100%;
  height: 5vh;
  margin-left: 0;
  margin-top: 2%;
  background-color: white;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  border: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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

const ProgressText = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #5A8FEB;
  height: 100%;

  padding-right: 1.5vw;
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-end;
  align-items: center;
`

type CardProp = {
  title: string;
  progress: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Card = ({progress, title, onClick}: CardProp) => {
  return (
    <Box onClick={onClick}>
      <Title><div>{title}</div></Title>
      {progress ? <ProgressText><div>完了</div></ProgressText> : <ProgressText style={{color: "black"}}><div>未完了</div></ProgressText>}
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

const CourseDetail = ({plan, contents, content: j, setDetail}: {plan: string, contents: Content[]; content: number; setDetail: (_: number) => void;}) => {
  const { user } = useContext(AuthContext);
  const [ done, setDone ] = useState(false);
  const navigate = useNavigate();

  if (!contents[j])
    return <Navigate to="/courses" />;
  const details = contents[j].details;
  const clear = contents[j].clear;

  const toggle = (dy: DoneYet) => {
    switch (dy) {
      case DoneYet.Done:
        setDone(true);
        break;
      default:
        setDone(false);
    }
  };

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>{`学習コース - ${plan2ja(plan)}`}</Header>
        <Restrict>
          <ControlBox onChange={toggle} back />
          <ScrollBox>
            {details.map((detail, i) => {
              if ((!done || clear[i]) && (done || !clear[i]))
                return (
                  <Card key={i}
                    title={detail.title}
                    progress={clear[i]}
                    onClick={() => {
                      setDetail(i);
                      navigate("/courses/content");
                    }} />
                );
              else
                return undefined;
            })}
          </ScrollBox>
        </Restrict>
      </Container>
    );
}

export default CourseDetail;
