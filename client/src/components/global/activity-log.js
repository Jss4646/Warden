import React, { Component } from "react";
import ReactMarkdown from "react-markdown";

class ActivityLog extends Component {
  state = {
    textLines: ["`test`", "`test2`"],
  };

  render() {
    return (
      <div className="activity-log">
        <ReactMarkdown className="activity-log__content">
          {this.state.textLines.join("\n\n")}
        </ReactMarkdown>
      </div>
    );
  }
}

export default ActivityLog;
