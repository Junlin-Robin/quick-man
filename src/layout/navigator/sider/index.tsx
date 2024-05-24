import { Layout, Menu } from "antd";
import styles from "./index.module.less";

interface Iprops {
  style?: React.CSSProperties;
}

export default function Sider(props: Iprops) {
  const { style } = props;

  return (
    <>
      <Layout.Sider
        className={styles["scroll"]}
        breakpoint="lg"
        collapsedWidth={0}
        style={{
          overflow: "auto",
          height: "calc(100vh - 75px)",
          position: "absolute",
          top: 10,
          left: 0,
          bottom: 0,
          width: 200,
          padding: 0,
          backgroundColor: "#eee",
          // paddingTop: '48px',
          // borderRight: '1px solid rgba(5, 5, 5, 0.06)',
          ...style,
        }}
        // trigger={(<span>DIDI</span>)}
      >
        <Menu
          // className={styles["scroll"]}
          // style={{border: 'none'}}
          defaultSelectedKeys={["1"]}
          // theme="dark"
          items={new Array(36).fill(0).map((_, index) => {
            return {
              key: index,
              label: `test${index}`,
            };
          })}
          style={{ overflowY: "auto" }}
        />
      </Layout.Sider>
    </>
  );
}
