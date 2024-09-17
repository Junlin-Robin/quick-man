import { Layout } from "antd";

import Sider from "./sider";
import Header from "./header";

import useTriggerSlider from "../../hooks/use-trigger-slider";

// import imageSrc from '~/public/square-pants-logo.svg';

import styles from '../style/index.module.less';

export default function Navigator() {
  const {collapsed, setCollapsed, isLargerThanMinWidth} = useTriggerSlider();
  return (
    <Layout style={{position: 'sticky', top: 0, zIndex: 999}}>
      <Layout.Header
        className={styles['navigator']}
        style={{
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
          width: "100%",
          padding: '0 20px'
        }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} isLargerThanMinWidth={isLargerThanMinWidth} />
      </Layout.Header>
      <Layout style={{ position: 'relative', top: 0, left: 0, bottom: 0, height: 0 }}>
        <Sider collapsed={collapsed} setCollapsed={setCollapsed} isLargerThanMinWidth={isLargerThanMinWidth} />
      </Layout>
    </Layout>
  );
}
