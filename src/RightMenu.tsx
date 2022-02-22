import React from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";
import { logout } from './AuthContext';

const SidebarBox = styled.div`
  background: #F7F7F7;
  position: absolute;
  height: 100%;
  z-index: 2;
  margin: 0;
  padding: 0;
  right: 0;
  top: 0;
`
const SidebarList = styled.div`
  list-style-type: none;
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

const FlexDiv = styled.div`
  justify-content: flex-end;
  display: flex;
`

const Text = styled.span`
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 29px;
`

const SmallText = styled.span`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
`

const Bar = styled.hr`
  border-width: 0 0 2px;
  border-style: solid;
  color: #A8A8A8;
  overflow: visible;
  text-align: center;
  height: 5px;
`

const Item = styled.li`
  border-color: #e2e8f0;
  border-style: solid;
  border-width: 0;
  box-sizing: border-box;
`

const SideLink = styled(Link)`
  color: black;
  text-decoration: none;
`

const Elem = styled.div`
  padding: 0.3rem 1.5rem;
`

const Logout = styled.button`
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
`

type SiteItemProps = {
  to: string;
  text: string;
}

const SideItem = ({to, text} : SiteItemProps) => {
  return (
    <Item>
      <SideLink to={to}>
        <Elem>
          <Text>{text}</Text>
        </Elem>
      </SideLink>
    </Item>
  );
}

const SmallItem = ({to, text} : SiteItemProps) => {
  return (
    <Item>
      <SideLink to={to}>
        <Elem>
          <SmallText>{text}</SmallText>
        </Elem>
      </SideLink>
    </Item>
  );
}

export type RightMenuProps = {
  onClose?: () => void;
}

const RightMenu = ({onClose}: RightMenuProps) => {
  return (
    <SidebarBox>
      <FlexDiv>
        <Close onClick={onClose} />
      </FlexDiv>
      <SidebarList>
        <SideItem key="profile" to="/profile" text="プロフィール編集" />
        <SideItem key="plans" to="/plans" text="プラン変更" />
        <SideItem key="invite" to="/invite" text="友人紹介" />
      </SidebarList>
      <Bar />
      <SidebarList>
        <SmallItem key="usage" to="/usage" text="ご利用の流れ" />
        <SmallItem key="terms" to="/terms" text="利用規約" />
        <SmallItem key="privacy" to="/privacypolicy" text="プライバシーポリシー" />
        <SmallItem key="tokutei" to="/regulation" text="特定商取引法に基づく表記" />
        <SmallItem key="company" to="/company" text="運営会社" />
        <SmallItem key="contact" to="/contact" text="お問い合わせ" />
        <Item>
          <Logout onClick={logout}>
            <Elem>
              <SmallText>ログアウト</SmallText>
            </Elem>
          </Logout>
        </Item>
      </SidebarList>
    </SidebarBox>
  );
}

export default RightMenu;
