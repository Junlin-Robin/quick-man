import { useMemo } from 'react';

import {
    Card, Typography, Button, Row, Col, Tag, Tooltip, message, Checkbox, Space,
} from 'antd';
import {
    ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import type { TaskDetail, FileInfoType } from '../../../models';
import { TASK_CALCULATION_STATUS, FILE_UPLOAD_STATUS } from '../../../constants';

import { useRecoilValue } from 'recoil';
import {
    deleteDataState,
    triggerGetDataState,
} from '../constants/atoms';

import moment from 'moment';
import decimal from 'decimal.js';

import type { CheckboxProps } from 'antd';
import { isEmpty } from 'lodash';

const enum FileType {
    LIGHT = 'light',
    HEAVY = 'heavy',
    CELL = 'cell',
}

const FileTypeMap = Object.freeze({
    [FileType.LIGHT]: '轻同位素',
    [FileType.HEAVY]: '重同位素',
    [FileType.CELL]: '晶胞参数',
});


function StatusIcon(props: { status: TASK_CALCULATION_STATUS }) {
    const { status } = props;

    switch (status) {
        case TASK_CALCULATION_STATUS.WAITING:
            return (<Tag icon={<ClockCircleOutlined />} color="default" style={{ fontWeight: 800 }}>待计算</Tag>);
        case TASK_CALCULATION_STATUS.RUNNING:
            return (<Tag icon={<SyncOutlined spin />} color="processing" style={{ fontWeight: 800 }}>计算中</Tag>);
        case TASK_CALCULATION_STATUS.SUCCESS:
            return (<Tag icon={<CheckCircleOutlined />} color="success" style={{ fontWeight: 800 }}>已完成</Tag>);
        case TASK_CALCULATION_STATUS.FAILED:
            return (<Tooltip title="请点击编辑重新上传计算文件后发起计算，或者删除重建计算任务"><Tag icon={<CloseCircleOutlined />} color="error">计算失败</Tag></Tooltip>);
        default:
            return (<></>);
    }
}

interface IProps {
    // calculationServices: CALCULATION_SERVICE[];
    onEdit: () => void;
    taskDetail: TaskDetail;
    isAction: boolean;
    fileInfoList: {
        light: FileInfoType[];
        heavy: FileInfoType[];
        cell: FileInfoType[];
    };
    actionSelectList: string[];
    onSelect: (v: string[] | ((v: string[]) => string[])) => void;
}

export default function TaskCard(props: IProps) {
    const {
        taskDetail, onEdit, isAction, onSelect, actionSelectList, fileInfoList,
    } = props;

    // const [isSelect, setIsSelect] = useState(actionSelectList?.includes(taskDetail.id) || false);

    const deleteData = useRecoilValue(deleteDataState);
    const triggerGetData = useRecoilValue(triggerGetDataState);

    const selectChange: CheckboxProps['onChange'] = (e) => {
        const isSelected = e.target.checked || false;
        // setIsSelect(isSelected);
        if (isSelected) {
            onSelect?.((v: string[]) => [...v ?? [], taskDetail.id]);
        } else {
            onSelect?.((v: string[]) => {
                if (!v) return [];
                return v.filter((id) => id !== taskDetail.id);
            })
        }
    };

    const isSelect = useMemo(() => {
        return actionSelectList?.includes(taskDetail.id) || false;
    }, [actionSelectList, taskDetail.id]);


    const fileShowInfo = useMemo(() => {
        const { light, heavy, cell } = fileInfoList || {};
        const returnInfo: { name: string, status: FILE_UPLOAD_STATUS, type: FileType }[] = [];
        if (!isEmpty(light)) returnInfo.push({ name: light?.[0]?.name, status: light?.[0]?.status, type: FileType.LIGHT });
        if (!isEmpty(heavy)) returnInfo.push({ name: heavy?.[0]?.name, status: heavy?.[0]?.status, type: FileType.HEAVY });
        if (!isEmpty(cell)) returnInfo.push({ name: cell?.[0]?.name, status: cell?.[0]?.status, type: FileType.CELL });
        return returnInfo;
    }, [fileInfoList]);



    return (
        // <Badge.Ribbon text={<Checkbox>选择</Checkbox>} style={{display: isAction ? 'block' : 'none'}} color='orange'>
        <Card
            title={
                <>
                    <Row>
                        <Tooltip title={taskDetail?.name} placement='top'>
                            <Col style={{ textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 180 }}>{taskDetail?.name}</Col>
                        </Tooltip>
                    </Row>
                    <Row>
                        <Col style={{ textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 180 }}>
                            <Tooltip title={taskDetail?.id} placement='bottom'>
                                <Typography.Text type="secondary" style={{ fontWeight: 400, fontSize: 12 }}>ID: {taskDetail?.id}</Typography.Text>
                            </Tooltip>
                        </Col>
                    </Row>
                </>

            }
            extra={
                <Row wrap={false} align="middle">
                    <Col>
                        <Button type="link" onClick={onEdit}>编辑</Button>
                    </Col>
                    <Col>
                        <Button type="link" danger style={{ paddingRight: 0 }} onClick={() => {
                            const isSuccess = deleteData?.(taskDetail?.id);
                            if (!isSuccess) message.error('删除任务失败！');
                            else message.success('删除任务成功！');
                            triggerGetData?.();
                        }}>删除</Button>
                    </Col>
                </Row>
            }
            styles={{
                body: {
                    position: 'relative',
                    overflow: 'hidden',
                }
            }}
        >
            <Row wrap={false}>
                <Col style={{ minWidth: '100px' }}>同位素：</Col>
                <Col>{taskDetail?.calculationParams?.cellInfo?.isotopeSetting?.isotope}</Col>
            </Row>
            <Row wrap={false}>
                <Col style={{ minWidth: '100px' }}>同位素质量：</Col>
                <Col>
                    <Tag color="#13c2c2">轻：{new decimal(taskDetail?.calculationParams.cellInfo.isotopeSetting.massSetting.light || 0).toFixed(2).toString()}</Tag>
                    <Tag color="#722ed1">重：{new decimal(taskDetail?.calculationParams.cellInfo.isotopeSetting.massSetting.heavy || 0).toFixed(2).toString()}</Tag>
                </Col>
            </Row>
            <Row wrap={false}>
                <Col style={{ minWidth: '100px' }}>上传文件信息：</Col>
                <Col>
                    <Space>
                        {
                            fileShowInfo.map((item) => (
                                <Space align='center'>
                                    <Tooltip title={item.name}>
                                        {FileTypeMap[item.type]}
                                        {item.status === FILE_UPLOAD_STATUS.DONE ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 12, marginLeft: 1 }} /> : <CloseCircleOutlined style={{ color: 'red', fontSize: 12, marginLeft: 1 }} />}
                                    </Tooltip>
                                </Space>
                            ))
                        }
                    </Space>
                </Col>
            </Row>
            <Row wrap={false}>
                <Col style={{ minWidth: '100px' }}>任务创建时间：</Col>
                <Col>{moment(taskDetail?.createTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
            </Row>
            <Row wrap={false}>
                <Col style={{ minWidth: '100px' }}>任务修改时间：</Col>
                <Col>{moment(taskDetail?.updateTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
            </Row>
            <Col style={{ position: 'absolute', top: 35, right: 0, transform: 'rotate(45deg)' }}><StatusIcon status={taskDetail?.calculationStatus} /></Col>
            {
                isAction ? (
                    <>
                        <div style={{
                            width: 130,
                            height: 160,
                            // backgroundColor: '#f0f0f0',
                            position: 'absolute',
                            bottom: -100,
                            right: -40,
                            transform: 'rotate(60deg)',
                            transition: 'all .5s ease'
                        }} />
                        <Checkbox style={{ position: 'absolute', bottom: 10, right: 10, }} checked={isSelect} onChange={selectChange}>
                            <span style={{ color: isSelect ? '#141414' : 'rgba(0, 0, 0, 0.45)' }}>选择</span>
                        </Checkbox>
                    </>
                ) : null
            }
        </Card>
        // </Badge.Ribbon>
    );
}
