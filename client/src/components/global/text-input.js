import React from "react";
import PropTypes from "prop-types";

/**
 * A text input with an optional label
 *
 * @param {String} [labelText]
 * @param {String} [placeHolderText]
 * @param {String} [className]
 * @param {React.Ref} [inputRef]
 */
const TextInput = ({ labelText, placeHolderText, className, inputRef }) => {
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

TextInput.propTypes = {
  labelText: PropTypes.string,
  placeHolderText: PropTypes.string,
  className: PropTypes.string,
  inputRef: PropTypes.object,
};
export default TextInput;
