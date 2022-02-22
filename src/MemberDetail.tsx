import React from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import person from './placeholder.svg';
import github from './pics/github.svg';
import twitter from './pics/twitter.svg';
import facebook from './pics/facebook.svg';
import { Skill, expToStr } from './types';
import { ControlBox } from './Parts';
import { SkillToTitle } from './Profile';

const TitleSmall = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: #1F3C56;
`

const Exp = styled.div`
  font-size: 14px;
`

const Text = styled.div`
  font-size: 14px;
  height: 12vh;
`

const ScrollBox = styled.div`
  height: 94%;
  width: 92%;
  padding-left: 4%;
  padding-right: 4%;
  overflow-y: auto;
`

const Form = styled.div`
  background: white;
  margin-top: 2%;
  margin-bottom: 2%;
  width: 100%;
`

const Item = styled.div`
  padding-top: 1%;
  padding-bottom: 1%;
  width: max(30%, 500px);
  margin: 0 auto;
`

const Img = styled.img`
  width: min(90%, 200px);
  height: min(90%, 200px);
  border-radius: 50%;
`

const MemberCardDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`

const LeftBox = styled.div`
  display: grid;
  grid-template-columns: 40% 60%;
  justify-items: center;
  align-items: center;
`

const SNSBox = styled.div`
  display: flex;
  gap: 8%;
  height: min(2vh, 20px);
  justify-content: flex-end;
`

const Name = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #1F3C56;
  padding-right: 5%;
  padding-left: 5%;
`

const FlexBox = styled.div`
  display: -webkit-flex;
  display: flex;
  align-items: center;
  gap: 10%;
`

const SmallSkillBox = styled.div`
  flex-wrap: wrap;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  gap: 2%;
`

const SkillCard = styled.div`
  background: #E0EBFF;

  height: 1.5vh;
  width: fit-content;
  font-family: Noto Sans JP;
  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;

  padding-left: 5%;
  padding-right: 5%;

  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;

  color: #5A8FEB;
`

const MemberDetail = ({member: data}: any) => {
  const { user } = useContext(AuthContext);
  const src = data?.photoURL ? data?.photoURL : person;

  if (!user)
    return <Navigate to="/login" />;

  if (!data)
    return <>Now Loading</>;

  return (
    <Container sideContents={<SideMenu />}>
      <Header>メンバー</Header>
      <Restrict>
        <ControlBox back />
        <ScrollBox>
          <Form>
            <Item>
              <MemberCardDiv>
                <LeftBox>
                  <Img src={src} alt="user" />
                  <Name>{data.name}</Name>
                </LeftBox>
                <SNSBox>
                  <a href={data.facebook}>
                    <img src={facebook} alt="facebook" height="100%"/>
                  </a>
                  <a href={data.twitter}>
                    <img src={twitter} alt="twitter" height="100%"/>
                  </a>
                  <a href={data.github}>
                    <img src={github} alt="github" height="100%"/>
                  </a>
                </SNSBox>
              </MemberCardDiv>
            </Item>
            <Item>
              <FlexBox>
                <TitleSmall>IT経験</TitleSmall>
                <Exp>
                  {expToStr(data.experience)}
                </Exp>
              </FlexBox>
            </Item>
            <Item>
              <TitleSmall>保有スキル</TitleSmall>
              <SmallSkillBox>
                {data.skills.map((s: Skill) => <SkillCard key={SkillToTitle(s)}>{SkillToTitle(s)}</SkillCard>)}
              </SmallSkillBox>
            </Item>
            <Item>
              <TitleSmall>自己紹介</TitleSmall>
              <Text>{data.selfIntroduction}</Text>
            </Item>
            <Item>
              <TitleSmall>勉強しているorしてみたい技術・言語など</TitleSmall>
              <Text>{data.study}</Text>
            </Item>
            <Item>
              <TitleSmall>こんなサービス創りたい・創れるようになりたい</TitleSmall>
              <Text>{data.want}</Text>
            </Item>
          </Form>
        </ScrollBox>
      </Restrict>
    </Container>
  );
}

export default MemberDetail;
