import React, { Component } from "react";
import {
  ApiOutlined,
  CheckOutlined,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

class ScreenshotQueue extends Component {
  render() {
    return (
      <div className="screenshot-queue">
        <ol className="screenshot-queue__list">
          <li className="screenshot-queue__list-item">
            {/*<LoadingOutlined className="screenshot-queue__icon" />*/}
            {/*<CheckOutlined className="screenshot-queue__icon" />*/}
            {/*<ApiOutlined className="screenshot-queue__icon screenshot-queue__icon--broken" />*/}
            <CloseCircleFilled className="screenshot-queue__icon screenshot-queue__icon--canceled" />
            <div className="screenshot-queue__details">
              <span className="screenshot-queue__url">example.com</span>
              <span className="screenshot-queue__device">iPhone SE</span>
            </div>
            <span id="screenshot-time-taken">100s</span>
            <span id="screenshot-status">Running</span>
            <a className="screenshot-queue__cancel">Cancel</a>
          </li>
        </ol>

        <Button className="screenshot-queue__cancel-all">Cancel all</Button>
      </div>
    );
  }
}

export default ScreenshotQueue;
