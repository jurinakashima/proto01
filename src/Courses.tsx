import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import { ControlBox, DoneYet, plan2ja } from './Parts';
import { doc, query, where, collection, getDoc, getDocs } from "firebase/firestore";
import { Content } from './types';

const Box = styled.div`
  width: 100%;
  height: 20vh;
  margin-left: 0;
  margin-top: 2%;
  background-color: white;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.05);
  position: relative;
`

const Button = styled.button`
  cursor: pointer;
  width: 7vw;
  min-height: 30px;
  height: 3vh;
  color: white;
  background-color: #5A8FEB;
  border-radius: 30px;
  border: none;
  position: absolute;
  font-size: 16px;
  right: 2vw;
  bottom: 2vh;
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
`

const DescriptionText = styled.div`
  font-size: 16px;
  margin-top: 1vh;
`

const ProgressText = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-top: 1vh;
`

type CardProp = {
  title: string;
  text: string;
  progress: string;
  estimate: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Card = ({progress, estimate, title, text, onClick}: CardProp) => {
  if (estimate > 0)
    title = `${title} 【目安時間:${estimate}時間】`;
  return (
    <Box>
      <Description>
        <Title>{title}</Title>
        <DescriptionText>{text}</DescriptionText>
        <ProgressText>{progress}</ProgressText>
      </Description>
      <Button onClick={onClick}>進む</Button>
    </Box>
  );
}

const ScrollBox = styled.div`
  height: 75%;
  width: 80%;
  padding-left: 10%;
  padding-right: 10%;
  padding-bottom: 5%;
  overflow-y: auto;
`
const Courses = ({plan, contents, setContents, setProgress, setContent}: {plan: string, contents: Content[], setContents: (_: Content[]) => void, setProgress: (_: any[]) => void, setContent: (_: number) => void}) => {
  const { user, db } = useContext(AuthContext);
  const [ done, setDone ] = useState(false);

  useEffect(() => {
    (async () => {
      if (user) {
        const querySnapshot =
          await getDocs(query(collection(db, "contents"),
                              where("plans", "array-contains", plan)));
        const progressDoc = await getDoc(doc(db, "progress", user.uid));
        const progress_ = progressDoc.data()?.progress ?? [];
        let dst: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let p = progress_.find(({ref}: any) => ref.id === doc.id);
          if (!p) {
            p = { ref: doc, clear: [] };
            p.clear = [...Array(data.details.length)].map((_) => false);
            progress_.push(p);
          }
          dst.push({...data, clear: p.clear, id: doc.id});
        });
        setContents(dst);
        setProgress(progress_);
      }
    })();
  }, [db, user, setContents, setProgress, plan]);

  const toggle = (dy: DoneYet) => {
    switch (dy) {
      case DoneYet.Done:
        setDone(true);
        break;
      default:
        setDone(false);
    }
  };
  const navigate = useNavigate();

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>{`学習コース - ${plan2ja(plan)}`}</Header>
        <Restrict>
          <ControlBox onChange={toggle} back />
          <ScrollBox>
            {contents.map((c, i) => {
              const p = c.clear.map((b: boolean) => b ? 1 : 0).reduce((a: number, b: number) => a + b, 0);
              const d = c.details.length;
              if ((!done || p >= d) && (done || p < d))
                return (
                  <Card key={c.id}
                    title={c.title}
                    text={c.text}
                    estimate={c.estimate}
                    progress={`進捗　${p}/${d}`}
                    onClick={() => {
                      setContent(i);
                      navigate("/courses/details");
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

export default Courses;
