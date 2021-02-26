import React, { Component } from "react";

class ActivityLog extends Component {
  render() {
    let textLines = [];

    if (this.props.appState.activityLogLines) {
      textLines = this.props.appState.activityLogLines.map(
        (textLineObject, index) => {
          const { textContent, time, environment } = textLineObject;

          return (
            <div key={index} className="activity-log__line">
              <span className="activity-log__line-prefix">
                {time} {environment}:
              </span>
              {textContent}
            </div>
          );
        }
      );
    }

    return (
      <div className="activity-log">
        <div className="activity-log__content">
          {textLines.map((textLine) => textLine)}
        </div>
      </div>
    );
  }
}

export default ActivityLog;
