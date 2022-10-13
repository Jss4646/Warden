import React, { useState } from "react";
import { Button } from "antd";

function ClearQueue() {
  const [hideModal, setHideModal] = useState(true);

  /**
   * Sends a request to the server to clear the queue
   * This will kill the node server which will automatically restart
   * There's not really a nice way to do this without killing the server unless I want to rewrite the cluster library
   */
  const clearScreenshots = () => {
    fetch(`${window.location.origin}/api/cancel-all-screenshots`, {
      method: "POST",
    }).then((res) => {
      if (res.status === 200) {
        setHideModal(true);
      } else {
        console.error(res.text());
      }
    });
  };

  return (
    <div className="clear-screenshots">
      <Button
        type="danger"
        onClick={() => setHideModal(!hideModal)}
        ghost={!hideModal}
      >
        Clear screenshot queue
      </Button>
      <div className="clear-screenshots__modal" hidden={hideModal}>
        <span className="clear-screenshots__modal-text">
          Are you sure, this will cancel all screenshots for all sites.
        </span>
        <Button type="danger" onClick={clearScreenshots}>
          Yes do it
        </Button>
      </div>
    </div>
  );
}

export default ClearQueue;
