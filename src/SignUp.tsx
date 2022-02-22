import React from 'react';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { AuthTemplate, FormItem, FBButton, Button, InputBox, OR, CheckBox } from './Parts';
import { updateProfile, createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const { user, auth } = useContext(AuthContext);
  const [ enable, setEnable ] = useState(true);
  const [ checked, setChecked ] = useState(false);
  const [ email, setEmail ] = useState("");
  const [ name, setName ] = useState("");
  const [ password, setPassword ] = useState("");

  const signup = async () => {
    setEnable(false);
    try {
      let userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, {displayName: name});
    } catch (e) {
      alert(e);
    }
    setEnable(true);
  };

  if (user)
    return <Navigate to="/courses" />;
  else
    return (
      <AuthTemplate title="新規会員登録">
        <FormItem>
          <FBButton>Facebookアカウントで登録する</FBButton>
        </FormItem>
        <FormItem><OR/></FormItem>
        <InputBox type_="name" autoComplete="on" text="名前" onChange={(e) => setName(e.target.value)}/>
        <InputBox type_="email" autoComplete="on" text="メールアドレス" onChange={(e) => setEmail(e.target.value)}/>
        <InputBox type_="password" autoComplete="off" text="パスワード" onChange={(e) => setPassword(e.target.value)} />
        <FormItem>
          <CheckBox label="プライバシーポリシー・利用規約に同意する" onChange={(e) => setChecked(e.target.checked)} />
        </FormItem>
        <FormItem>
          <Button disabled={!enable || !checked} onClick={signup}>登録する</Button>
        </FormItem>
      </AuthTemplate>
    );
}

export default SignUp;
