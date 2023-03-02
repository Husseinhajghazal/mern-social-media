import React from "react";
import "./Input.css";

const Input = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  isValid,
  error,
  onClick,
  Ref,
}) => {
  if (type === "text" || type === "password")
    return (
      <div className="input">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onClick={onClick}
          className={`p-2 text ${isValid && "false"}`}
        />
        {isValid && <p className="ps-2 pt-1">{error}</p>}
      </div>
    );
  if (type === "textarea") {
    return (
      <div className="input">
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          ref={Ref}
          onChange={onChange}
          onBlur={onBlur}
          onClick={onClick}
          className={`p-2 textarea ${isValid && "false"}`}
        />
        {isValid && <p className="ps-2 pt-1">{error}</p>}
      </div>
    );
  }
};

export default Input;
