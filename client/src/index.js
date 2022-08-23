import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";

import "./css/Monaco.woff";
import "./css/index.css";
import "antd/dist/antd.css";

import NavBar from "./components/nav-bar/nav-bar";
import Sites from "./pages/sites";
import SiteDashboard from "./pages/site-dashboard";

import store from "./store";
import ScreenshotTool from "./pages/screenshot-tool";

const Router = () => {
  const api_regex = /^\/api\/.*/;
  if (api_regex.test(window.location.pathname)) {
    return <div></div>;
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavBar />
        <Route exact path="/" component={Sites} />
        <Route exact path="/sites/:sitePath" component={SiteDashboard} />
        <Route exact path="/screenshot-tool" component={ScreenshotTool} />
        <Route path="/api" />
      </BrowserRouter>
    </Provider>
  );
};

if (window.Cypress) {
  window.store = store;
}

ReactDOM.render(<Router />, document.getElementById("root"));
