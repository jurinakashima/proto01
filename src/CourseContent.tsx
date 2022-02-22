import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import { ControlBox, plan2ja } from './Parts';
import { Content } from './types';
import { Document, Page } from 'react-pdf';
import { ref, getBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const initWidth = 400;
const maxWidth = 800;

const StyledDocument = styled(Document)`
  width: 100%;
`

const ScrollBox = styled.div`
  height: 80%;
  width: 80%;
  padding-left: 10%;
  padding-right: 10%;
  overflow-y: auto;
`

const Footer = styled.div`
  height: 3%;
  width: 92%;
  margin-top: 1%;
  margin-bottom: 1%;
  margin-right: 4%;
  margin-left: 4%;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
`

const Button = styled.button`
  cursor: pointer;
  width: 7vw;
  height: 3vh;
  color: white;
  background-color: #5A8FEB;
  border-radius: 30px;
  border: none;
  margin: 0 auto;
  font-size: 16px;
  :disabled {
  background: #ccc;
  }
`

const CourseContent = ({plan, contents, setContents, progress, setProgress, content: j, detail: i}: {plan: string; contents: Content[]; setContents: (_: Content[]) => void; progress: any[]; setProgress: (_: any[]) => void; content: number; detail: number;}) => {
  const { user, storage, db } = useContext(AuthContext);
  const [ sbw, setSbw ] = useState(initWidth);
  const [ bytes, setBytes ] = useState(new ArrayBuffer(0));
  const [ numPages, setNumPages ] = useState(null);
  const id = contents[j]?.id;
  const link = contents[j]?.details[i]?.link;

  const onClick = async () => {
    let clear = contents[j].clear;
    if (user) {
      clear[i] = true;
      let p = progress.findIndex(({ref}: any) => ref.id === id);
      progress[p] = { clear, ref: doc(db, "contents", id) };
      await setDoc(doc(db, "progress", user.uid), { progress });
      setContents([...contents]);
      setProgress([...progress]);
    }
  };

  useEffect(() => {
    (async () => {
      if (user) {
        setBytes(await getBytes(ref(storage, link)));
      }
    })();
  }, [user, storage, link]);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  if (!id)
    return <Navigate to="/courses" />;
  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>{`学習コース - ${plan2ja(plan)}`}</Header>
        <Restrict>
          <ControlBox back />
          <ScrollBox ref={(sb) => setSbw(Math.min(maxWidth, 0.8 * (sb?.clientWidth ?? initWidth))) }>
            <StyledDocument
              file={{ data: bytes }}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(
                new Array(numPages),
                (el, index) => (
                  <Page
                    width={sbw}
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                  />
                ),
              )}
            </StyledDocument>
          </ScrollBox>
          <Footer>
            <Button disabled={contents[j].clear[i]} onClick={onClick}>完了</Button>
          </Footer>
        </Restrict>
      </Container>
    );
}

export default CourseContent;
