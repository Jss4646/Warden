import React, { Component } from "react";
import { Button, Tree } from "antd";
import devices from "../../data/devices.json";

class Devices extends Component {
  constructor(props) {
    super(props);

    this.treeData = [
      {
        title: "Desktop devices",
        key: "desktop",
        children: [],
      },
      {
        title: "Mobile devices",
        key: "mobile",
        children: [],
      },
    ];

    this.initialiseDevices();
  }

  initialiseDevices = () => {
    const { entries } = Object;

    for (const [key, device] of entries(devices)) {
      const dataItem = {
        title: device.deviceName,
        value: key,
        key,
      };

      if (device.deviceType === "mobile") {
        this.treeData[1].children.push(dataItem);
      } else if (device.deviceType === "desktop") {
        this.treeData[0].children.push(dataItem);
      } else {
        throw new Error(
          "The device type should be either 'desktop' or 'mobile'"
        );
      }
    }
  };

  render() {
    const {
      setSelectedDevices,
      selectAllDevices,
      deselectAllDevices,
      appState,
    } = this.props;
    const { selectedDevices } = appState;

    return (
      <div className="devices">
        <Tree
          className="devices__tree"
          checkable
          treeData={this.treeData}
          defaultExpandedKeys={["mobile", "desktop"]}
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
