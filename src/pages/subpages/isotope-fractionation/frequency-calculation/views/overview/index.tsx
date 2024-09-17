import { useState, useEffect } from "react";
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

import Marquee from 'react-fast-marquee';

import styles from './style/index.module.less';

const { useBreakpoint } = Grid;
export default function FrequencyCalculation() {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  //已有计算任务对于工程信息的修改提示
  const [warnMessage, setWarnMessage] = useState('');

  const { createOrModifiedProject, loading } = useCreateOrModifiedProject();
  const { triggerGetProjects, loading: projectLoading, projectList } = useGetProjectList();

  const [disabledProjectFormItems, setDisabledProjectFormItems] = useState<string[]>([]);

  useMount(() => {
    triggerGetProjects();
  })

  const openCreateDrawer = useMemoizedFn(() => {
    form.resetFields();
    setDisabledProjectFormItems([]);
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
    const taskNumber = JSON.parse(localStorage.getItem(projectId) || '')?.taskNumber || 0;
    if (taskNumber) {
      setDisabledProjectFormItems(['calculationElement', 'isotopeMass']);
      setWarnMessage('该工程已有计算任务，无法修改计算元素和同位素质量～')
    }
    else setDisabledProjectFormItems([]);
    setOpen(true);
    setIsEdit(true);
  });

  const closeCreateDrawer = useMemoizedFn(() => {
    setOpen(false);
    setWarnMessage('');
  });

  const createNewProject = useMemoizedFn(async () => {
    await form.validateFields();
    const formValue = form.getFieldsValue(true);
    try {
      const isSuccess = await createOrModifiedProject(formValue, projectId);
      if (isSuccess) message.success(`工程${isEdit ? '修改' : '创建'}成功！`);
      else message.error(`工程${isEdit ? '修改' : '创建'}失败！`);
    } catch (error) {
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

  useEffect(() => {
    if (open) {
      document.body.style.overflowY = 'hidden';
      document.body.style.position = 'fixed';
    } else {
      document.body.style.overflowY = '';
      document.body.style.position = '';
    }

    // 清理函数，确保在组件卸载时恢复滚动
    return () => {
      document.body.style.overflowY = '';
      document.body.style.position = '';
    };
  }, [open]);
  return (
    <>
      <PageHeader title="频率分馏计算" />
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message={
            <Marquee speed={25} delay={3} pauseOnHover={true}>
              <span style={{ marginRight: '200px' }}>{pageInfoText}</span>
            </Marquee>
          }
          type="info"
          showIcon
          closable
        />
        <Row justify="space-between" gutter={12} wrap={false}>
          <Col flex={1}>
            <Input.Search placeholder="请输入工程名进行搜索" allowClear onSearch={(v) => {
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
        onClose={closeCreateDrawer}
        open={open}
        size="large"
        height="70vh"
        maskClosable={false}
        footer={renderDrawerFooter()}
        className={styles['drawer-container']}
        closable={false}
      >
        {warnMessage && <Alert message={warnMessage} type="warning" showIcon style={{ marginBottom: 20, marginTop: -10 }} banner />}
        <Spin spinning={loading}>
          <ProjectForm form={form} required singleFormItem={!md} disabledFormItems={disabledProjectFormItems} />
        </Spin>
      </Drawer>
      <FloatButton.BackTop visibilityHeight={200} type="primary" style={{ marginBottom: 80 }} />
    </>
  );
}
