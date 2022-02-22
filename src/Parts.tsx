import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import Container from './Container';
import { Search } from 'react-iconly';

const FormDiv = styled.div`
  position: absolute;
  width: 30vw;
  height: 60vh;
  margin:auto;
  padding:20px;
  left:40%;
  top:30%;
  margin-left:-7vw;
  margin-top:-20vh;
  overflow-y: auto;
`

const InputDiv = styled.div`
  padding-top:1vh;
  padding-bottom:1vh;
  border-radius: 5px;
  background-color: #fff;
`

const FormTitle = styled.div`
  padding-top:1vh;
  padding-bottom:1vh;
  align-items: center;
  text-align: center;
  font-size: 24px;
`

const FormWrapper = styled.form`
  width:100%;
  height:100%;
  top:0;
  left:0;
  transition:all .3s ease;
`

export const FormItem = styled.div`
  display: block;
  padding-top: 1vh;
  padding-bottom: 1vh;
  margin: 0.3vh auto;
  width: 80%;
`

const Input = styled.input`
  background-color: #EFEFEF;
  display: block;
  width: 100%;
  height: 3vh;
  padding: 0 0;
  border:1px solid #ccc;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  -moz-background-clip: padding;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  font-family: Noto Sans JP;
  font-size: 140%;
  letter-spacing: .8px;
`

const SearchInput = styled(Input)`
  width: 30%;
`

export const OR = styled.hr`
  border-width: 0 0 2px;
  border-style: solid;
  color: #A8A8A8;
  overflow: visible;
  text-align: center;
  height: 5px;

  :after {
  background: #fff;
  content: 'OR';
  position: relative;
  padding-right: 30px;
  padding-left: 30px;
  top: -3px;
  }
`

const FormLabel = styled.p`
  font-family: Noto Sans JP;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 29px;
  color: #383838;
  margin: 8px 0;
`

export const Button = styled.button`
  cursor: pointer;
  width: 100%;
  height: 4vh;
  color: white;
  background-color: #5A8FEB;
  border-radius: 30px;
  border: none;
  font-size: 16px;
  :disabled {
  background: #ccc;
  }
`

const SearchButton = styled.button`
  width: 3vw;
  height: 3vh;
  justify-items: center;
`

export const FBButton = styled.button`
  cursor: pointer;
  width: 100%;
  height: 4vh;
  color: white;
  background-color: #4BA1FF;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  :disabled {
  background: #ccc;
  }
`

export const InputLink = styled(Link)`
  color: black;
  margin-bottom: 0;
  text-decoration: none;
`

export type InputBoxProps = {
  type_: string;
  autoComplete: string;
  text: string;
  children?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

export const InputBox = ({ type_, autoComplete, text, onChange, children }: InputBoxProps) => {
  return (
    <FormItem>
      <FormLabel>{text}</FormLabel>
      <Input type={type_} autoComplete={autoComplete} onChange={onChange} />
      {children}
    </FormItem>
  );
}

export type AuthTemplateProps = {
  title: string;
  children?: React.ReactNode;
  onSubmit?: React.ChangeEventHandler<HTMLFormElement> | undefined;
}

export const AuthTemplate = ({ title, children, onSubmit }: AuthTemplateProps) => {
  return (
    <Container sideContents={undefined} footer>
      <FormWrapper onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit)
          onSubmit(e as any);
      }}>
        <FormDiv>
          <FormTitle>{title}</FormTitle>
          <InputDiv>{children}</InputDiv>
        </FormDiv>
      </FormWrapper>
    </Container>
  );
}

const CheckBoxDiv = styled.div`
  width: 100%;
`

export type CheckBoxProps = {
  label: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

export const CheckBox = ({ label, onChange }: CheckBoxProps) => {
  return (
    <CheckBoxDiv>
      <input type="checkbox" onChange={onChange} />
      <label>{label}</label>
    </CheckBoxDiv>
  );
}

export type SelectProps = {
  values: string[];
  text: string;
  empty: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement> | undefined;
}

const AuthSelect = styled.select`
  background-color: #EFEFEF;
  display: block;
  width: 100%;
  height: 4vh;
  padding: 0 0;
  border:1px solid #ccc;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
  border-radius: 4px;
  -moz-background-clip: padding;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  font-family: Noto Sans JP;
  font-size: 100%;
  letter-spacing: .8px;
`

export const Select = ({ text, values, empty, onChange }: SelectProps) => {
  return (
    <FormItem>
      <FormLabel>{text}</FormLabel>
      <AuthSelect onChange={onChange}>
        <option value="">{empty}</option>
        {values.map((v) => <option value={v}>{v}</option>)}
      </AuthSelect>
    </FormItem>
  );
}

const ControlBoxDiv = styled.div`
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

const SearchBoxDiv = styled.form`
  gap: 0 1vw;
  justify-content: left;
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
`

const ToggleDiv = styled.div`
  gap: 0 1vw;
  height: 100%;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 0 0 auto;
`

export enum DoneYet {
  Yet,
  Done
}

const ToggleButton = styled.button`
  cursor: pointer;
  min-height: 25px;
  height: 80%;
  width: 7vw;
  border-color: #5A8FEB;
  border-radius: 30px;
  font-size: 14px;
  background: #fff;
  color: #5A8FEB;
  border: 1px solid;
  :disabled {
  color: white;
  background-color: #5A8FEB;
  border: none;
  }
`

const BackButton = styled.button`
  cursor: pointer;
  border: none;
  height: 80%;
  width: 7vw;
  min-height: 25px;
  background: #FFFFFF;
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 40px;
  justify-content: left;
`

const ToggleText = styled.div`
  font-weight: bold;
  text-align:center;
  vertical-align: middle;
`

const Toggle = ({ onChange }: { onChange?: (_: DoneYet) => void }) => {
  const [yet, setYet] = useState(true);
  const [done, setDone] = useState(false);

  return (
    <ToggleDiv>
      <ToggleText>表示切り替え</ToggleText>
      <ToggleButton disabled={yet} onClick={() => {
        setYet(true);
        setDone(false);
        if (onChange)
          onChange(DoneYet.Yet);
      }}>未完了</ToggleButton>
      <ToggleButton disabled={done} onClick={() => {
        setYet(false);
        setDone(true);
        if (onChange)
          onChange(DoneYet.Done);
      }}>完了済み</ToggleButton>
    </ToggleDiv>
  );
}

export type ControlBoxProps = {
  style?: any;
  back?: boolean;
  onChange?: (_: DoneYet) => void;
};

export const ControlBox = ({ style, back, onChange }: ControlBoxProps) => {
  const navigate = useNavigate();

  return (
    <ControlBoxDiv style={style}>
      {back ?? false ? <BackButton onClick={() => navigate(-1)}>戻る</BackButton> : <div />}
      {onChange ? <Toggle onChange={onChange} /> : undefined}
    </ControlBoxDiv>
  );
}

export const plan2ja = (plan: string) => {
  switch (plan) {
      case "PROGRAMMING":
      return "プログラミングコース";
      case "JOBHUNTING":
      return "就活コース";
      case "FREE":
      return "無料体験";
      case "UNLIMITED":
      return "使い放題コース";
      case "COMMUNITY":
      return "コミュニティコース";
      default:
      return "";
  }
}

const SearchIcon = styled(Search)`
  width: min(100%, 30px);
  height: min(100%, 30px);
`

export type SearchBoxProps = {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit?: () => Promise<void> | undefined;
};

export const SearchBox = ({onSubmit, onChange}: SearchBoxProps) => {
  return (
    <SearchBoxDiv onSubmit={async (e) => {
      e.preventDefault();
      if (onSubmit)
        await onSubmit();
    }}>
      <SearchInput placeholder="検索" type="search" autoComplete="off" onChange={onChange} />
      <SearchButton onClick={onSubmit}><SearchIcon /></SearchButton>
    </SearchBoxDiv>
  );
}

export const Paragraph = styled.p`
`

const Wrapper = styled.div`
  width:100%;
  height:98%;
  padding-top: 2%;
`

const Div = styled.div`
  width: min(70vw, 1600px);
  height: 70vh;
  margin: auto;
  overflow-y: auto;
`

export const H1 = styled.h1`
`

export const MiscTemplate = ({ title, children }: AuthTemplateProps) => {
  return (
    <Container sideContents={undefined} footer>
      <Wrapper>
        <Div>
          <ControlBox style={{height: "3.82%"}} back />
          <FormTitle>{title}</FormTitle>
          <InputDiv>{children}</InputDiv>
        </Div>
      </Wrapper>
    </Container>
  );
}
