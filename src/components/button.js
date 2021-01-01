import React from "react";

const Button = ({
  link,
  className = "",
  text,
  buttonStyle = "default",
  onClickFunction,
}) => {
  switch (buttonStyle) {
    case "default":
      return (
        <a
          href={link}
          className={`button button--default ${className}`}
          onClick={onClickFunction}
        >
          {text}
        </a>
      );

    case "primary":
      return (
        <a
          href={link}
          className={`button button--primary ${className}`}
          onClick={onClickFunction}
        >
          {text}
        </a>
      );

    default:
      return undefined;
  }
};

export default Button;
