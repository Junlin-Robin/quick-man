import { useMemo } from 'react';
import { Button, Card, message, Table } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as xlsx from 'xlsx';

import { useColumns } from './configuable';
import { formatterData } from './utils';
import { TableHeaderMap } from './constants';

import { CALCULATION_SERVICE, CalculationServiceMap } from '../../../../constants';

import type { CalculationResults } from '../../models';
import { useMemoizedFn } from 'ahooks';

interface IProps {
    dataSource: CalculationResults;
    type: CALCULATION_SERVICE;
    loading: boolean
}

export default function FrequencyTableCard(props: IProps) {

    const { dataSource, type, loading } = props;

    const titleText = useMemo(() => `${CalculationServiceMap[type] || ''}-数据表`, [type]);

    const columns = useColumns(type);

    const data = useMemo(() => formatterData(dataSource, type), [dataSource, type]);

    const downloadExcel = useMemoizedFn(() => {
        try {
            const worksheet = xlsx.utils.json_to_sheet(data.map((item) => {
                const newDataItem = Object.entries(item).reduce((acc: { [k: string]: unknown }, [key, value]) => {
                    if (key === 'id' || key === 'taskId') return acc;
                    const newKey = TableHeaderMap[key as keyof typeof TableHeaderMap];
                    // if (key === 'isotopeMass') value = value.join('\n');
                    acc[newKey as keyof typeof acc] = key === 'isotopeMass' ? value.join('\n') : value;
                    return acc;
                }, {});
                return newDataItem;
            }));
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet1');
            const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            // 创建 Blob 对象
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

            // 创建一个链接元素
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'data.xlsx';

            // 触发下载
            document.body.appendChild(link);
            link.click();

            // 移除链接元素
            document.body.removeChild(link);

            message.success('导出成功');
        } catch (error) {
            message.error('导出失败');
        }
    })

    return (
        <Card
            title={titleText}
            extra={
                <Button type="primary" icon={<DownloadOutlined />} onClick={downloadExcel}>导出数据</Button>
            }>
            <Table
                dataSource={data}
                columns={columns}
                rowKey={(item) => `${item.id}${item.kelvin}`}
                loading={loading}
                scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
                pagination={{
                    total: data?.length || 0,
                    defaultPageSize: 20,
                    position: ['bottomCenter'],
                }}
                onHeaderRow={() => {
                    return {
                        style: { padding: 0 }
                    }
                }}
            />
        </Card>
    )
}