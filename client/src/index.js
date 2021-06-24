import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";

import "./css/Monaco.woff";
import "./css/index.css";
import "antd/dist/antd.css";

import NavBar from "./components/nav-bar/nav-bar";
import ScreenshotTool from "./pages/screenshot-tool";

import store from "./store";
import Sites from "./pages/sites";

const Router = () => (
  <Provider store={store}>
    <BrowserRouter>
      <NavBar />
      <Route exact path="/" component={ScreenshotTool} />
      <Route exact path="/sites" component={Sites} />
    </BrowserRouter>
  </Provider>
);

if (window.Cypress) {
  window.store = store;
}

ReactDOM.render(<Router />, document.getElementById("root"));
