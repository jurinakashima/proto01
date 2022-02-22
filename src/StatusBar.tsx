import { useContext } from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Notification } from 'react-iconly';
import person from './placeholder.svg';
import { AuthContext } from './AuthContext';

const NavBar = styled.nav`
  position: sticky;
  top: 0;
`

const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  height: min(10vh, 55px);
`

const Name = styled.div`
  text-align: left;
  cursor: pointer;
  user-select: none;
  padding-right: 3vw;
`

const NotifyDiv = styled.div`
  text-align: center;
`

const RoundedImg = styled.img`
  border-radius: 50%;
  width: 3vw;
  height: min(9vh, 40px);
`

const LogoDiv = styled.div`
  height: min(9vh, 40px);
`

const Logo = () => <LogoDiv> ROGO </LogoDiv>;

const Right = styled.div`
  gap: 0 5vw;
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-end;
  align-items: center;
`

const Left = styled.div`
  gap: 0 5vw;
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-end;
  align-items: center;
`

const SignUp = styled(Link)`
  text-align: left;
  text-decoration: none;
  color: black;
`

const Login = styled(Link)`
  text-decoration: none;
  text-align: left;
  padding-right: 3vw;
  color: black;
`

export type StatusBarProp = {
  onClick?: () => void;
}

const StatusBar = ({onClick}: StatusBarProp) => {
  const { user } = useContext(AuthContext);

  return (
    <NavBar>
      <Inner>
        <Left>
          <Logo />
        </Left>
        <Right>
          {
            !user ?
            <>
              <SignUp to="/signup">新規登録</SignUp>
              <Login to="/login">ログイン</Login>
            </> :
            <>
              <NotifyDiv>
                <Notification />
              </NotifyDiv>
              <RoundedImg src={user?.photoURL ?? person} alt="user" />
              <Name onClick={onClick}>{user?.displayName}</Name>
            </>
          }
        </Right>
      </Inner>
    </NavBar>
  );
}

export default StatusBar;
