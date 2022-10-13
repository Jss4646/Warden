import React, { memo } from "react";
import { Empty, Spin } from "antd";
import Page from "./page";

/** The list of pages on the left sidebar */
const PagesList = memo((props) => {
  const { pages, loadingPages, currentPage, setCurrentPage } = props;

  if (loadingPages) {
    return <Spin />;
  } else if (Object.keys(pages).length > 0) {
    return Object.keys(pages)
      .sort()
      .map((path) => {
        const page = pages[path];
        return (
          <Page
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            page={page}
            path={path}
            key={path}
          />
        );
      });
  } else {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
});

export default PagesList;
