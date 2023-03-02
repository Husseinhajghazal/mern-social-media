import React, { useState } from "react";
import LoginForm from "../components/LoginForm/LoginForm";
import SignupForm from "../components/SignupForm/SignupForm";

const Authentication = () => {
  const [loginMode, setLoginMode] = useState(true);

  return (
    <section className="auth-page d-flex flex-column align-items-center">
      <nav className="text-center pt-3 pb-3">Social media</nav>
      {loginMode ? (
        <LoginForm
          changeMode={() => {
            setLoginMode((prev) => !prev);
          }}
        />
      ) : (
        <SignupForm
          changeMode={() => {
            setLoginMode((prev) => !prev);
          }}
        />
      )}
    </section>
  );
};

export default Authentication;
