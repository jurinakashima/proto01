import React from 'react';
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Edit, Play, People } from 'react-iconly';

const SidebarList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`

const FlexSpan = styled.span`
  align-items: center;
  display: flex;
`

const Text = styled.span`
  font-weight: 500;
  margin-left: 1rem;
  margin-right: 1rem;
`

const Item = styled.li`
  border-color: #e2e8f0;
  border-style: solid;
  border-width: 0;
  box-sizing: border-box;
`

const SideLink = styled(Link)`
  text-decoration: none;
`

const Elem = styled.div`
  padding: 0.75rem 1.5rem;
`

type SiteItemProps = {
  to: string;
  icon: (selected: boolean) => React.ReactNode;
  text: string;
}

const SideItem = ({to, icon, text} : SiteItemProps) => {
  const location = useLocation();
  const selected = location.pathname.match(to) != null;
  const color = selected ? "#5A8FEB" : "black";
  return (
    <Item>
      <SideLink style={{color: color}} to={to}>
        <Elem>
          <FlexSpan>
            {icon(selected)}
            <Text>{text}</Text>
          </FlexSpan>
        </Elem>
      </SideLink>
    </Item>
  );
}

const SideMenu = () => {
  return (
    <SidebarList>
      <SideItem key="learn" to="/courses" icon={(selected) => <Edit primaryColor={selected ? "#5A8FEB" : "black"} />} text="学習コース" />
      <SideItem key="movie" to="/movies" icon={(selected) => <Play primaryColor={selected ? "#5A8FEB" : "black"} />} text="動画コンテンツ" />
      <SideItem key="members" to="/members" icon={(selected) => <People primaryColor={selected ? "#5A8FEB" : "black"} />} text="メンバー" />
    </SidebarList>
  );
}

export default SideMenu;
