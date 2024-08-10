import { useState } from "react";
import { useMount, useMemoizedFn } from 'ahooks';
import {
  Empty, Alert, Typography, Row, Col, Button, Input, Space, Drawer, Grid, Form, message, Spin, FloatButton,
} from "antd";
import { pageInfoText } from './constants';
import PageHeader from '@/pages/components/page-header';
import ProjectCardList from "./components/project-list.tsx";
import { v1 as uuid } from 'uuid';
import ProjectForm from "./components/project-form";
import { useCreateOrModifiedProject, useGetProjectList, deleteProject } from './hooks/use-operate-project';
import { isEmpty } from "lodash";

const { useBreakpoint } = Grid;
export default function FrequencyCalculation() {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const { createOrModifiedProject, loading } = useCreateOrModifiedProject();
  const { triggerGetProjects, loading: projectLoading, projectList } = useGetProjectList();

  useMount(() => {
    triggerGetProjects();
  })

  const openCreateDrawer = useMemoizedFn(() => {
    form.resetFields();
    setOpen(true);
    setProjectId(uuid());
    setIsEdit(false);
  });

  const handleDeleteProject = useMemoizedFn((projectId: string) => {
    deleteProject(projectId);
    triggerGetProjects();
  });

  const handleEditProject = useMemoizedFn((projectId: string) => {
    setProjectId(projectId);
    form.setFieldsValue(projectList.find(item => item.id === projectId) || {});
    setOpen(true);
    setIsEdit(true);
  });

  const closeCreateDrawer = useMemoizedFn(() => {
    setOpen(false);
  });

  const createNewProject = useMemoizedFn(async () => {
    await form.validateFields();
    const formValue = form.getFieldsValue(true);
    try {
      const isSuccess = await createOrModifiedProject(formValue, projectId);
      if (isSuccess) message.success(`工程${isEdit ? '修改' : '创建'}成功！`);
      else message.error(`工程${isEdit ? '修改' : '创建'}失败！`);
    } catch (error) {
      console.log({ error })
      message.error(`工程${isEdit ? '修改' : '创建'}失败！${(error as Error)?.message as string || ''}`);
    }
    closeCreateDrawer(); //关闭抽屉
    triggerGetProjects(); //重新获取工程列表
  });

  const renderDrawerFooter = useMemoizedFn(() => (
    <Row justify="end">
      <Space>
        <Button onClick={closeCreateDrawer}>取消</Button>
        <Button type="primary" onClick={createNewProject}>确定</Button>
      </Space>
    </Row>
  ));

  const { md } = useBreakpoint();
  return (
    <>
      <PageHeader title="频率分馏计算" />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert message={pageInfoText} type="info" showIcon closable />
        <Row justify="space-between" gutter={12} wrap={false}>
          <Col flex={1}>
            <Input.Search placeholder="请输入查询的工程名进行搜索" allowClear onSearch={(v) => {
              triggerGetProjects(v);
              v ? setIsSearch(true) : setIsSearch(false);
            }} />
          </Col>
          <Col>
            <Button type="primary" onClick={openCreateDrawer}>新增工程</Button>
          </Col>
        </Row>
        <Spin spinning={projectLoading}>
          {
            //只有在非搜索的时候才展示空状态
            !isSearch && isEmpty(projectList) ? (
              <div style={{ margin: '100px auto' }}>
                <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  imageStyle={{ height: 200 }}
                  description="还未创建工程，赶紧尝试一下吧～"
                >
                  <Button type="primary" onClick={openCreateDrawer}>立即创建</Button>
                </Empty>
              </div>
            ) : (
              <ProjectCardList projectList={projectList} deleteProject={handleDeleteProject} editProject={handleEditProject} />
            )
          }
        </Spin>
      </Space>
      <Drawer
        title="新建工程"
        extra={(<Typography.Text type="secondary" style={{ maxWidth: md ? '' : '60vw' }} ellipsis>工程id：{projectId}</Typography.Text>)}
        placement={md ? 'right' : 'bottom'}
        closable={false}
        open={open}
        size="large"
        height="75vh"
        maskClosable={false}
        footer={renderDrawerFooter()}
      >
        <Spin spinning={loading}>
          <ProjectForm form={form} required singleFormItem={!md} />
        </Spin>
      </Drawer>
      <FloatButton.BackTop visibilityHeight={200} type="primary" style={{ marginBottom: 80 }} />
    </>
  );
}
