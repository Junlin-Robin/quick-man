import { Suspense } from "react";
import { Navigate, HashRouter as Router, Route, Routes } from "react-router-dom";
import routers from "./routers";
import { Spin, Result, ConfigProvider, theme } from "antd";
import PageLayout from "./layout";
import zhCN from "antd/es/locale/zh_CN";
import useWatchSystemTheme from "./hooks/use-watch-system-theme.ts";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

// import { QueryParamProvider } from "use-query-params";

// // 配置message弹出位置
// message.config({
//   top: 60, // 设置距离顶部的距离，单位为像素
//   // duration: 2, // 设置自动关闭的延时，单位为秒
//   maxCount: 3, // 设置最大显示数，超过限制时，最早的消息会被自动关闭
// });

function App() {
  /**
   * hash-history，目前看来没啥用
   */
  // const { history } = props;

  const systemTheme = useWatchSystemTheme();

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          // Seed Token，影响范围大
          // colorPrimary: '#faad14',
          // colorInfo: '#faad14',
          // borderRadius: 2,

          // 派生变量，影响范围小
          // colorBgContainer: '#ffa940',
          // fontSize: true ? 16 : undefined,
        },
        algorithm: systemTheme === 'light' ? [theme.defaultAlgorithm] : [theme.darkAlgorithm],
      }}
    // componentSize={true ? 'large' : 'middle'}
    >
      <Router>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <PageLayout>
            <Suspense fallback={<Spin />}>
              <Routes>
                {routers.map((route) => {
                  const { componentL, path } = route;
                  return <Route key={path} path={path} Component={componentL} />;
                })}
                <Route path="/" element={<Navigate replace to="/calculation/qm/isotope-fractionation/frequency" />} />
                <Route
                  key="unknown"
                  path="*"
                  Component={() => (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                      <Result
                        status="404"
                        title="404"
                        subTitle="Sorry, the page you visited does not exist."
                      />
                    </div>
                  )}
                />
              </Routes>
            </Suspense>
          </PageLayout>
        </QueryParamProvider>
      </Router>
    </ConfigProvider>
    // <div style={{ minHeight: "100vh" }}>
    //   <div style={{ position: "sticky", top: 0}}>
    //     <div style={{position: 'relative', backgroundColor: 'pink', height: 60}}>
    //       Header
    //     <div style={{position: 'absolute', top: 60, width: 200, height: 'calc(100vh - 60px)', backgroundColor: 'orange'}}>Sider</div>
    //     </div>
    //   </div>

    //   <div style={{ height: 1000, backgroundColor: "red",marginLeft: 200 }}>Content</div>
    //   <div style={{ height: 30, backgroundColor: "skyblue",marginLeft: 200 }}>Footer</div>
    // </div>
  );
}

export default App;
