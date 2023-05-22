import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
export default function LoginCallBack() {
  const [searchQuery] = useSearchParams();
  const code = searchQuery.get("code");
  useEffect(() => {
    if (code) {
      const loginCodeSent = async () => {
        await fetch("http://localhost:5000/login/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            localStorage.setItem("token", res.token);
            localStorage.setItem("access-token", res.data.tokens.access_token);
            setTimeout(() => {
              window.close();
            }, 1000);
          })
          .catch((error) => {
            window.alert(error);
            return;
          });
      };
      loginCodeSent();
    }
  }, [code]);
  return <div>Login in progress</div>;
}
