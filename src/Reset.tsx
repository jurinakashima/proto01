import React from 'react';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { AuthTemplate, FormItem, Button, InputBox } from './Parts';
import { sendPasswordResetEmail } from "firebase/auth";

const Reset = () => {
  const { user, auth } = useContext(AuthContext);
  const [ enable, setEnable ] = useState(true);
  const [ email, setEmail ] = useState("");

  const reset = async () => {
    setEnable(false);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      alert(e);
    }
    setEnable(true);
  };

  if (user)
    return <Navigate to="/courses" />;
  else
    return (
      <AuthTemplate title="パスワード再設定" onSubmit={async (_) => {
        if (enable) await reset();
      }}>
        <InputBox type_="email" autoComplete="on" text="メールアドレス" onChange={(e) => setEmail(e.target.value)}/>
        <FormItem>
          <Button disabled={!enable} onClick={reset}>送信</Button>
        </FormItem>
      </AuthTemplate>
    );
}

export default Reset;
