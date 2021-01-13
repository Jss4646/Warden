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
        checkable: false,
      },
      {
        title: "Desktop devices",
        key: "desktop",
        children: [],
        checkable: false,
      },
      {
        title: "Tablet devices",
        key: "tablet",
        children: [],
        checkable: false,
      },
      {
        title: "Laptop devices",
        key: "laptop",
        children: [],
        checkable: false,
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

  render() {
    const {
      selectAllDevices,
      deselectAllDevices,
      appState,
      setSelectedDevices,
    } = this.props;
    const { selectedDevices } = appState;

    return (
      <div className="devices">
        <Tree
          className="devices__tree"
          checkable
          treeData={this.treeData}
          // defaultExpandedKeys={["mobile", "desktop"]}
          onCheck={(checkedKeys, event) => setSelectedDevices(checkedKeys)}
          checkedKeys={selectedDevices}
          selectable={false}
          height={300}
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
