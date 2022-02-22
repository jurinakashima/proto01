import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import Modal from 'react-modal';
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import programming from './pics/programming.png';
import syuukatu from './pics/syuukatu.png';
import free from './pics/free.png';
import { userToContent } from './types';

const FlexBox = styled.div`
  height: 95%;
  display: -webkit-flex;
  display: flex;
`

const Column = styled.div`
  width: 50%;
  height: 100%;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  height: 50%;
  flex-direction: row;
  display: -webkit-flex;
  display: flex;
`

const Box = styled.div`
  width: 80%;
  height: min(80%, 600px);
  margin-left: 10%;
  margin-top: 8%;
  background-color: white;
  box-shadow: 2px 2px 10px #EAEAEA;
  position: relative;
`

const Button = styled.button`
  cursor: pointer;
  width: 7vw;
  height: 3vh;
  color: white;
  background-color: #5A8FEB;
  border-radius: 30px;
  border: none;
  position: absolute;
  font-size: 16px;
  right: 2vw;
  bottom: 2vh;
  min-height: 30px;
`

const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
  color: #1F3C56;
`

const Description = styled.div`
  position: absolute;
  left: 3vw;
  top: 3vh;
  width: 80%;
`

const DescriptionText = styled.div`
  font-size: 16px;
  margin-top: 2vh;
`

const Image = styled.img`
  position: absolute;
  left: 3vw;
  bottom: 3vh;
  width: min(8vw, 140px);
  height: min(10vh, 140px);
`

type CardProp = {
  src: string;
  alt: string;
  title: string;
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Card = ({ src, alt, title, text, onClick }: CardProp) => {
  return (
    <Box>
      <Description>
        <Title>{title}</Title>
        <DescriptionText>{text}</DescriptionText>
      </Description>
      <Image src={src} alt={alt} />
      <Button onClick={onClick}>進む</Button>
    </Box>
  );
}

const FlexDiv = styled.div`
  justify-content: flex-end;
  display: flex;
`

const Close = styled.button`
  cursor: pointer;
  display: block;
  position: relative;
  border: none;
  width: 20%;
  height: 4vh;
  background: none;

  ::before, ::after { /* 共通設定 */
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px; /* 棒の幅（太さ） */
  height: 40%; /* 棒の高さ */
  background: #333;
  }

  ::before {
  transform: translate(-50%,-50%) rotate(45deg);
  }

  ::after {
  transform: translate(-50%,-50%) rotate(-45deg);
  }
`

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    paddingTop: '0',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const LearningCourse = ({setPlan} : {setPlan: (_: string) => void}) => {
  const { user } = useContext(AuthContext);
  const [ modalIsOpen, setIsOpen ] = React.useState(false);
  const [ userPlan, setUserPlan ] = useState("");
  const navigate = useNavigate();

  function closeModal() {
    setIsOpen(false);
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
      <>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="prompt modal"
        >
          <FlexDiv>
            <Close onClick={closeModal} />
          </FlexDiv>
          <div>プランを購入してください</div>
        </Modal>
        <Container sideContents={<SideMenu />}>
          <Header>学習コース</Header>
          <Restrict>
            <FlexBox>
              <Column>
                <Row>
                  <Card
                    src={programming}
                    alt="programming"
                    title="プログラミングコース"
                    text="学習を進めるにあたって使い方などの説明があるのでチェック！"
                    onClick={() => {
                      if (!userToContent(userPlan).includes("PROGRAMMING")) {
                        setIsOpen(true);
                      } else {
                        setPlan("PROGRAMMING");
                        navigate("/courses/view");
                      }
                    }}
                  />
                </Row>
                <Row>
                  <Card
                    src={free}
                    alt="free"
                    title="無料体験"
                    text="学習を進めるにあたって使い方などの説明があるのでチェック！"
                    onClick={() => {
                      setPlan("FREE");
                      navigate("/courses/view");
                    }}
                  />
                </Row>
              </Column>
              <Column>
                <Row>
                  <Card
                    src={syuukatu}
                    alt="syuukatu"
                    title="就活コース"
                    text="学習を進めるにあたって使い方などの説明があるのでチェック！"
                    onClick={() => {
                      if (!userToContent(userPlan).includes("JOBHUNTING")) {
                        setIsOpen(true);
                      } else {
                        setPlan("JOBHUNTING");
                        navigate("/courses/view");
                    }}}
                  />
                </Row>
              </Column>
            </FlexBox>
          </Restrict>
        </Container>
      </>
    );
}

export default LearningCourse;
