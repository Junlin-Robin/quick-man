import { Suspense } from "react";
import { Navigate, HashRouter as Router, Route, Routes } from "react-router-dom";
import routers from "./routers";
import { Spin, Result, ConfigProvider, theme } from "antd";
import PageLayout from "./layout";
import zhCN from "antd/es/locale/zh_CN";
import useWatchSystemTheme from "./hooks/use-watch-system-theme.ts";

// import { QueryParamProvider } from "use-query-params";

function App() {
  /**
   * hash-history，目前看来没啥用
   */
  // const { history } = props;

  const systemTheme = useWatchSystemTheme();

  // console.log("history", history);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          // Seed Token，影响范围大
          // colorPrimary: 'yellow',
          // borderRadius: 2,

          // 派生变量，影响范围小
          // colorBgContainer: '#f6ffed',
        },
        algorithm: systemTheme === 'light' ? [theme.defaultAlgorithm] : [theme.darkAlgorithm],
      }}
    >
      <Router>
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
