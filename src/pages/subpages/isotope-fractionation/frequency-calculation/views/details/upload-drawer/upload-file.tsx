import { useState } from "react";
import { Upload, Typography, Spin, Row, Col, message } from "antd";
import type { UploadProps, UploadFile } from 'antd';
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import { InboxOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { isEmpty, head } from "lodash";

import { CASTEP_FILETYPE, GAUSSIAN_FILETYPE, FILE_UPLOAD_STATUS } from '../../../constants';

import { getVibrationFrequencyInfo } from '@/packages/castep/formatter/get-vibration-frequency-info';
import type { ReturnInfo } from '@/packages/castep/formatter/get-vibration-frequency-info';


const { Dragger } = Upload;

interface IProps {
    fileType: CASTEP_FILETYPE | GAUSSIAN_FILETYPE;
    onChange?: (
        params: {
            fileList: UploadProps['fileList'];
            text: string;
            info?: ReturnInfo;
        },
    ) => void;
    value?: {
        fileList: UploadProps['fileList'];
        text: string;
        info?: ReturnInfo;
    };
    disabled?: boolean;
}

const EMPTY_FREQUENCY_INFO = {
    frequency: [],
    ir: [],
    irActive: [],
    raman: [],
    ramanActive: [],
    proportions: [],
}

export default function UploadFile(props: IProps) {
    const { fileType, onChange, value, disabled } = props || {};

    const [loading, setLoading] = useState(false);

    const handleUploadFile = (options: UploadRequestOption) => {
        setLoading(true);
        const { file, onSuccess, onError } = options || {};
        const { name, uid } = file as UploadFile || {};
        const fileReader = new FileReader();
        fileReader.readAsText(file as File);
        fileReader.onload = async () => {
            const fileContent = fileReader.result as string;
            try {
                let frequencyInfo;
                if (fileType === CASTEP_FILETYPE.CASTEP) {
                    frequencyInfo = await getVibrationFrequencyInfo(fileContent);
                }
                onChange?.({
                    fileList: [{ name, uid, status: FILE_UPLOAD_STATUS.DONE }],
                    text: fileContent,
                    info: fileType === CASTEP_FILETYPE.CASTEP ? frequencyInfo : undefined,
                });
                onSuccess?.({ name, uid });
            } catch (error) {
                const messageInfo = (error as Error)?.message ? `上传文件失败：${(error as Error)?.message}` : '文件解析失败';
                onChange?.({
                    fileList: [{ name, uid, status: FILE_UPLOAD_STATUS.ERROR, response: messageInfo }],
                    text: '',
                    info: fileType === CASTEP_FILETYPE.CASTEP ? EMPTY_FREQUENCY_INFO : undefined,
                });
                message.error(messageInfo);
                onError?.({ name, message: messageInfo });
            } finally {
                setLoading(false);
            }
        }

    };

    const handleRemoveFile = () => {
        // setFileList([]);
        // if (fileType === CASTEP_FILETYPE.CASTEP) onChange?.('', EMPTY_FREQUENCY_INFO);
        // else onChange?.('');
        onChange?.({
            fileList: [],
            text: '',
            info: fileType === CASTEP_FILETYPE.CASTEP ? EMPTY_FREQUENCY_INFO : undefined,
        });
    }

    return (
        <Spin spinning={loading}>
            <Row style={{ margin: 0 }} align="middle" wrap={false}>
                <Col flex={1}>
                    <Dragger
                        height={90}
                        style={{
                            display: isEmpty(value?.fileList) ? 'block' : 'none'
                        }}
                        iconRender={() => <FileTextOutlined />}
                        fileList={value?.fileList || []}
                        listType="picture"
                        accept={fileType || '*'}
                        customRequest={handleUploadFile}
                        maxCount={1}
                        onRemove={handleRemoveFile}
                        disabled={disabled}
                    >
                        {
                            isEmpty(value?.fileList) ? (
                                <>
                                    <div style={{ height: '30px', fontSize: 25, marginBottom: 12 }}>
                                        <InboxOutlined />
                                    </div>
                                    <Typography.Text type="secondary">请拖拽或者点击上传文件</Typography.Text>
                                </>
                            ) : null
                        }
                    </Dragger >
                </Col>
                {
                    head(value?.fileList)?.status === 'done' ? (
                        <CheckCircleOutlined style={{ marginLeft: 10, color: "#52c41a", transition: 'all .5s linear' }} />
                    ) : null
                }
                {
                    head(value?.fileList)?.status === 'error' ? (
                        <CloseCircleOutlined style={{ marginLeft: 10, color: "red", transition: 'all .5s linear' }} />
                    ) : null
                }
            </Row>
        </Spin>
    )
}
