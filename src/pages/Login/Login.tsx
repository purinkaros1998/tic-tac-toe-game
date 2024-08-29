import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);

  const handleClick = () => {
    const callbackUrl = `${window.location.origin}`;
    const googleClientId =
      "552339730102-mb4ig4v0jgdplp286kuo9khtk8egtfqj.apps.googleusercontent.com";
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
  };

  useEffect(() => {
    const accessTokenRegex = /access_token=([^&]+)/;
    const isMatch = window.location.href.match(accessTokenRegex);

    if (isMatch) {
      const accessToken = isMatch[1];
      Cookies.set("access_token", accessToken);
      setIsLoggedin(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/game");
    }
  }, [isLoggedin, navigate]);

  useEffect(() => {
    if (Cookies && Cookies.get("access_token")) {
      navigate("/game");
    }
  }, [Cookies]);

  return (
    <div className="main-wrapper">
      <h1>Log in with Google</h1>
      <div className="btn-container">
        <button onClick={handleClick}>
          <div className="btn-panel">
            <img src="/logoGmail.svg" alt="gmail" />
            <span> Log in with Google</span>
          </div>
        </button>
      </div>
    </div>
  );
};
export default Login;
