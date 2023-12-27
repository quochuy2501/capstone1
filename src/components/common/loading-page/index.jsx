import React, { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./style.css";

const LoadingLazyComponent = () => {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);
  return <div className="loading"></div>;
};

export default LoadingLazyComponent;