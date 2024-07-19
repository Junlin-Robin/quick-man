import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Space, Button, Table, Form, Select, Row, Col, Input, InputNumber, Tabs, Radio, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import { Line, Column } from '@ant-design/plots';
import PageHeader from '@/pages/components/page-header';
import moment from 'moment';
interface Props {
}

export default function FrequencyCalculationProjectDetail() {

  const [form] = Form.useForm();
  const md = true

  const DemoLine = () => {
    const config = {
      data: {
        type: 'fetch',
        value: 'https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/line-slider.json',
      },
      xField: (d) => new Date(d.date),
      yField: 'close',
      axis: { x: { title: false, size: 40 }, y: { title: false, size: 50 } },
      slider: {
        x: { labelFormatter: (d) => moment(d).format('YYYY/M/D') },
        y: { labelFormatter: '~s' },
      },
    };
    return <Line {...config} />;
  }

  const DemoColumn = () => {
    const config = {
      data: {
        type: 'fetch',
        value: 'https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/column-column.json',
      },
      xField: 'letter',
      yField: 'frequency',
      label: {
        text: (d) => `${(d.frequency * 100).toFixed(1)}%`,
        textBaseline: 'bottom',
      },
      axis: {
        y: {
          labelFormatter: '.0%',
        },
      },
      style: {
        // 圆角样式
        radiusTopLeft: 10,
        radiusTopRight: 10,
      },
    };
    return <Column {...config} />;
  };

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <PageHeader
          title={[
            (
              <Link to="/calculation/qm/isotope-fractionation/frequency">
                <span style={{ fontSize: '16px' }}>频率分馏计算</span>
              </Link>
            ),
            (
              <span style={{ fontSize: '16px' }}>工程详情</span>
            )
          ]}
          extra={<Button type='link' size='small'>任务列表</Button>}
        />

        <Tabs items={[{
          key: '1',
          label: 'Tab 1',
          children: (
            <Upload
              action='#'
              listType='picture'
              previewFile={(file) => {
                console.log('Your upload file:', file);
                // Your process logic. Here we just mock to the same file
                return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
                  method: 'POST',
                  body: file,
                })
                  .then((res) => res.json())
                  .then(({ thumbnail }) => thumbnail);
              }}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          ),
        },
        {
          key: '2',
          label: 'Tab 2',
          children: 'Content 2',
        },
        {
          key: '3',
          label: 'Tab 3',
          children: 'Content of Tab fdsfsdlk Pane 3',
        },]} animated={{ inkBar: true, tabPane: true }} />
        <Card title="计算设置" extra={<Button type='link'>任务列表</Button>}>
          <Form form={form} labelCol={{ span: 4 }} colon layout="inline">
            <Row gutter={[12, 24]} justify="center" align="bottom">
              <Col span={md ? 12 : 24}>
                <Form.Item label="项目名字" name="project_name" rules={[{ required: true, message: '必须有项目名字' }]}>
                  <Input allowClear placeholder="请输入项目名" size="large" />
                </Form.Item>
              </Col>
              {/* <Col span={md ? 12 : 24}>
              <Form.Item label="计算服务" name="calculation_service" rules={[{ required: true, message: '必须选择计算服务' }]}>
                <Select options={CalculationServies} mode="multiple" allowClear showSearch optionFilterProp="children" filterOption={(input: string, option?: { label: string; value: string }) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} size="large" />
              </Form.Item>
            </Col> */}
              <Col span={md ? 12 : 24}>
                <Form.Item label="计算元素" name="calculation_elements" rules={[{ required: true, message: '必须选择计算服务' }]}>
                  <Select options={[
                    {
                      label: 'H',
                      value: 'H',
                    },
                    {
                      label: 'He',
                      value: 'He',
                    },
                    {
                      label: 'Li',
                      value: 'Li',
                    },
                    {
                      label: 'Be',
                      value: 'Be',
                    },
                    {
                      label: 'B',
                      value: 'B',
                    },
                  ]} allowClear size="large" />
                </Form.Item>
              </Col>
              <Col span={md ? 12 : 24}>
                <Form.Item label="同位素质量" name="isotope_mass" rules={[{ required: true, message: '必须设置计算任务数' }, { min: 0, type: 'number', message: '不能小于0' }, { max: 30, type: 'number', message: '不能超过30' }]}>
                  <Space>
                    <InputNumber addonBefore="轻" size='large' />
                    <InputNumber addonBefore="重" size='large' />
                  </Space>
                </Form.Item>
              </Col>
              <Col span={md ? 12 : 24}>
                <Form.Item label="计算任务" name="calculation_tasks" rules={[{ required: true, message: '必须设置计算任务数' }, { min: 0, type: 'number', message: '不能小于0' }, { max: 30, type: 'number', message: '不能超过30' }]}>
                  <InputNumber type="number" style={{ width: '100%' }} size="large" />
                </Form.Item>
              </Col>
              <Col span={md ? 12 : 24}>
                <Form.Item label="详细描述" name="project_description">
                  <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} maxLength={300} showCount size="large" />
                </Form.Item>
              </Col>
              <Col span={md ? 12 : 24} align="right">
                <Space>
                  <Button htmlType="reset">重置</Button>
                  <Button type="primary" htmlType="submit">提交</Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="趋势图" extra={<Button type="primary">下载</Button>}>
          <Row>
            <Col>
              图表类型：
            </Col>
            <Col>
              <Radio.Group>
                <Radio value={1}>频率</Radio>
                <Radio value={2}>力常数</Radio>
              </Radio.Group>
            </Col>
          </Row>
          <Tabs items={[{
            key: '1',
            label: 'Tab 1',
            children: (
              <DemoLine />
            ),
          },
          {
            key: '2',
            label: 'Tab 2',
            children: (
              <DemoColumn />
            ),
          },
          ]} animated={{ inkBar: true, tabPane: true }} />

        </Card>
        <Card title="明细表" extra={<Button type="primary">导出</Button>}>
          <sup>138</sup><span>Ba</span>
          <Table />
        </Card>
      </Space>
    </>
  );
}
