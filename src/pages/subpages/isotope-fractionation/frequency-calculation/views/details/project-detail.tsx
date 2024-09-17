import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, Space, Button, Form, Segmented, message, Row,
  InputNumber, Input,
  Tooltip,
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
import decimal from 'decimal.js';
import { QuestionCircleOutlined } from '@ant-design/icons';


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
      const alreadySelectedTaskIds = form.getFieldValue('taskIds') || [];
      const filterSelecteTaskids = alreadySelectedTaskIds.filter((i: string) => taskOptions.some((o) => o.value === i));
      form.setFieldValue('taskIds', filterSelecteTaskids);
      setCalculationResults([]);
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
    await form.validateFields();
    const { taskIds = [], temperature_gradient, temperature } = form.getFieldsValue(true);
    if (calculationType === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION) {
      const TGradient = temperature_gradient?.match(/\d+(\.\d+)?/g)
        ?.sort((a: string, b: string) => decimal.sub(a, b).valueOf())
        .map((item: string) => ({
          kelvin: item,
          celsius: decimal.sub(item, '273.15').toString(),
        })) || [];
      try {
        const isSuccess = await calculateAndSaveFrequency({ taskIdList: taskIds, TGradient });
        if (isSuccess) message.success('计算成功！')
      } catch (error) {
        message.error((error as Error)?.message || '同位素分馏计算失败，请检查上传文件是否正确！');
      }
    } else if (calculationType === CALCULATION_SERVICE.FORCE_CONSTANT) {
      const formattTemperature = { kelvin: String(temperature), celsius: decimal.sub(temperature, 273.15).toString() }
      try {
        const isSuccess = await calculateAndSaveForceConstant({
          taskIdList: taskIds,
          temperature: formattTemperature,
        });
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
          title={[
            (<Link to="/calculation/qm/isotope-fractionation/frequency" style={{ fontSize: '16px' }}>频率分馏计算</Link>),
            (<Space>
              <span style={{ fontSize: '16px' }}>工程详情</span>
              <Tooltip title="请先点击任务列表上传文件，一个构型对应一个计算任务。将需要准备轻同位素和重同位素计算文件，如果有固定有计算的同位素原子，还需要准备cell文件。目前仅支持CASTEP的文件计算。">
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>),
          ]}
          extra={<Button type='link' onClick={openTaskListDrawer}>任务列表</Button>}
        />
        <Card title="计算设置" extra={
          <Segmented options={calculationServiceOptions} value={calculationType} onChange={(v) => setCalculationType(v)} />
        }>
          <Form form={form} colon onFinish={submit} onReset={reset} layout='horizontal' preserve={false}>
            <Form.Item label="计算任务" name="taskIds" rules={[{ required: true, message: '至少选择一个任务' }]}>
              <CascaderPro allowClear placeholder="请选择需要计算的任务" options={taskOptions} loading={loading} />
            </Form.Item>
            {
              calculationType === 1 ? (
                <Form.Item
                  label="温度梯度"
                  name="temperature_gradient"
                  rules={[{ required: true, message: '温度梯度不能为空' }]}
                  initialValue='273.15；298.15；303.15；333.15；373.15；400；500；600；700；800；900；1000'
                  extra="温度梯度用于计算特定温度下同位素的分馏值，如果需要修改，请输入开尔文温度，并以中、英文逗号或者分号隔开">
                  <Input placeholder="请输入需要计算的温度梯度，以逗号分隔，单位为开尔文温度" style={{ width: '100%' }} addonAfter="K" />
                </Form.Item>
              ) : (
                <Form.Item
                  label="温度选择"
                  name="temperature"
                  rules={[{ required: true, message: '温度设置不能为空' }]}
                  initialValue={273.15}
                  extra="此温度用于计算力常数图解中纵坐标值，即此温度下对应同位素的分馏值，单位为开尔文温度"
                >
                  <InputNumber addonAfter="K" placeholder='请填写需要对比的同位素分馏温度，用于作图显示，单位为开尔文温度' style={{ width: '100%' }} />
                </Form.Item>
              )
            }
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
