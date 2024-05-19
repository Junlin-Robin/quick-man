import { Layout } from "antd";
import Navigator from "./navigator";
import Footer from "./footer";

interface PageLayoutProps {
  children?: React.ReactNode;
}

export default function PageLayout(props: PageLayoutProps) {
  const { children } = props;
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: '#fff' }}>
      <Navigator />
      <Layout style={{ marginLeft: 200, backgroundColor: '#fff' }}>
        <Layout.Content style={{padding: '0 24px', backgroundColor: '#fff'}}>{children}</Layout.Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
