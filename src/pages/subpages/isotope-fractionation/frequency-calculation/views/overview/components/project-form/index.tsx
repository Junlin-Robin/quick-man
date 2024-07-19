import { Form, Row, Col, Input, Select, InputNumber,  } from 'antd';
import type { FormInstance } from 'antd';
import type { Rule } from 'antd/es/form';
import {get} from 'lodash';

interface IProps {
    form: FormInstance;
    rules?: {
        [propName: string]: Rule[] | undefined;
    };
    singleFormItem?: boolean;
}

export default function ProjectForm(props: IProps) {
    const { form, rules, singleFormItem = true } = props;

    // const isSmallScreen = useRecoil()

    return (
        <>
        <Form form={form} labelCol={{ span: 7 }} colon layout="inline">
          <Row gutter={[12, 24]}>
            <Col span={singleFormItem ? 24 : 12}>
              <Form.Item label="项目名字" name="project_name" rules={get(rules, 'project_name') || []}>
                <Input allowClear placeholder="请输入项目名" size={singleFormItem ? 'large' : undefined} />
              </Form.Item>
            </Col>
            <Col span={singleFormItem ? 24 : 12}>
              <Form.Item label="计算服务" name="calculation_service" rules={[{ required: true, message: '必须选择计算服务' }]}>
                <Select options={CalculationServies} mode="multiple" allowClear showSearch optionFilterProp="children" filterOption={(input: string, option?: { label: string; value: string }) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} size="large" />
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
        </>
    );
};
