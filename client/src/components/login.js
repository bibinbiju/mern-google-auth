import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
export default function Login() {
  const navigate = useNavigate();

  //   const navigate = useNavigate();
  //   const [url, setUrl] = useState(null);
  //   const [searchQuery] = useSearchParams();
  //   const code = searchQuery.get("code");

  const redirectToGoogleSSO = async () => {
    window.location.href =
      "http://localhost:5000/login?redirect=http://localhost:3000";
    // localStorage.clear();
    // let timer;
    // const googleLogUrl = "http://localhost:5000/login";
    // const newWindow = window.open(
    //   googleLogUrl,
    //   "_blank",
    //   "width=500,height=500"
    // );
    // if (newWindow) {
    //   timer = setInterval(() => {
    //     if (newWindow.closed) {
    //       if (Cookies.get("token")) {
    //         navigate("/");
    //         console.log("You are authenticvated");
    //       }
    //       if (timer) clearInterval(timer);
    //     }
    //   }, 500);
    // }
  };

  return (
    <>
      <h1>Login</h1>
      <button
        // disabled={!url || url === ""}
        onClick={redirectToGoogleSSO}
      >
        Sign in with google
      </button>
    </>
  );
}
