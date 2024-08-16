import { Layout } from "antd";

interface Iprops {
  style?: React.CSSProperties;
  className?: string;
}

export default function Footer(props: Iprops) {
  const { style, className } = props;

  return (
    <Layout.Footer style={{ ...style }} className={className}>
      <div style={{ width: '100%', textAlign: 'center', fontSize: '13px', fontWeight: 320, lineHeight: '26px' }}>
        Design by <a href="https://github.com/Junlin-Robin/quick-man">Junlin-W</a>
        <br />
        管理员：<a href="mailto:2239520855@qq.com">Zhuofan</a>
        <br />
        @版权所有
      </div>
    </Layout.Footer>
  );
}
