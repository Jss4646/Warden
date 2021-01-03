import React, { Component } from "react";
import { Button } from "antd";
import TextInput from "../global/text-input";

/**
 * A login modal opened by a button
 */
class NavLoginModal extends Component {
  emailRef = React.createRef();
  passwordRef = React.createRef();
  modalRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  componentDidMount() {
    document.addEventListener("click", (event) => {
      if (
        event.target !== this.modalRef.current &&
        !this.modalRef.current.contains(event.target) &&
        this.state.isOpen
      ) {
        this.closeModal();
      }
    });
  }

  changeModalOpenState = (isOpenState) => {
    this.setState({ isOpen: isOpenState });
  };

  toggleModalOpenState = () => {
    this.changeModalOpenState(!this.state.isOpen);
  };

  closeModal = () => {
    this.changeModalOpenState(false);
  };

  render() {
    return (
      <div className="login-modal-container" ref={this.modalRef}>
        <Button
          link="#"
          className="login-button"
          type="primary"
          onClick={this.toggleModalOpenState}
        >
          Login
        </Button>
        <div
          className="login-modal"
          style={this.state.isOpen ? { display: "grid" } : { display: "none" }}
        >
          <div className="login-modal__header">
            <h4>Login</h4>
            <span onClick={this.closeModal}>&times;</span>
          </div>

          <form className="login-modal__form">
            <div className="login-modal__inputs">
              <TextInput
                labelText="Email:"
                className="login_modal__email"
                inputRef={this.emailRef}
              />
              <TextInput
                labelText="Password:"
                className="login_modal__password"
                inputRef={this.passwordRef}
              />
              {/* eslint-disable */}
              <a href="#" className="login-modal__forgot-password">
                forgot password
              </a>
              {/* eslint-enable */}
            </div>
            <div className="login-modal__submit">
              <Button type="primary">Login</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default NavLoginModal;
