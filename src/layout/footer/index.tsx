import { Layout } from "antd";

interface Iprops {
  style?: React.CSSProperties;
}

export default function Footer(props: Iprops) {
  const { style } = props;

  return (
    <Layout.Footer style={{ backgroundColor: "#eee", ...style }}>
      Footer
    </Layout.Footer>
  );
}
