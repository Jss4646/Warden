import { Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";

/**
 * Creates a loading icon if url isn't present and displays the image if it is
 *
 * @param props.src {String} - image url
 * @param props.loading {boolean}
 * @param props.scrollState {Array[Number, Function]} - state for the scroll position
 * @returns {JSX.Element}
 */
const ScreenshotContainer = (props) => {
  let { src, loading, scrollState } = props;
  const [scrollDepth, setScrollDepth] = scrollState;
  const [date, setDate] = useState(Date.now());
  const ref = useRef();

  /**
   * Updates date when loading state changes to force cache reload
   */
  useEffect(() => {
    setDate(Date.now());
  }, [loading]);

  /**
   * Updates scroll depth when scroll position changes
   */
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.addEventListener("scroll", (e) => {
      e.preventDefault();
      setScrollDepth(e.target.scrollTop);
    });
  }, [setScrollDepth, loading]);

  if (ref.current) {
    ref.current.scrollTop = scrollDepth;
  }

  if (loading) {
    return <Spin />;
  }

  if (!src) {
    return <div>No screenshot</div>;
  }

  src = `${src}?cache=${date}`;

  return (
    <div ref={ref} className="dashboard-screenshot-bar__screenshots-img">
      <a href={src} target="_blank" rel="noreferrer noopener">
        <img
          src={src}
          onError={(e) => {
            if (e.target.src.includes(".png")) {
              return;
            }
            e.target.src = e.target.src.replace(".webp", ".png");
          }}
          onScroll={(e) => {}}
          alt="Screenshot"
          loading="lazy"
        />
      </a>
    </div>
  );
};

export default ScreenshotContainer;
