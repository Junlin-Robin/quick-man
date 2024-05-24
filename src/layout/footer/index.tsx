import { Layout } from "antd";

interface Iprops {
  style?: React.CSSProperties;
}

export default function Footer(props: Iprops) {
  const { style } = props;

  return (
    <Layout.Footer style={{ backgroundColor: "red", ...style }}>
      Footer
    </Layout.Footer>
  );
}
