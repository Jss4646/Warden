import React, { Component } from "react";
import { Button, Tree } from "antd";
import devices from "../../data/devices.json";

class Devices extends Component {
  constructor(props) {
    super(props);

    this.treeData = [
      {
        title: "Mobile devices",
        key: "mobile",
        children: [],
      },
      {
        title: "Desktop devices",
        key: "desktop",
        children: [],
      },
      {
        title: "Tablet devices",
        key: "tablet",
        children: [],
      },
      {
        title: "Laptop devices",
        key: "laptop",
        children: [],
      },
    ];

    this.initialiseDevices();
  }

  initialiseDevices = () => {
    const { entries } = Object;

    for (const [key, device] of entries(devices)) {
      const dataItem = {
        title: device.name,
        value: key,
        key,
      };

      switch (device.device) {
        case "mobile":
          this.treeData[0].children.push(dataItem);
          break;
        case "desktop":
          this.treeData[1].children.push(dataItem);
          break;
        case "tablet":
          this.treeData[2].children.push(dataItem);
          break;
        case "laptop":
          this.treeData[3].children.push(dataItem);
          break;
        default:
          throw new Error(
            `The device type (${device.deviceType}) should be either 'desktop' or 'mobile'`
          );
      }
    }
  };

  updateSelectedDevices = (checkedKeys) => {
    const { setSelectedDevices } = this.props;
    checkedKeys = checkedKeys.filter(
      (item) =>
        item !== "desktop" &&
        item !== "mobile" &&
        item !== "tablet" &&
        item !== "laptop"
    );
    setSelectedDevices(checkedKeys);
  };

  render() {
    const { selectAllDevices, deselectAllDevices, appState } = this.props;
    const { selectedDevices } = appState;

    return (
      <div className="devices">
        <Tree
          className="devices__tree"
          checkable
          treeData={this.treeData}
          onCheck={(checkedKeys) => this.updateSelectedDevices(checkedKeys)}
          checkedKeys={selectedDevices}
          selectable={false}
        />
        <div className="devices__buttons">
          <Button onClick={selectAllDevices}>Select All</Button>
          <Button onClick={deselectAllDevices}>Deselect All</Button>
        </div>
      </div>
    );
  }
}

export default Devices;
