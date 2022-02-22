import React from 'react';
import { useRef, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from "styled-components";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import person from './placeholder.svg';
import github from './pics/github.svg';
import twitter from './pics/twitter.svg';
import facebook from './pics/facebook.svg';
import { Skill, ALL_SKILLS } from './types';

const Title = styled.div`
  padding-top: 3%;
  font-weight: bold;
  font-size: 24px;
  color: #1F3C56;
`

const TitleSmall = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: #1F3C56;
`

const ScrollBox = styled.div`
  height: 100%;
  width: 92%;
  padding-left: 4%;
  padding-right: 4%;
  overflow-y: auto;
`

const Form = styled.div`
  background: white;
  margin-top: 2%;
  margin-bottom: 2%;
  width: 100%;
`

const Item = styled.div`
  padding-top: 1%;
  padding-bottom: 1%;
  width: max(30%, 500px);
  margin: 0 auto;
`

const FlexBox = styled.div`
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const Img = styled.img`
  width: min(100%, 5vw);
  height: 100%;
  border-radius: 50%;
`

const ImgBox = styled.div`
  display: grid;
  gap: 4%;
`

const SNSBox = styled.div`
  display: grid;
  gap: 4%;
`

const SNSIcon = styled.img`
  width: 33%;
  height: min(100%, 20px);
`

const FlexSpan = styled.span`
  gap: 2%;
  align-items: center;
  display: flex;
  width: 100%;
  height: 3vh;
`

const SNSInput = styled.input`
  background: #F8F8F8;
  border: 1px solid #A8A8A8;
  box-sizing: border-box;
  height: 100%;
`

const Input = styled.input`
  background: #F8F8F8;
  border: 1px solid #A8A8A8;
  box-sizing: border-box;
  width: 100%;
  height: 4vh;
`

const TextArea = styled.textarea`
  background: #F8F8F8;
  border: 1px solid #A8A8A8;
  box-sizing: border-box;
  width: 100%;
  height: 12vh;
`

const Button = styled.button`
  cursor: pointer;
  width: 100%;
  height: max(4vh, 40px);
  color: white;
  background-color: #5A8FEB;
  border-radius: 30px;
  border: none;
  font-size: 16px;
  :disabled {
  background: #ccc;
  }
`

const Select = styled.select`
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

const CardBox = styled.div`
  display: flex;
  justify-content: left;
  height: 100%;
`
const Card = styled.div`
  background: #E0EBFF;

  font-family: Noto Sans JP;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;

  padding-top: 5%;
  padding-bottom: 5%;
  padding-left: 5%;
  padding-right: 5%;

  color: #5A8FEB;
`
const Close = styled.button`
  cursor: pointer;
  background: #E0EBFF;
  display: block;
  position: relative;
  border: none;
  border-left: 1px dashed #383838;
  width: 20%;

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


const SkillCard = ({style, title, onClose}: {style?: any, title: string; onClose?: () => void;}) => {
  return (
    <CardBox style={style}>
      <Card>{title}</Card>
      <Close onClick={onClose} />
    </CardBox>
  );
}

const SkillButton = styled.button`
  cursor: pointer;
  background: #C7C7C7;
  height: min(3vh, 30px);
  margin-right: 3%;
  margin-left: 3%;
  border: none;
`

type SkillBoxProps = {
  skills: Skill[];
  onChange? : (_: Skill[]) => void;
}

const Box = styled.div`
`
const AllSkills = styled.div`
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
  padding: 3%;
  gap: 2% 0;
`
const Selected = styled.div`
  display: grid;
  grid-template-columns: 20% 20% 20% 20% 20%;
  border: 1px dashed #383838;
  padding: 3%;
  gap: 2% 0;
`

const Split = styled.div`
  display: grid;
  grid-template-columns: 65% 30%;
  gap: 0 5%;
`

export const SkillToTitle = (s: Skill) => {
  if (typeof s === 'string')
    return s;
  else
    return s.custom;
}

const SkillBox = ({skills, onChange}: SkillBoxProps) => {
  const [ ss, setSS ] = useState<Skill[]>(skills);
  const [ custom, setCustom ] = useState("");
  useEffect(() => setSS(skills), [skills]);
  const setSelected = (s: Skill) => {
    const ss_ = [...ss, s].filter((value, index, self) =>
      index === self.findIndex((t) => SkillToTitle(t) === SkillToTitle(value)));
    setSS(ss_);
    if (onChange)
      onChange(ss_);
  };
  const removeSelected = (s: Skill) => {
    const ss_ = [...ss.filter((s_) => s_ !== s)];
    setSS(ss_);
    if (onChange)
      onChange(ss_);
  };
  return (
    <Box>
      <Selected>
        {ss.map((s) => <SkillCard key={SkillToTitle(s)} title={SkillToTitle(s)} onClose={() => removeSelected(s)}/>)}
      </Selected>
      候補から選択、または検索ボックスから追加してください
      <AllSkills>
        {ALL_SKILLS.map((s) => <SkillButton key={s} disabled={ss.includes(s)} onClick={() => setSelected(s)}>{s}</SkillButton>)}
      </AllSkills>
      <Split>
        <Input value={custom} type="name" placeholder="保有スキル" onChange={(e) => setCustom(e.target.value)}/>
        <Button onClick={() => setSelected({custom})}>追加</Button>
      </Split>
    </Box>
  );
}

const placeholder = {
  github: "",
  twitter: "",
  facebook: "",
  experience: 0,
  selfIntroduction: "",
  skills: [],
  study: "",
  want: "",
  name: "",
  photoURL: "",
};

const Profile = () => {
  const { user, storage, db } = useContext(AuthContext);
  const inputRef = useRef<any>(undefined);
  const [ data, setData ] = useState<any>({...placeholder, name: user?.displayName ?? "", photoURL: user?.photoURL ?? ""});
  const [ enable, setEnable ] = useState(true);

  useEffect (() => {
    (async () => {
    if (user) {
      const doc_ = await getDoc(doc(db, "users", user.uid));
      const data = doc_.data();
      if (data) setData({...data, name: user.displayName ?? "", photoURL: user.photoURL ?? ""});
    }})();
  }, [db, user]);

  const save = async () => {
    if (user) {
      setEnable (false);
      await updateProfile(user, {displayName: data.name});
      await setDoc(doc(db, "users", user.uid), data);
      setEnable (true);
    }
  };

  // TODO: いきなりへんこうしてしまってよいか？
  const handleChangeFile = (e: any) => {
    let targetFile = e.target.files[0];
    let reader = new FileReader();
    if (targetFile !== undefined && user) {
      reader.readAsArrayBuffer(targetFile);
      reader.onload = async () => {
        const result = (reader.result ?? new Uint8Array()) as ArrayBuffer;
        const snapshot = await uploadBytes(ref(storage, `/users/pics/${user.uid}`), result, {contentType: targetFile.type});
        const url = await getDownloadURL(snapshot.ref);
        await updateProfile(user, {photoURL: url});
        setData({ ...data, photoURL: url });
      };
    }
  };

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>プロフィール編集</Header>
        <Restrict>
          <ScrollBox>
            <Title>プロフィール編集</Title>
            <Form>
              <Item>
                <FlexBox>
                  <ImgBox>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={inputRef}
                      type="file"
                      onChange={handleChangeFile}
                    />
                    <TitleSmall>画像</TitleSmall>
                    <Img onClick={() => inputRef.current.click()} src={user?.photoURL ?? person} alt="profile" />
                  </ImgBox>
                  <SNSBox>
                    <FlexSpan>
                      <SNSIcon src={facebook} alt="facebook" />
                      <SNSInput value={data.facebook} type="url" placeholder="Facebook URL" onChange={(e) => setData({ ...data, facebook: e.currentTarget.value })}/>
                    </FlexSpan>
                    <FlexSpan>
                      <SNSIcon src={twitter} alt="twitter" />
                      <SNSInput value={data.twitter} type="url" placeholder="Twitter URL" onChange={(e) => setData({ ...data, twitter: e.currentTarget.value })}/>
                    </FlexSpan>
                    <FlexSpan>
                      <SNSIcon src={github} alt="github" />
                      <SNSInput value={data.github} type="url" placeholder="GitHub URL" onChange={(e) => setData({ ...data, github: e.currentTarget.value })}/>
                    </FlexSpan>
                  </SNSBox>
                </FlexBox>
              </Item>
              <Item>
                <TitleSmall>名前</TitleSmall>
                <Input value={data.name} type="name" placeholder="名前" onChange={(e) => setData({ ...data, name: e.currentTarget.value })}/>
              </Item>
              <Item>
                <TitleSmall>IT経験</TitleSmall>
                <Select value={data.experience} placeholder="IT経験" onChange={(e) => setData({ ...data, experience: parseInt(e.currentTarget.value) })}>
                  <option value="0">未経験</option>
                  <option value="1">1~2年</option>
                  <option value="3">3~5年</option>
                  <option value="5">5~10年</option>
                  <option value="11">11年以上</option>
                </Select>
              </Item>
              <Item>
                <TitleSmall>自己紹介</TitleSmall>
                <TextArea value={data.selfIntroduction} placeholder="自己紹介" onChange={(e) => setData({ ...data, selfIntroduction: e.currentTarget.value })}/>
              </Item>
              <Item>
                <TitleSmall>保有スキル</TitleSmall>
                <SkillBox skills={data.skills} onChange={(ss) => setData({ ...data, skills: ss })}/>
              </Item>
              <Item>
                <TitleSmall>勉強しているorしてみたい技術・言語など</TitleSmall>
                <TextArea value={data.study} placeholder="勉強しているorしてみたい技術・言語など" onChange={(e) => setData({ ...data, study: e.currentTarget.value })}/>
              </Item>
              <Item>
                <TitleSmall>こんなサービス創りたい・創れるようになりたい</TitleSmall>
                <TextArea value={data.want} placeholder="こんなサービス創りたい・創れるようになりたい" onChange={(e) => setData({ ...data, want: e.currentTarget.value })}/>
              </Item>
              <Item>
                <Button disabled={!enable} onClick={save}>プロフィールを更新</Button>
              </Item>
            </Form>
          </ScrollBox>
        </Restrict>
      </Container>
    );
}

export default Profile;
