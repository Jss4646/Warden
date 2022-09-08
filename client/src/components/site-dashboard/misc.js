import React from "react";
import { Button } from "antd";

const Misc = (props) => {
  const downloadImages = () => {};

  return (
    <div className="misc">
      <Button type="primary" onClick={downloadImages}>
        Download Images
      </Button>
    </div>
  );
};

export default Misc;
