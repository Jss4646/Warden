import React from "react";
import devices from "../../../data/devices.json.js";
import { Button, Tree } from "antd";

const Devices = (props) => {
  const treeData = [
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

  /**
   * Adds data from devices.json to the treeData
   */
  const initialiseDevices = () => {
    for (const [key, device] of Object.entries(devices)) {
      const dataItem = {
        title: device.name,
        value: key,
        key,
      };

      switch (device.device) {
        case "mobile":
          treeData[0].children.push(dataItem);
          break;
        case "desktop":
          treeData[1].children.push(dataItem);
          break;
        case "tablet":
          treeData[2].children.push(dataItem);
          break;
        case "laptop":
          treeData[3].children.push(dataItem);
          break;
        default:
          throw new Error(
            `The device type (${device.deviceType}) should be either 'desktop' or 'mobile'`
          );
      }
    }
  };

  /**
   * Updates the state with the selected devices filtering out headings which are not valid devices
   * @param {Array} checkedKeys - Array of keys of the selected devices
   */
  const updateSelectedDevices = (checkedKeys) => {
    if (checkedKeys.length === 0) {
      return;
    }

    checkedKeys = checkedKeys.filter(
      (item) =>
        item !== "desktop" &&
        item !== "mobile" &&
        item !== "tablet" &&
        item !== "laptop"
    );
    props.setDevices(checkedKeys);
  };

  /**
   * Saves the devices to the database
   */
  const saveDevices = () => {
    fetch("/api/set-site-devices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sitePath: props.siteData.sitePath,
        devices: props.siteData.devices,
      }),
    }).catch(console.error);
  };

  initialiseDevices();

  return (
    <div className="devices">
      <Tree
        className="devices__tree"
        checkable
        treeData={treeData}
        onCheck={(checkedKeys) => updateSelectedDevices(checkedKeys)}
        checkedKeys={props.siteData.devices}
        selectable={false}
      />
      <div className="devices__buttons">
        <Button onClick={saveDevices}>Save</Button>
        <Button onClick={props.selectAllDevices}>Select All</Button>
        <Button onClick={props.deselectAllDevices}>Deselect All</Button>
      </div>
    </div>
  );
};

export default Devices;
