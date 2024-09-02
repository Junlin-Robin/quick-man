import { useEffect, useState } from "react";
import {
    Button, Drawer, Space, Row, Modal, Input, Tooltip,
    Spin, Checkbox, message, FloatButton,
    Typography, Empty, Grid,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import TaskCard from "./task-card";
import FileUpload from "./file-upload";
import { BatchCreateTaskDescription } from "./constants";
import { useMemoizedFn } from "ahooks";
import { useRecoilValue } from 'recoil';
import {
    taskDataState,
    taskDataLoading,
    deleteDataState,
    triggerGetDataState,
} from '../constants/atoms';
import { isEmpty, isEqual, orderBy } from "lodash";

import type { CheckboxProps } from 'antd';

interface IProps {
    visible: boolean;
    onClose: () => void;
}

const { useBreakpoint } = Grid;

export default function UploadDrawer(props: IProps) {
    const { visible, onClose } = props;

    const { md } = useBreakpoint();

    const data = useRecoilValue(taskDataState);
    const triggerGetData = useRecoilValue(triggerGetDataState);
    const deleteData = useRecoilValue(deleteDataState);
    const loading = useRecoilValue(taskDataLoading);

    const [open, setOpen] = useState(false);

    const [isEdit, setIsEdit] = useState(false);
    const [taskId, setTaskId] = useState('');

    //控制是否点击底部的编辑按钮
    const [isAction, setIsAction] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [actionSelectList, setActionSelectList] = useState<string[]>([]);

    const [isSelectAll, setIsSelectAll] = useState(false);

    const selectChange: CheckboxProps['onChange'] = (e) => {
        const isSelected = e.target.checked || false;
        setIsSelectAll(isSelected);
        if (isSelected) {
            setActionSelectList(data?.map((item) => item?.id) || []);
        } else {
            setActionSelectList([]);
        }
    };

    const closeModal = useMemoizedFn(() => {
        setOpen(false);
    });

    const handleSearch = useMemoizedFn((searchText: string) => {
        triggerGetData?.(searchText);
    });

    const batchDelectTasks = useMemoizedFn(() => {
        if (isEmpty(actionSelectList) || !actionSelectList) return;
        Modal.confirm({
            title: '确认',
            content: '确认删除选择的计算任务？',
            onOk: () => {
                const isSuccess = deleteData?.(actionSelectList);
                if (!isSuccess) message.error('删除任务失败！');
                else message.success('删除任务成功！');
                triggerGetData?.();
            },
            centered: true,
        })
    });

    const handleClose = useMemoizedFn(() => {
        onClose();
        setOpen(false);
        setIsAction(false);
        setIndeterminate(false);
        setActionSelectList([]);
        setIsSelectAll(false);
    });



    useEffect(() => {
        if (visible) {
            triggerGetData?.();
        } else {
            if (visible && !open) triggerGetData?.();
        }
    }, [open, triggerGetData, visible]);

    useEffect(() => {
        if (!isEmpty(data)) {
            const isSelectAllTasks = isEqual(orderBy(actionSelectList), orderBy(data?.map((item) => item?.id) || []));
            setIsSelectAll(isSelectAllTasks);
            if (!isEmpty(actionSelectList) && !isSelectAllTasks) setIndeterminate(true);
            else setIndeterminate(false);
        } else {
            setIndeterminate(false);

        }
    }, [actionSelectList, data]);

    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // 清理函数，确保在组件卸载时恢复滚动
        return () => {
            document.body.style.overflow = '';
        };
    }, [visible]);


    return (
        <>
            <Drawer
                title="任务列表"
                id="drawer"
                width={460}
                open={visible}
                onClose={handleClose}
                placement={md ? 'right' : 'bottom'}
                height="70vh"
                maskClosable={false}
                extra={(
                    <>
                        <Tooltip title={() => BatchCreateTaskDescription.split('\n').map((item) => <p style={{ textAlign: 'justify' }}>{item}</p>)}>
                            <Button type="link" onClick={() => message.warning('功能正在开发中，敬请期待～')}>批量上传
                                <QuestionCircleOutlined />
                            </Button>
                        </Tooltip>

                        <Button type="link" onClick={() => {
                            setOpen(true);
                            setIsEdit(false);
                            setTaskId('');
                        }}>新建任务</Button>
                    </>
                )}
                footer={
                    <Row justify="space-between" align="middle">
                        {
                            isAction ? (
                                <Space align="center">
                                    <Checkbox checked={isSelectAll} onChange={selectChange} indeterminate={indeterminate}>全选</Checkbox>
                                    <Button type="link" style={{ padding: 0 }} onClick={batchDelectTasks} disabled={isEmpty(actionSelectList) || !actionSelectList}>删除</Button>
                                    <Button type="link" onClick={() => { setIsAction(false); setActionSelectList([]); setIsSelectAll(false); }} style={{ padding: 0 }}>取消</Button>
                                </Space>
                            ) : (<Button type="link" onClick={() => setIsAction(true)}>批量删除</Button>)
                        }
                        <Typography.Text type="secondary">{`${isAction ? `已选 ${actionSelectList?.length || 0} 个 /` : ''} 共计 ${data?.length || 0} 个`}</Typography.Text>
                        <Button type="primary" onClick={handleClose}>
                            关闭
                        </Button>
                    </Row>
                }>
                <Input.Search placeholder="请输入计算任务名进行搜索" allowClear onSearch={handleSearch} style={{ marginTop: -12 }} />
                <Spin spinning={loading} style={{ marginTop: 60 }}>
                    {
                        data && data?.length ? (
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {
                                    data.map((item) => (
                                        <TaskCard
                                            key={item?.id}
                                            taskId={item?.id}
                                            taskName={item?.name}
                                            calculationStatus={item?.calculationStatus}
                                            createTime={item?.createTime}
                                            updateTime={item?.updateTime}
                                            // isPhonon={item?.isPhonon}
                                            isAction={isAction}
                                            fileInfoList={item?.fileInfoList}
                                            onSelect={setActionSelectList}
                                            actionSelectList={actionSelectList}
                                            onEdit={() => {
                                                setOpen(true);
                                                setIsEdit(true);
                                                setTaskId(item?.id);
                                            }}
                                        />
                                    ))
                                }
                            </Space>
                        ) : (<Empty style={{ marginTop: 100 }} />)
                    }
                    <Tooltip title="回到顶部">
                        <FloatButton.BackTop target={() => document.getElementsByClassName('ant-drawer-body')?.[0] as HTMLElement} visibilityHeight={180} style={{ marginBottom: 20 }} />
                    </Tooltip>
                </Spin>
            </Drawer>
            <Modal open={open} footer={null} getContainer={() => document.getElementsByClassName('ant-drawer-body')?.[0] as HTMLElement} closeIcon={null} destroyOnClose centered>
                <FileUpload taskId={taskId} close={closeModal} isEdit={isEdit} />
            </Modal>
        </>
    )
}
