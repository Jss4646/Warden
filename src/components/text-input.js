import React from "react";

const TextInput = ({
  labelText,
  placeHolderText = "",
  className = "",
  inputRef,
}) => {
  const label = labelText ? <label>{labelText}</label> : null;

  return (
    <div
      className={`${className} text-input-container`}
      style={{ display: "flex" }}
    >
      {label}
      <input ref={inputRef} type="text" placeholder={placeHolderText} />
    </div>
  );
};

export default TextInput;
