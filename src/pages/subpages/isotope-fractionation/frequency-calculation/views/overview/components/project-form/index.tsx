import { ReactNode, useEffect, useState } from 'react';
import {
  Cascader, Form, Row, Col, Input, Select, message,
} from 'antd';
import type { FormInstance } from 'antd';
import type { Rule } from 'antd/es/form';
import { get } from 'lodash';
import { Elements, ISOTOPE_TYPE } from '@/constants/element';
import decimal from 'decimal.js';
import MassInputNumber from './mass-input-number';
// import CalculationServiceCascader from './service-cascader';
import { temporaryPersonList, InitialSelectedPersonValues, IsotopeMassRules } from './constants';
import CascaderPro from '@/pages/components/cascader-pro';
import {CalculationServiesOptions} from '../../../../constants';

interface IProps {
  form: FormInstance;
  rules?: {
    [propName: string]: Rule[] | undefined;
  };
  singleFormItem?: boolean;
  required?: boolean;
}

// 可选的元素列表
const elementOptions = Elements.map((ele) => ({ label: ele.name, value: ele.key }));

const { useWatch } = Form;

export default function ProjectForm(props: IProps) {
  const {
    form, rules, singleFormItem = false, required = true,
  } = props;

  //同位素
  const [isotopeMassArray, setIsotopeMassArray] = useState<string[]>([]);

  const [eleOptions, setEleOptions] = useState<{ label: string | ReactNode, value: string }[]>(elementOptions);

  //监听「计算元素」选择的值
  const selectedElement = useWatch('calculationElement', form);

  //根据「计算元素」值，查找同位素可选的质量数
  useEffect(() => {
    const massArray: string[] = Elements.find((ele) => ele.key === selectedElement)?.properties?.isotope?.filter((item) => item.type === ISOTOPE_TYPE.STABLE).map((item) => item.mass) || [];
    setIsotopeMassArray(massArray);

    const [lightMassRoundValue, heavyMassRoundValue] = [
      form.getFieldValue('isotopeMass')?.light?.round as number | undefined,
      form.getFieldValue('isotopeMass')?.heavy?.round as number | undefined,
    ];
    form.setFieldsValue({
      isotopeMass: {
        light: {
          round: lightMassRoundValue,
          precision: massArray?.find((massItem) => decimal.round(massItem).toNumber() === lightMassRoundValue),
        },
        heavy: {
          round: heavyMassRoundValue,
          precision: massArray?.find((massItem) => decimal.round(massItem).toNumber() === heavyMassRoundValue),
        },
      }
    })
    //触发重新校验质量的规则
    form.validateFields(['isotopeMass'])
  }, [form, selectedElement]);

  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        colon
        layout="inline"
        onFinishFailed={() => message.error('请完整填写表单信息')}
        initialValues={InitialSelectedPersonValues}
      // onFinish={handleFinish}
      >
        <Row gutter={[12, 26]}>
          <Col span={singleFormItem ? 24 : 12}>
            <Form.Item label="工程名字" name="projectName" rules={[...get(rules, 'projectName') || [], { required, message: '工程名不允许为空' }]}>
              <Input allowClear placeholder="请输入工程名" autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={singleFormItem ? 24 : 12}>
            <Form.Item label="计算服务" name="calculationService" rules={[...get(rules, 'calculationService') || [], { required, message: '计算服务不允许为空' }]}>
              <CascaderPro options={CalculationServiesOptions} showCheckedStrategy="SHOW_CHILD" placeholder="请选择计算服务" allowClear showSearch />
            </Form.Item>
          </Col>
          <Col span={singleFormItem ? 24 : 12}>
            <Form.Item label="计算元素" name="calculationElement" rules={[...get(rules, 'calculationElement') || [], { required, message: '计算元素不允许为空' }]}>
              <Select
                showSearch
                filterOption={false}
                options={eleOptions}
                allowClear
                placeholder="请选择计算元素"
                onSearch={(value) => {
                  if (!value) return setEleOptions(elementOptions);
                  const filtered = elementOptions.filter((ele) => ele.label.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
                  const nodes = filtered.map((ele) => ({
                    ...ele,
                    label: (
                      <span>
                        {ele.label.split(new RegExp(`(${value})`, 'gi')).map((part, index) => (
                          part.toLowerCase() === value.toLowerCase() ? <span key={index} style={{ color: 'orange' }}>{part}</span> : part
                        ))}
                      </span>
                    ),
                  }));
                  setEleOptions(nodes);
                }}
                onClear={() => setEleOptions(elementOptions)}
                onSelect={() => setEleOptions(elementOptions)}
              />
            </Form.Item>
          </Col>
          <Col span={singleFormItem ? 24 : 12}>
            <Form.Item label="同位素质量" name="isotopeMass" dependencies={['calculationElement']} rules={[...IsotopeMassRules, ...get(rules, 'isotopeMass') || []]}>
              <MassInputNumber massArray={isotopeMassArray} />
            </Form.Item>
          </Col>
          <Col span={singleFormItem ? 24 : 12}>
            <Form.Item label="可见范围" name="readPermission" rules={[...get(rules, 'readPermission') || [], { required, message: '可见范围不允许为空' }]} extra="目前仅支持本人可见">
              <Cascader
                options={temporaryPersonList}
                style={{ width: '100%' }}
                multiple
                showCheckedStrategy="SHOW_CHILD"
                maxTagCount="responsive"
                showSearch
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={singleFormItem ? 24 : 12}>
            <Form.Item label="可编辑范围" name="editPermission" rules={[...get(rules, 'editPermission') || [], { required, message: '可编辑范围不允许为空' }]} extra="目前仅支持本人可编辑">
              <Cascader
                options={temporaryPersonList}
                style={{ width: '100%' }}
                multiple
                showCheckedStrategy="SHOW_CHILD"
                maxTagCount="responsive"
                showSearch
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={singleFormItem ? 24 : 12}>
            <Form.Item label="详细信息" name="projectDescription">
              <Input.TextArea placeholder="请输入项目的详细描述信息" autoSize={{ minRows: 4, maxRows: 6 }} maxLength={300} showCount autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
