import { Typography, Result } from "antd";
import { SmileOutlined } from '@ant-design/icons'

// import { useQueryParam, StringParam } from "use-query-params";

export default function FrequencyCalculation() {
  // const [search, setSearch] = useQueryParam("search", StringParam);

  return (
    <>
      <Typography.Title level={5} style={{ marginTop: 0 }}>力常数计算</Typography.Title>
      <Result
        icon={<SmileOutlined />}
        title="页面开发中..."
        style={{ marginTop: 160 }}
      />
    </>
  );
}
