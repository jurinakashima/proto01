import React from 'react';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from './AuthContext';
import Container, { Header } from './Container';
import SideMenu from './SideMenu';
import { ControlBox } from './Parts';
import YouTube from 'react-youtube';

const Box = styled.div`
  height: 80%;
  width: 80%;
  padding-left: 10%;
  padding-right: 10%;

  .container {
    height: 100%;
  }
`

const PlayMovie = ({movie}: {movie: string | undefined}) => {
  const { user } = useContext(AuthContext);

  const opts = {
    height: "100%",
    width: "100%"
  };

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>動画コンテンツ</Header>
        <ControlBox back />
        <Box>
          <YouTube containerClassName="container" videoId={movie} opts={opts} />
        </Box>
      </Container>
    );
}

export default PlayMovie;
