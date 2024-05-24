import { Layout, Grid } from "antd";
import Navigator from "./navigator";
import Footer from "./footer";

import styles from './style/index.module.less'

interface PageLayoutProps {
  children?: React.ReactNode;
}
const { useBreakpoint } = Grid
export default function PageLayout(props: PageLayoutProps) {
  const { children } = props;
  const { lg } = useBreakpoint();
  return (
    <Layout className={styles['container']}>
      <Navigator />
      <Layout style={{ marginLeft: lg ? 200 : 0, transition: 'all .5s ease' }}>
        <Layout.Content style={{ padding: '0 24px' }}>{children}</Layout.Content>
        <Footer />
      </Layout>
    </Layout>
    // <Layout style={{ minHeight: "100vh", backgroundColor: '#fff' }}>
    //   <Layout.Header>
    //     Header
    //   </Layout.Header>
    //   <Layout>
    //     <Slider />
    //     <Layout.Content style={{ padding: '0 24px', backgroundColor: '#fff' }}>{children}</Layout.Content>
    //     <Footer />
    //   </Layout>
    // </Layout>
  );
}
