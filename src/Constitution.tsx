import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import { ControlBox } from './Parts';
import { Document, Page } from 'react-pdf';
import { ref, getBytes } from "firebase/storage";

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

const Constitution = () => {
  const { user, storage } = useContext(AuthContext);
  const [ sbw, setSbw ] = useState(initWidth);
  const [ bytes, setBytes ] = useState(new ArrayBuffer(0));
  const [ numPages, setNumPages ] = useState(null);

  useEffect(() => {
    (async () => {
      if (user) {
        setBytes(await getBytes(ref(storage, "constitution.pdf")));
      }
    })();
  }, [user, storage]);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>○○○○の全体構成</Header>
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
        </Restrict>
      </Container>
    );
}

export default Constitution;
