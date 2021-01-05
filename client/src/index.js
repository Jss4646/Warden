import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";

import "./css/index.css";
import "antd/dist/antd.css";

import NavBar from "./components/nav-bar/nav-bar";
import Home from "./pages/home";
import AutomatedTests from "./pages/automated-tests";
import ScreenshotTool from "./pages/screenshot-tool";
import SeoTools from "./pages/seo-tools";

import store from "./store";

const Router = () => (
  <Provider store={store}>
    <BrowserRouter>
      <NavBar />
      <Route exact path="/" component={Home} />
      <Route exact path="/automated-tests" component={AutomatedTests} />
      <Route exact path="/screenshot-tool" component={ScreenshotTool} />
      <Route exact path="/seo-tools" component={SeoTools} />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(<Router />, document.getElementById("root"));
