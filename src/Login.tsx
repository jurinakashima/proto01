import React from 'react';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { AuthTemplate, FormItem, FBButton, Button, InputBox, OR, InputLink } from './Parts';
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const { user, auth } = useContext(AuthContext);
  const [ enable, setEnable ] = useState(true);
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  const login = async () => {
    setEnable(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert(e);
    }
    setEnable(true);
  };

  if (user)
    return <Navigate to="/courses" />;
  else
    return (
      <AuthTemplate title="ログイン" onSubmit={async (_) => {
        if (enable) await login();
      }}>
        <FormItem>
          <FBButton>Facebookアカウントでログインする</FBButton>
        </FormItem>
        <FormItem><OR/></FormItem>
        <InputBox type_="email" autoComplete="on" text="メールアドレス" onChange={(e) => setEmail(e.target.value)}/>
        <InputBox type_="password" autoComplete="off" text="パスワード" onChange={(e) => setPassword(e.target.value)}>
          <p><InputLink to="/reset"><small>パスワードを忘れた方</small></InputLink></p>
        </InputBox>
        <FormItem>
          <Button disabled={!enable} onClick={login}>ログイン</Button>
        </FormItem>
      </AuthTemplate>
    );
}

export default Login;
