import React, { Component } from "react";
import ReactMarkdown from "react-markdown";

class ActivityLog extends Component {
  componentDidMount() {
    this.props.addActivityLogLine("test", "screenshot-tool");
  }

  render() {
    const textLines = this.props.appState.activityLogLines.map(
      (textLineObject) => {
        const { textContent, time, environment } = textLineObject;
        return `__${time} ${environment}:__ ${textContent}\n\n`;
      }
    );

    return (
      <div className="activity-log">
        <ReactMarkdown className="activity-log__content" allowDangerousHtml>
          {textLines.join("")}
        </ReactMarkdown>
      </div>
    );
  }
}

export default ActivityLog;
