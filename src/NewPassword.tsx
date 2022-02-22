import { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { AuthTemplate, FormItem, Button, InputBox } from './Parts';
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";

const Reset = () => {
  const { user, auth } = useContext(AuthContext);
  const [ enable, setEnable ] = useState(true);
  const [ password, setPassword ] = useState("");
  const [ repass, setRePassword ] = useState("");
  const [ actionCode, setActionCode ] = useState("");

  // 初回のレンダリングのみ
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const oobCode = queryParams.get('oobCode') || ''
    setActionCode(oobCode);
  }, [])

  const reset = async () => {
    setEnable(false);
    try {
      if (password !== repass)
        throw new Error("password mismatch");
      await verifyPasswordResetCode(auth, actionCode);
      await confirmPasswordReset(auth, actionCode, password);
      alert("成功しました ログインしてください");
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
        <InputBox type_="password" autoComplete="off" text="新しいパスワード" onChange={(e) => setPassword(e.target.value)} />
        <InputBox type_="password" autoComplete="off" text="新しいパスワードを再入力" onChange={(e) => setRePassword(e.target.value)} />
        <FormItem>
          <Button disabled={!enable} onClick={reset}>送信</Button>
        </FormItem>
      </AuthTemplate>
    );
}

export default Reset;
