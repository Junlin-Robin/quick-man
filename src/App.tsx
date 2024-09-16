import { Suspense, useRef } from "react";
import { Navigate, HashRouter as Router, Route, Routes } from "react-router-dom";
import routers from "./routers";
import { Spin, Result, ConfigProvider, theme, Modal } from "antd";
import PageLayout from "./layout";
import zhCN from "antd/es/locale/zh_CN";
import useWatchSystemTheme from "./hooks/use-watch-system-theme.ts";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import useTriggerSlider from "./hooks/use-trigger-slider.ts";
import { getBrowserUserAgent } from './utils/get-browser-version.ts';
import { useMount } from "ahooks";


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
  const { isLargerThanMinWidth } = useTriggerSlider();

  const { isIE, isMobile } = getBrowserUserAgent();

  const modalRef = useRef<ReturnType<typeof Modal.warning> | null>(null);

  useMount(() => {
    if (isIE && !modalRef.current) modalRef.current = Modal.warning({
      title: '浏览器版本过低',
      content: '检测到您正在使用IE浏览器，为了更好的体验效果，请切换至Chrome浏览器',
      centered: true,
      autoFocusButton: null,
      width: 360
    });
    if (isMobile && !modalRef.current) modalRef.current = Modal.warning({
      title: '移动端浏览',
      content: '检测到您正在使用手机浏览网页，部分功能将被禁用，为了更好的体验效果，请移步电脑登陆网页进行操作',
      centered: true,
      autoFocusButton: null,
      width: 360
    });
  });

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          // Seed Token，影响范围大
          // colorPrimary: '#faad14',
          // colorInfo: '#faad14',
          borderRadius: isLargerThanMinWidth ? 4 : 8,

          // 派生变量，影响范围小
          // colorBgContainer: '#ffa940',
        },
        algorithm: systemTheme === 'light' ? [theme.defaultAlgorithm] : [theme.darkAlgorithm],
      }}
      componentSize={isLargerThanMinWidth ? 'middle' : 'large'}
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
                        // title="页面走丢啦～"
                        subTitle={
                          <>
                            <p>对不起，您访问的页面不存在</p>
                            <p>Sorry, the page you visited does not exist.</p>
                          </>
                        }
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
  );
}

export default App;
