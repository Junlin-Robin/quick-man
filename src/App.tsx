import { Suspense } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import routers from "./routers";
import { Spin, Result } from "antd";
import PageLayout from "./layout";

// import { QueryParamProvider } from "use-query-params";

function App() {
  /**
   * hash-history，目前看来没啥用
   */
  // const { history } = props;

  // console.log("history", history);

  return (
    <Router>
      <PageLayout>
        <Suspense fallback={<Spin />}>
          <Routes>
            {routers.map((route) => {
              const { componentL, path } = route;
              return <Route key={path} path={path} Component={componentL} />;
            })}
            <Route
              key="unknown"
              path="*"
              Component={() => (
                <Result
                  status="404"
                  title="404"
                  subTitle="Sorry, the page you visited does not exist."
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            />
          </Routes>
        </Suspense>
      </PageLayout>
    </Router>
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
