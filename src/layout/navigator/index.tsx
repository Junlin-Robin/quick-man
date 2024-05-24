import { Layout } from "antd";

import Sider from "./sider";
import Header from "./header";

// import imageSrc from '~/public/square-pants-logo.svg';

import styles from '../style/index.module.less';

export default function Navigator() {
  return (
    <Layout>
      <Layout.Header
        className={styles['navigator']}
        style={{
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
          zIndex: 1,
          width: "100%",
          // display: 'flex',
          // alignItems: 'center'
        }}
      >
        <Header />
      </Layout.Header>
      <Layout style={{ position: 'relative' }}>
        <Sider />
      </Layout>
    </Layout>
  );
}
