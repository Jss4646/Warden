import React from "react";

const TextInput = ({
  labelText,
  placeHolderText = "",
  className = "",
  inputRef,
}) => {
  return (
    <div
      className={`${className} text-input-container`}
      style={{ display: "flex" }}
    >
      <label>{labelText}</label>
      <input ref={inputRef} type="text" placeholder={placeHolderText} />
    </div>
  );
};

export default TextInput;
