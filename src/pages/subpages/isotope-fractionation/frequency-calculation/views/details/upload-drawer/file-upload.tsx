import { useEffect, useState } from 'react';
import { Button, Card, Divider, Form, Input, message, Radio, Segmented, Space, Typography } from 'antd';
import UploadFile from "./upload-file";
import { SOFTERWARE_TYPE, TASK_CALCULATION_STATUS, CASTEP_FILETYPE } from '../../../constants';
import { getCellInfo } from '@/packages/castep/formatter/get-cell-info'
import type { ReturnCellInfo } from '@/packages/castep/formatter/get-cell-info';

import type { TaskDataType } from '../../../models'
import { judgeIsCalculatePhonon } from '@/packages/castep/formatter';
import { useMemoizedFn } from 'ahooks';
import { nanoid } from 'nanoid';
import { useRecoilValue } from 'recoil';
import {
    taskDataState,
    createOrModifiedDataState,
} from '../constants/atoms';

import { projectDetailState } from '../constants/atoms';

import decimal from 'decimal.js';

/**
 * 兼容写法，跨模块引用
 */
import type { ProjectListType } from '../../overview/hooks/use-operate-project';


const INITIAL_VALUE = {
    isFixed: false
};

function judgeIsFitProjectSetting(projectDetail: ProjectListType[number] | null, cellInfo: ReturnCellInfo) {
    const project_isotope = projectDetail?.calculationElement;
    const project_massSetting = projectDetail?.isotopeMass;

    const cellInfo_isotope = cellInfo.isotopeSetting.isotope;
    const cellInfo_massSetting = cellInfo.isotopeSetting.massSetting;


    if (project_isotope !== cellInfo_isotope) return {
        isFit: false,
        reason: '解析文件的同位素与工程选择的同位素不一致，请检查后重新上传～'
    };

    const heavy_mass_isEqual = project_massSetting?.heavy?.round === decimal.round(cellInfo_massSetting?.heavy).toNumber();
    const light_mass_isEqual = project_massSetting?.light?.round === decimal.round(cellInfo_massSetting?.light).toNumber();

    if (!heavy_mass_isEqual || !light_mass_isEqual) return {
        isFit: false,
        reason: '解析文件的同位素质量数与工程选择不一致，请检查后重新上传～'
    };

    return {
        isFit: true,
        reason: '',
    };
}


interface IProps {
    isEdit: boolean;
    // onOk: (newValue: ProjectDataType[number], id: string) => Promise<boolean>;
    close: () => void;
    taskId?: string;
}
export default function FileUpload(props: IProps) {
    const { isEdit, close, taskId: editTaskId } = props;
    const [form] = Form.useForm();

    const data = useRecoilValue(taskDataState);
    const createOrModifiedData = useRecoilValue(createOrModifiedDataState);
    const projectDetail = useRecoilValue(projectDetailState);


    const [isDisabled, setIsDisabled] = useState(false);
    const [taskItem, setTaskItem] = useState<TaskDataType[number] | undefined>();

    useEffect(() => {
        const specificTask = data?.find((item) => item?.id === editTaskId);
        setTaskItem(specificTask);
    }, [data, editTaskId]);

    useEffect(() => {
        if (isEdit) setIsDisabled(true);
        else setIsDisabled(false);
    }, [isEdit])


    useEffect(() => {
        console.log({ taskItem })
    }, [taskItem])

    const handleCleanFile = useMemoizedFn(() => {
        const editInitialValue = {
            taskName: taskItem?.name,
            isFixed: taskItem?.taskDetail?.isFixed,
            lightFile: undefined,
            heavyFile: undefined,
            cellFile: undefined,
        };
        form.setFieldsValue(editInitialValue);
        setIsDisabled(false);
    });

    //是否固定有计算的同位素的原子
    const isFixed = Form.useWatch('isFixed', form);

    useEffect(() => {
        if (!isEdit) {
            form.setFieldsValue(INITIAL_VALUE)
        } else {
            const editInitialValue = {
                taskName: taskItem?.name,
                isFixed: taskItem?.taskDetail?.isFixed,
                lightFile: { fileList: taskItem?.fileInfoList?.light },
                heavyFile: { fileList: taskItem?.fileInfoList?.heavy },
                cellFile: { fileList: taskItem?.fileInfoList?.cell },
            };
            form.setFieldsValue(editInitialValue);
        }
        return
    }, [form, isEdit, taskItem]);

    const submit = useMemoizedFn(async () => {
        //首先检测form必填项目
        await form.validateFields();
        if (isEdit) {
            if (!isDisabled) return;
            try {
                const isSuccess = await createOrModifiedData?.({
                    ...(taskItem as TaskDataType[number]),
                    name: form.getFieldValue('taskName') || '',
                    taskDetail: {
                        ...(taskItem as TaskDataType[number])?.taskDetail,
                        name: (form.getFieldValue('taskName') || '') as string,
                        updateTime: Date.now(),
                    },
                }, editTaskId!);
                if (!isSuccess) throw new Error('创建计算任务失败！');
                message.success(`${isEdit ? '编辑' : '创建'}计算任务成功！`);
                close?.();
            } catch (error) {
                message.error((error as Error).message || '创建计算任务失败！');
            }
            return;
        }
        //重同位素file
        const heavyFile = form.getFieldValue('heavyFile');
        //轻同位素file
        const lightFile = form.getFieldValue('lightFile');
        //晶胞参数文件
        const cellFile = form.getFieldValue('cellFile');
        try {
            //获取晶胞信息
            const cellInfo = await getCellInfo({
                castep: {
                    heavy: heavyFile?.text || '',
                    light: lightFile?.text || '',
                },
                cell: cellFile?.text || '',
                isFixed,
            });
            //检查上传文件信息是否与工程那个设定一致
            const { isFit, reason } = judgeIsFitProjectSetting(projectDetail, cellInfo);
            if (!isFit) throw new Error(reason);
            const isPhonon_heavy = judgeIsCalculatePhonon(heavyFile?.text || '');
            const isPhonon_light = judgeIsCalculatePhonon(lightFile?.text || '');
            if (isPhonon_heavy !== isPhonon_light) throw new Error('轻、重同位素 .castep 文件计算设置不一致，请仔细检查文件');
            //计算任务名字
            const name = form.getFieldValue('taskName') || '';
            const taskId = isEdit ? editTaskId : nanoid();
            if (!taskId) throw new Error('未设置计算任务id，请联系管理员！')
            const isSuccess = await createOrModifiedData?.({
                name,
                id: taskId,
                taskDetail: {
                    name,
                    id: taskId,
                    isFixed,
                    createTime: isEdit ? (taskItem?.taskDetail?.createTime ?? Date.now()) : Date.now(),
                    updateTime: Date.now(),
                    calculationStatus: TASK_CALCULATION_STATUS.WAITING,
                    calculationParams: {
                        softWare: SOFTERWARE_TYPE.CASTEP,
                        isPhonon: isPhonon_heavy,
                        frequencyInfo: {
                            heavy: heavyFile?.info || [],
                            light: lightFile?.info || [],
                        },
                        cellInfo: cellInfo,
                    },
                },
                fileInfoList: {
                    heavy: heavyFile?.fileList || [],
                    light: lightFile?.fileList || [],
                    cell: cellFile?.fileList || [],
                }
            }, taskId);
            if (!isSuccess) throw new Error('创建计算任务失败！');
            message.success('创建计算任务成功！');
            close?.();
        } catch (error) {
            message.error((error as Error).message || '创建计算任务失败！');
        }
    });


    return (
        <>
            <Card
                title={`${isEdit ? '编辑' : '新建'}计算任务`}
                extra={(
                    <Space>
                        <Segmented options={[
                            { label: 'CASTEP', value: 'CASTEP', disabled: false },
                            { label: 'GAUSSIAN', value: 'GAUSSIAN', disabled: true }
                        ]} defaultValue='CASTEP' />
                    </Space>
                )}
                actions={[
                    (<Button block size='large' style={{ width: '80%' }} onClick={close}>取消</Button>),
                    (<Button type="primary" block size='large' style={{ width: '80%' }} onClick={() => form?.submit()}>确认</Button>),
                ]}
                styles={{
                    body: {
                        maxHeight: '60vh',
                        overflow: 'scroll'
                    }
                }}
            >
                <Form form={form} labelCol={{ span: 6 }} onFinish={submit} preserve={false} onFinishFailed={() => message.error('请完整填写任务选项！')}>
                    <Form.Item label="计算任务名" name="taskName" rules={[{ required: true, message: '必须设置任务名' }]}>
                        <Input placeholder='请输入任务名字' />
                    </Form.Item>
                    {
                        isEdit ? (
                            <Divider dashed plain>
                                <Typography.Text type='secondary' style={{ fontSize: 12, fontWeight: 400 }}>
                                    编辑态不允许直接修改计算文件，如需修改请
                                    <Button type='link' style={{ fontSize: 12, fontWeight: 400, padding: 2 }} onClick={handleCleanFile}>清空</Button>
                                    后重新上传
                                </Typography.Text>
                            </Divider>
                        ) : null
                    }
                    <Form.Item label="是否固定原子" name="isFixed" extra="如果有固定需要计算同位素的原子，请选择「是」，其他情况请选择「否」" rules={[{ required: true, message: '请选择' }]}>
                        <Radio.Group optionType="button" buttonStyle="solid" style={{ marginBottom: 5 }} disabled={isDisabled}>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="轻同位素" name="lightFile" extra="请上传文件格式为 .castep 的文件" rules={[{ required: true, message: '请上传轻同位素文件' }]}>
                        <UploadFile fileType={CASTEP_FILETYPE.CASTEP} disabled={isDisabled} />
                    </Form.Item>
                    <Form.Item label="重同位素" name="heavyFile" extra="请上传文件格式为 .castep 的文件" rules={[{ required: true, message: '请上传重同位素文件' }]}>
                        <UploadFile fileType={CASTEP_FILETYPE.CASTEP} disabled={isDisabled} />
                    </Form.Item>
                    {
                        isFixed ? (
                            <Form.Item label="晶胞文件" name="cellFile" extra="请上传文件格式为 .cell 的文件" rules={[{ required: true, message: '请上传晶胞文件' }]}>
                                <UploadFile fileType={CASTEP_FILETYPE.CELL} disabled={isDisabled} />
                            </Form.Item>
                        ) : null
                    }
                </Form>
            </Card>
        </>
    )
}