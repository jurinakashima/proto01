import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import { SearchBox } from './Parts';
import { query, collection, getDocs } from "firebase/firestore";
import { SkillToTitle } from './Profile';
import { Skill, ALL_SKILLS, expToStr } from './types';
import { lunr } from './lunr';
import person from './placeholder.svg';
import github from './pics/github.svg';
import twitter from './pics/twitter.svg';
import facebook from './pics/facebook.svg';

const Box = styled.div`
  aspect-ratio: 1.6 / 1;
  margin-top: 0;
  margin-left: 0;
  background: #FFFFFF;
  box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  border: none;
  display: grid;
  grid-template-columns: 30% 70%;
`

const Title = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  font-weight: bold;
  font-size: 16px;
  color: #1F3C56;
  padding-right: 5%;
  padding-left: 5%;
`

const Small = styled.div`
  background: none;
  border: none;
  font-weight: normal;
  font-size: 12px;
  color: #1F3C56;
  padding-right: 5%;
  padding-left: 5%;
`

const Img = styled.img`
  width: 100%;
  height: 75%;
  border-radius: 50%;
`

const LeftBox = styled.div`
  height: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-rows: 50% 50%;
`

const LeftBottomBox = styled.div`
  position: relative;
  height: 100%;
`

const LeftBottomTopBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transform: translate(-50%,0);
`

const SNSBox = styled.div`
  display: flex;
  gap: 4%;
  height: 18%;
`

const RightBox = styled.div`
  height: 100%;
  display: grid;
  justify-items: left;
  grid-template-rows: 30% 20% 50%;
`

const RightBottomBox = styled.div`
  display: grid;
  grid-template-columns: 90% 10%;
  width: 90%;
  padding-right: 5%;
  padding-left: 5%;
  padding-top: 3%;
  height: 60%;
`

const RightRightBottomBox = styled.div`
  position: relative;
`

const Rest = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;

  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  line-height: 14px;

  color: #5A8FEB;
`

const SmallSkillBox = styled.div`
  display: grid;
  gap: 3%;
`

const SkillCard = styled.div`
  background: #E0EBFF;

  height: 1.5vh;
  width: fit-content;
  font-family: Noto Sans JP;
  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;

  padding-left: 5%;
  padding-right: 5%;

  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;

  color: #5A8FEB;
`

type CardProp = {
  user: any;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Card = ({user, onClick}: CardProp) => {
  const skills = [...user.skills].slice(0, 9);
  const rest = user.skills.length - 9;
  const src = user?.photoURL ? user?.photoURL : person;

  return (
    <Box>
      <LeftBox>
        <Img src={src} alt="user" />
        <LeftBottomBox>
          <LeftBottomTopBox>
            <SNSBox>
              <a href={user.facebook}>
                <img src={facebook} alt="facebook" height="100%"/>
              </a>
              <a href={user.twitter}>
                <img src={twitter} alt="twitter" height="100%"/>
              </a>
              <a href={user.github}>
                <img src={github} alt="github" height="100%"/>
              </a>
            </SNSBox>
          </LeftBottomTopBox>
        </LeftBottomBox>
      </LeftBox>
      <RightBox>
        <Title onClick={onClick}>{user.name}</Title>
        <Small>IT経験 - {expToStr(user.experience)}</Small>
        <RightBottomBox>
          <SmallSkillBox>
            {skills.map((s, i) => <SkillCard key={SkillToTitle(s)} style={{ gridColumn: i % 3 + 1 }}>{SkillToTitle(s)}</SkillCard>)}
          </SmallSkillBox>
          <RightRightBottomBox>
            <Rest>
              { rest > 0 ? `+${rest}` : undefined }
            </Rest>
          </RightRightBottomBox>
        </RightBottomBox>
      </RightBox>
    </Box>
  );
}

const ScrollBox = styled.div`
  width: 80%;
  padding-left: 4%;
  padding-bottom: 1%;
  height: 77%;
  margin: 0;
  overflow-y: auto;

  display: grid;
  grid-template-columns: 31% 31% 31%;
  gap: 3%;
`

const SkillsBox = styled.div`
  height: 5%;
  width: 92%;
  padding-bottom: 0.5%;
  margin-top: 1%;
  margin-bottom: 1%;
  margin-right: 4%;
  margin-left: 4%;
`

const SkillTitle = styled.div`
  font-weight: bold;
  font-size: 1.5vh;
  color: #1F3C56;
  padding-bottom: 0.5%;
  height: 40%;
`

const Horizontal = styled.div`
  gap: 0 1vw;
  display: -webkit-flex;
  display: flex;
  height: 50%;
  padding-bottom: 1%;
  overflow-x: auto;
`

const SkillBox = styled.button`
  width: auto;
  min-height: 23px;
  height: 100%;
  margin-top: 0;
  margin-left: 0;
  margin-top: 0;
  cursor: pointer;
  border: none;
  position: relative;
  background: #CFF3F1;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;

  font-family: Noto Sans JP;
  font-style: normal;
  font-size: 16px;
  line-height: 23px;
`

const Members = ({setMember}: any) => {
  const [ users, setUsers ] = useState<any>({});
  const [ filteredUsers, setFilteredUsers ] = useState<any[]>([]);
  const [ skills, setSkills ] = useState<Skill[]>([]);
  const [ searchText, setSearch ] = useState("");
  const [ idx, setIdx ] = useState<lunr.Index | undefined>(undefined);
  const { user, db } = useContext(AuthContext);

  const setSelected = (s: Skill) => {
    const ss_ = [...skills, s].filter((value, index, self) =>
      index === self.findIndex((t) => SkillToTitle(t) === SkillToTitle(value)));
    setSkills(ss_);
  };
  const removeSelected = (s: Skill) => {
    const ss_ = [...skills.filter((s_) => s_ !== s)];
    setSkills(ss_);
  };

  useEffect(() => {
    (async () => {
      if (user) {
        const querySnapshot = await getDocs(query(collection(db, "users")));
        let dst: any[] = [];
        let dst_: any = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          dst.push({...data, id: doc.id});
          dst_[doc.id] = {...data, id: doc.id};
        });
        setUsers(dst_);
        setFilteredUsers(dst);
        setIdx(lunr(function () {
          this.use(lunr.ja);
          this.ref('id');
          this.field('name');
          dst.forEach((m) => {
            this.add(m);
          });
        }));
      }
    })();
  }, [db, user]);

  const navigate = useNavigate();

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>メンバー</Header>
        <Restrict>
          <SearchBox onChange={(e) => setSearch(e.target.value)} onSubmit={async () => {
            if (idx) {
              setFilteredUsers(idx.search(searchText).map((res) => users[res.ref]));
            }
          }} />
          <SkillsBox>
            <SkillTitle>スキル</SkillTitle>
            <Horizontal>
              {ALL_SKILLS.map((s) => {
                return (
                  <SkillBox key={s} style={{background: skills.includes(s) ? "#CFF3F1" : "white"}} onClick={() => {
                    if (skills.includes(s))
                      removeSelected(s)
                    else
                      setSelected(s)
                  }}>
                    {SkillToTitle(s)}
                  </SkillBox>
                );
              })}
            </Horizontal>
          </SkillsBox>
          <ScrollBox>
            {filteredUsers
              .filter((m) => skills.every((s) => m.skills.includes(s)))
              .map((m) => {
                return (
                  <Card
                    key={m.id}
                    user={m}
                    onClick={() => {
                      setMember(m);
                      navigate("detail");
                    }} />
                );
            })}
          </ScrollBox>
        </Restrict>
      </Container>
    );
}

export default Members;
