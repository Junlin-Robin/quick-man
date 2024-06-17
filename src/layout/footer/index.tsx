import { Layout } from "antd";

interface Iprops {
  style?: React.CSSProperties;
  className?: string;
}

export default function Footer(props: Iprops) {
  const { style, className } = props;

  return (
    <Layout.Footer style={{ ...style }} className={className}>
      @版权所有
    </Layout.Footer>
  );
}
