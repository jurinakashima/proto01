import React from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';

const Box = styled.div`
  background: white;
  width: 100%;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  max-width: 1000px;
  margin: 0 auto;
  height: 10vh;
`

const Column = styled.div`
  height: 100%;
  margin: 0 auto;
`

const Row = styled.div`
  height: 33%;
  flex-direction: row;
  display: -webkit-flex;
  display: flex;
`

const FooterLink = styled(Link)`
  color: black;
  margin-bottom: 0;
  font-size: 16px;
  text-decoration: none;

  &:hover {
  color: #5A8FEB;
  transition: 200ms ease-in;
  }
`

const Footer = () => {
  return (
    <Box>
      <Container>
        <Row/>
        <Row/>
        <Row>
          <Column>
            <FooterLink to="/terms">利用規約</FooterLink>
          </Column>
          <Column>
            <FooterLink to="/privacypolicy">プライバシーポリシー</FooterLink>
          </Column>
          <Column>
            <FooterLink to="/regulation">特定商取引法に基づく記載</FooterLink>
          </Column>
          <Column>
            <FooterLink to="/company">運営会社</FooterLink>
          </Column>
          <Column>
            <FooterLink to="/contact">お問い合わせ</FooterLink>
          </Column>
        </Row>
      </Container>
    </Box>
  );
};
export default Footer;
