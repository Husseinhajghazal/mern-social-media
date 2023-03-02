import React from "react";
import "./Button.css";

const Button = ({ type, text, onClick }) => {
  if (type === "submit")
    return (
      <button type={type} className={`p-4 pt-2 pb-2 ${type}`}>
        {text}
      </button>
    );
  if (type === "button")
    return (
      <button
        type={type}
        className={`m-auto p-4 pt-2 pb-2 ${type}`}
        onClick={onClick}
      >
        {text}
      </button>
    );
  if (type === "link")
    return (
      <button type="button" className={type} onClick={onClick}>
        {text}
      </button>
    );
};

export default Button;
