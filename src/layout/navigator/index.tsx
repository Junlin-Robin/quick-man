import { Layout } from "antd";

import Sider from "./sider";

export default function Header() {
  return (
    <Layout style={{ position: "sticky", top: 0, left: 0, width: "100%", backgroundColor: "#fff", }}>
      <Layout.Header
        style={{
          backgroundColor: "#fff",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
          zIndex: 1,
          width: "100%",
        }}
      >
        Header-2
      </Layout.Header>
      <Layout style={{ position: 'relative', backgroundColor: '#fff' }}>
        <Sider />
      </Layout>
    </Layout>
  );
}
