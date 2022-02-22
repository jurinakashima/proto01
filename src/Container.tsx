import React from 'react';
import { useState } from 'react';
import styled from "styled-components";
import StatusBar from './StatusBar';
import Footer from './Footer';
import RightMenu from './RightMenu';

const NavSideBar = styled.nav`
  position: fixed;
  display: block;
  width: 15vw;
  inset: min(10vh, 55px) auto 0 0;
`

const Layout = styled.div`
  padding-left: 15vw;
`

const RightMenuLayout = styled.div`
  position: relative;
`

const Contents = styled.div`
  height: calc(100vh - min(10vh, 45px) - 5vh);
  background: #F8F8F8;
`

const ContentsShort = styled.div`
  height: calc(100vh - min(10vh, 45px) - 15vh);
  background: #F8F8F8;
`

export const Header = styled.div`
  width: calc(100% - 1.5vw);
  height: 5%;
  background: #5A8FEB;
  padding-left: 1.5vw;
  color: #ffffff;
  font-size: max(1.5vh, 13px);

  display: flex;
  flex: 0 0 auto;
  justify-content: left;
  align-items: center;
`

export const Restrict = styled.div`
  width: min(100%, 1600px);
  height: 95%;
`

const Normal = styled.div`
  position: relative;
  z-index: 0;
`

const Mask = styled.div`
  background: rgba(97, 97, 97, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`

export type ContainerProps = {
  children: React.ReactNode;
  sideContents?: React.ReactNode;
  footer?: boolean;
};

const Screen = ({ sideContents, children, footer }: ContainerProps) =>
  sideContents ?
  <>
    <Layout>
      <NavSideBar>
        {sideContents}
      </NavSideBar>
      {footer ? <ContentsShort>{children}</ContentsShort> : <Contents>{children}</Contents>}
    </Layout>
    {footer ? <Footer /> : undefined}
  </> :
  <>
    {footer ? <ContentsShort>{children}</ContentsShort> : <Contents>{children}</Contents>}
    {footer ? <Footer /> : undefined}
  </>
;

const Container = ({ sideContents, children, footer }: ContainerProps) => {
  const [ menu, setMenu ] = useState(false);
  const onClick = () => setMenu(!menu);
  return (
    <>
      <StatusBar onClick={onClick}/>
      <RightMenuLayout>
        <Normal>
          <Screen sideContents={sideContents} footer={footer}>
            {children}
          </Screen>
        </Normal>
        { menu ? <Mask /> : undefined }
        { menu ? <RightMenu onClose={() => setMenu(false)}/> : undefined }
      </RightMenuLayout>
    </>
  );
}


export default Container;
