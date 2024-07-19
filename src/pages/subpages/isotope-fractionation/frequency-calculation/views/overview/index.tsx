import { useEffect, useState } from "react";
import { useMount, useMemoizedFn } from 'ahooks';
import { Empty, Alert, Select, InputNumber, Typography, Row, Col, Button, Input, Space, Drawer, Grid, Form, Cascader } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { pageInfoText } from './constants';
import PageHeader from '@/pages/components/page-header';
import ProjectCard from "./components/project-card";
import { CalculationServies } from '../../constants';
import { v1 as uuid } from 'uuid';

const { useBreakpoint } = Grid;
export default function FrequencyCalculation() {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [newId, setNewId] = useState('');

  useMount(() => {
    // const myWorker = new SharedWorker(new URL('./sss.ts', import.meta.url), { type: 'module' });
    // myWorker.port.start();

    // myWorker.port.postMessage('Hello, worker!');

    // myWorker.port.onmessage = function (event) {
    //   console.log('收到来自worker的消息: ', event.data);
    // };
    // console.log(11111);
    // let i = 0;
    // while(i < 1000000) {
    //   // const n = decimal.mul(23, 3.14).div(33).add(1093).pow(i);
    //     console.log(i);
    //     i++;
    //   }
  })

  const openCreateDrawer = useMemoizedFn(() => {
    form.resetFields();
    setOpen(true);
    setNewId(uuid());
  });

  const closeCreateDrawer = useMemoizedFn(() => {
    setOpen(false);
  });

  const createNewProject = useMemoizedFn(async () => {
    const results = await form.validateFields();
    console.log({ results });
    closeCreateDrawer();
  });

  const { md } = useBreakpoint();
  return (
    <>
      <PageHeader
        title="频率分馏计算"
      // extra={
      //   <Button>
      //     <SyncOutlined spin />
      //     <span>刷新</span>
      //   </Button>
      // }
      />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert message={pageInfoText} type="info" showIcon closable />
        <Row justify="space-between" gutter={12} wrap={false}>
          <Col flex={1}>
            <Input.Search placeholder="请输入查询的工程名或者id" allowClear />
          </Col>
          <Col>
            <Button type="primary" onClick={openCreateDrawer}>新增工程</Button>
          </Col>
        </Row>
        <Row gutter={[12, 12]} justify="start">
          {
            true ? new Array(20).fill(0).map((_, index, ARR) => {
              console.log({ _, index, ARR })
              return (
                <Col xs={24} sm={12} md={8} xl={6} xxl={4}>
                  <ProjectCard
                    key={index}
                    title="Europe Street beat"
                    description={{
                      author: 'Junlin Wang',
                      elements: [(<span><sup style={{ fontSize: '6px', lineHeight: '5px' }}>134</sup><span style={{ fontSize: '10px', lineHeight: '10px' }}>Ba</span></span>), (<span><sup style={{ fontSize: '6px', lineHeight: '5px' }}>138</sup><span style={{ fontSize: '10px', lineHeight: '10px' }}>Ba</span></span>)],
                      createTime: Date.now(),
                      details: '****',
                    }}
                    id={index}
                  />
                </Col>
              )
            }) : (
              <Col span={24} style={{ margin: '80px auto' }}>
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  imageStyle={{ height: 200 }}
                  description="还未创建工程，赶紧尝试一下吧～"
                >
                  <Button type="primary" onClick={openCreateDrawer}>Create Now</Button>
                </Empty>
              </Col>
            )
          }
        </Row>
      </Space>
      <Drawer
        title="新建项目"
        extra={(<Typography.Text type="secondary" style={{ maxWidth: md ? '' : '50vw' }} ellipsis>项目id：{newId}</Typography.Text>)}
        placement={md ? 'right' : 'bottom'}
        onClose={() => setOpen(false)}
        open={open}
        size="large"
        height="75vh"
        maskClosable={false}
        footer={(
          <Row justify="end">
            <Space>
              <Button onClick={closeCreateDrawer}>取消</Button>
              <Button type="primary" onClick={createNewProject}>确定</Button>
            </Space>
          </Row>
        )}
      >
        <Form form={form} labelCol={{ span: 7 }} colon layout="inline">
          <Row gutter={[12, 24]}>
            <Col span={md ? 12 : 24}>
              <Form.Item label="项目名字" name="project_name" rules={[{ required: true, message: '必须有项目名字' }]}>
                <Input allowClear placeholder="请输入项目名" size="large" />
              </Form.Item>
            </Col>
            <Col span={md ? 12 : 24}>
              <Form.Item label="计算服务" name="calculation_service" rules={[{ required: true, message: '必须选择计算服务' }]}>
                <Cascader options={CalculationServies} multiple showCheckedStrategy="SHOW_CHILD" maxTagCount="responsive" showSearch />
              </Form.Item>
            </Col>
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
                  <InputNumber addonBefore="轻" />
                  <InputNumber addonBefore="重" />
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
          </Row>
        </Form>
      </Drawer>
    </>
  );
}
