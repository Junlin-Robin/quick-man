import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, Space, Button, Form, Segmented, message, Row,
} from 'antd';
import { useMemoizedFn } from 'ahooks';
import PageHeader from '@/pages/components/page-header';


import UploadDrawer from './upload-drawer';
import { PROJECT_INFO_KEY, CALCULATION_SERVICE, CalculationServiceMap } from '../../constants';

import { useMount, useUpdateEffect } from 'ahooks';

import { useDealFileUpload } from "./hook/use-upload-file"
import FrequencyPlotCard from './components/plot';
import FrequencyTableCard from './components/table';

import CascaderPro from '@/pages/components/cascader-pro';
import useCalculateTasks from './hook/use-calculate-tasks';
import { useRecoilState } from 'recoil';
import { projectDetailState } from './constants/atoms';

/**
 * 兼容写法，跨模块引用
 */
import type { ProjectListType } from '../overview/hooks/use-operate-project';


/**
 * 待补充：
 * 1. 首先查询工程的设置，当工程的设置和计算上传文件不相符的时候报错提醒
 */
export default function ProjectDetail(props: { id: string }) {
  const { id } = props;

  const [form] = Form.useForm();

  const { data, getData, triggerGetData, loading } = useDealFileUpload(id);

  const [calculationType, setCalculationType] = useState<number>(0);

  const [projectDetail, setProjectDetail] = useRecoilState(projectDetailState);


  const {
    calculationResults,
    setCalculationResults,
    loading: calculateLoading,
    calculateAndSaveFrequency,
    calculateAndSaveForceConstant,
  } = useCalculateTasks(id);


  const taskOptions = useMemo(() => data?.map((item) => ({
    label: item.name,
    value: item.id,
  })) || [], [data]);

  useMount(async () => {
    let existProjectIdList: ProjectListType = [];
    try {
      const projectIdListJson = localStorage.getItem(PROJECT_INFO_KEY);
      existProjectIdList = JSON.parse(projectIdListJson || JSON.stringify([]));
    } catch {
      message.error('系统错误，解析localStorage中的工程列表出错，请联系管理员！');
    }
    const projectDetail = existProjectIdList.find((item) => item.id === id);
    if (!projectDetail) {
      message.error('系统错误，获取工程信息失败，请联系管理员！');
      setProjectDetail(null);
      return;
    }
    setProjectDetail(projectDetail);
    /**
     * 兼容写法，这里会触发重复执行getData，后期优化，优化点见useDealFileUpload的hook
     */
    triggerGetData?.();
    const taskList = await getData?.();
    form.setFieldValue('taskIds', taskList?.map((item) => item.id) || []);
    form.submit();
  });

  //控制抽屉的关闭
  const [open, setOpen] = useState(false);

  const openTaskListDrawer = useMemoizedFn(() => {
    setOpen(true);
  });

  useUpdateEffect(() => {
    if (!open) {
      triggerGetData?.();
      form.submit();
    }
  }, [open]);

  useUpdateEffect(() => {
    setCalculationResults([]);
    form.submit();
  }, [calculationType, form, setCalculationResults]);

  const reset = () => {
    setCalculationResults([]);
    form.submit();
  }



  const calculationServiceOptions = useMemo(() => {
    const calculationServices = projectDetail?.calculationService || [];
    const hasFractionation = calculationServices.includes(CALCULATION_SERVICE.PHONON) || calculationServices.includes(CALCULATION_SERVICE.E_FIELD);
    const hasForceConstant = calculationServices.includes(CALCULATION_SERVICE.FORCE_CONSTANT);
    const options = [
      ...(hasFractionation ? [
        {
          label: CalculationServiceMap[CALCULATION_SERVICE.ISOTOPE_FRACTIONATION],
          value: CALCULATION_SERVICE.ISOTOPE_FRACTIONATION,
        }
      ] : []),
      ...(hasForceConstant ? [
        {
          label: CalculationServiceMap[CALCULATION_SERVICE.FORCE_CONSTANT],
          value: CALCULATION_SERVICE.FORCE_CONSTANT,
        }
      ] : [])
    ];
    setCalculationType(options?.[0]?.value || 0);
    return options;
  }, [projectDetail]);


  const submit = useMemoizedFn(async () => {
    const selectedDataIds: string[] = form.getFieldValue('taskIds') || [];
    if (calculationType === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION) {
      try {
        const isSuccess = await calculateAndSaveFrequency(selectedDataIds);
        if (isSuccess) message.success('计算成功！')
      } catch (error) {
        message.error((error as Error)?.message || '同位素分馏计算失败，请检查上传文件是否正确！')
      }
    } else if (calculationType === CALCULATION_SERVICE.FORCE_CONSTANT) {
      try {
        const isSuccess = await calculateAndSaveForceConstant(selectedDataIds);
        if (isSuccess) message.success('计算成功！')
      } catch (error) {
        message.error((error as Error)?.message || '力常数计算失败，请检查上传文件是否正确！')
      }
    }
  });


  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <PageHeader
          title={[(<Link to="/calculation/qm/isotope-fractionation/frequency">频率分馏计算</Link>), '工程详情']}
          extra={<Button type='link' onClick={openTaskListDrawer}>任务列表</Button>}
        />
        <Card title="计算设置" extra={
          <Segmented options={calculationServiceOptions} value={calculationType} onChange={(v) => setCalculationType(v)} />
        }>
          <Form form={form} colon onFinish={submit} onReset={reset}>
            <Form.Item label="项目名字" name="taskIds" rules={[{ required: true, message: '必须有项目名字' }]}>
              <CascaderPro allowClear placeholder="请输入项目名" options={taskOptions} loading={loading} />
            </Form.Item>
            <Row justify="end">
              <Space>
                <Button htmlType='reset'>重置</Button>
                <Button htmlType='submit' type='primary' loading={calculateLoading}>计算</Button>
              </Space>
            </Row>
          </Form>
        </Card>
        <FrequencyPlotCard dataSource={calculationResults} type={calculationType} loading={calculateLoading} />
        <FrequencyTableCard dataSource={calculationResults} type={calculationType} loading={calculateLoading} />
      </Space>
      <UploadDrawer visible={open} onClose={() => setOpen(false)} />
    </>
  );
}
