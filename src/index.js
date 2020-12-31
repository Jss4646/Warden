import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./pages/home";
import TestingTool from "./pages/testing-tool";
import ScreenshotTool from "./pages/screenshot-tool";
import SeoTool from "./pages/seo-tool";

import "./css/normalize.css";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/testing-tool" component={TestingTool} />
      <Route exact path="/screenshot-tool" component={ScreenshotTool} />
      <Route exact path="/seo-tool" component={SeoTool} />
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(<Router />, document.getElementById("root"));
