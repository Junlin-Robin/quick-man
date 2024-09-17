import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.less";
// import { createHashHistory } from "history";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";


// const history = createHashHistory();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
