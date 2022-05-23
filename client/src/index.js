import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";

import "./css/Monaco.woff";
import "./css/index.css";
import "antd/dist/antd.css";

import NavBar from "./components/nav-bar/nav-bar";
import ScreenshotTool from "./pages/screenshot-tool";
import Sites from "./pages/sites";
import SiteDashboard from "./pages/site-dashboard";

import store from "./store";

const Router = () => {
  const api_regex = /^\/api\/.*/;
  if (api_regex.test(window.location.pathname)) {
    return <div></div>;
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavBar />
        <Route exact path="/" component={ScreenshotTool} />
        <Route exact path="/sites" component={Sites} />
        <Route exact path="/sites/:sitePath" component={SiteDashboard} />
        <Route path="/api" />
      </BrowserRouter>
    </Provider>
  );
};

if (window.Cypress) {
  window.store = store;
}

ReactDOM.render(<Router />, document.getElementById("root"));
