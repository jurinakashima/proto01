import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { AuthContext } from './AuthContext';
import Container, { Header, Restrict } from './Container';
import SideMenu from './SideMenu';
import { SearchBox } from './Parts';
import { query, where, collection, getDocs } from "firebase/firestore";
import { userToContent } from './types';
import { lunr } from './lunr';

const Box = styled.button`
  aspect-ratio: 1 / 1;
  margin-top: 0;
  margin-left: 0;
  background: #FFFFFF;
  box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  cursor: pointer;
  border: none;
  position: relative;
`

const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
  color: #1F3C56;
  position: absolute;
  bottom: 4%;
  left: 0;
  padding-right: 5%;
  padding-left: 5%;
`

const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 90%;
  height: 75%;
  padding-top: 1%;
  padding-right: 5%;
  padding-left: 5%;
`

type CardProp = {
  style?: any;
  title: string;
  link: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Card = ({style, title, link, onClick}: CardProp) => {
  return (
    <Box onClick={onClick} style={style}>
      <Img src={`https://img.youtube.com/vi/${link}/default.jpg`} alt="thumbnail" />
      <Title>{title}</Title>
    </Box>
  );
}

const ScrollBox = styled.div`
  height: 77%;
  padding-left: 4%;
  padding-bottom: 1%;
  width: 80%;
  margin-bottom: 0;
  margin-top: 0;
  overflow-y: auto;

  display: grid;
  grid-template-columns: 30% 30% 30%;
  gap: 3%;
`

const CategoriesBox = styled.div`
  height: 5%;
  width: 92%;
  padding-bottom: 0.5%;
  margin-top: 1%;
  margin-bottom: 1%;
  margin-right: 4%;
  margin-left: 4%;
`

const Category = styled.div`
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

const CategoryBox = styled.button`
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

const Movies = ({setMovie}: any) => {
  const [ movies, setMovies ] = useState<any>({});
  const [ filteredMovies, setFilteredMovies ] = useState<any[]>([]);
  const [ categories, setCategories ] = useState<string[]>([]);
  const [ category, setCategory ] = useState("");
  const [ searchText, setSearch ] = useState("");
  const [ idx, setIdx ] = useState<lunr.Index | undefined>(undefined);
  const { user, db } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      if (user) {
        const token = await user.getIdTokenResult();
        const querySnapshot =
          await getDocs(query(collection(db, "movies"),
                              where("plans", "array-contains-any", userToContent(token.claims.plan as any))));
        let dst: any[] = [];
        let dst_: any = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          dst.push({...data, id: doc.id});
          dst_[doc.id] = {...data, id: doc.id};
        });
        setMovies(dst_);
        setFilteredMovies(dst);
        setIdx(lunr(function () {
          this.use(lunr.ja);
          this.ref('id');
          this.field('title');
          dst.forEach((m) => {
            this.add(m);
          });
        }));
        const cs = Array.from(new Set(dst.flatMap((m) => m.categories)));
        setCategories(cs);
      }
    })();
  }, [db, user]);

  const navigate = useNavigate();

  if (!user)
    return <Navigate to="/login" />;
  else
    return (
      <Container sideContents={<SideMenu />}>
        <Header>動画コンテンツ</Header>
        <Restrict>
          <SearchBox onChange={(e) => setSearch(e.target.value)} onSubmit={async () => {
            if (idx) {
              setFilteredMovies(idx.search(searchText).map((res) => movies[res.ref]));
            }
          }} />
          <CategoriesBox>
            <Category>カテゴリ</Category>
            <Horizontal>
              {categories.map((c) => {
                return (
                  <CategoryBox key={c} style={{background: c === category ? "#CFF3F1" : "white"}} onClick={() => {
                    if (c === category)
                      setCategory("");
                    else
                      setCategory(c);
                  }}>
                    {c}
                  </CategoryBox>
                );
              })}
            </Horizontal>
          </CategoriesBox>
          <ScrollBox>
            {filteredMovies
              .filter((m) => category === '' || m.categories.includes(category))
              .map((m) => {
                return (
                  <Card
                    key={m.id}
                    title={m.title}
                    link={m.link}
                    onClick={() => {
                      setMovie(m.link);
                      navigate("play");
                    }} />
                );
            })}
          </ScrollBox>
        </Restrict>
      </Container>
    );
}

export default Movies;
