import { useMemo, useRef } from 'react';
import { Button, Card, Empty, Spin, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';
import { Line, Scatter } from '@ant-design/charts';
import { isEmpty } from 'lodash';

import type { Chart } from '@ant-design/charts';

import { CALCULATION_SERVICE, CalculationServiceMap } from '../../../../constants';
import { formatterData } from './utils';

import type { CalculationResults } from '../../models';
import type { IsotopeFractionationData, ForceConstantData } from './models';
import useWatchSystemTheme from '@/hooks/use-watch-system-theme';
import useTriggerSlider from '@/hooks/use-trigger-slider';


interface IProps {
    dataSource: CalculationResults;
    type: CALCULATION_SERVICE;
    loading: boolean
}

export default function FrequencyPlotCard(props: IProps) {

    const { dataSource, type, loading } = props;

    const theme = useWatchSystemTheme(); //系统色
    const { isLargerThanMinWidth } = useTriggerSlider(); //是否小屏幕

    const chartRef = useRef<Chart | null>(null);

    const titleText = useMemo(() => `${CalculationServiceMap[type] || ''}-趋势图`, [type]);

    const formattered = useMemo(() => formatterData(dataSource, type), [type, dataSource]);

    const lineConfig = {
        data: formattered,
        xField: 'temperature',
        yField: 'fractionation',
        nameField: 'name',
        axis: { x: { title: '123', size: 40 }, y: { title: '345', size: 50 } }, //轴标题
        seriesField: 'name',
        colorField: 'name',
        slider: isLargerThanMinWidth ? {
            x: true,
            y: true,
        } : undefined,
        tooltip: {
            title: (text: IsotopeFractionationData) => `温度：${text.kelvin}（K） ${text.celsius}（°C）`,
            items: [(text: IsotopeFractionationData) => `1000lnβ：${text.fractionation}（‰）`],
        },
        theme,
        annotations: {
            style: {
                stroke: 'red',
                lineWidth: 2, // 辅助线宽度
                lineDash: [4, 4], // 虚线样式
            }
        }
    };

    const scatterConfig = {
        data: formattered,
        xField: 'fractionation',
        yField: 'forceConstant',
        slider: isLargerThanMinWidth ? {
            x: true,
            y: true,
        } : undefined,
        theme,
        // axis: { x: { title: false, size: 40 }, y: { title: false, size: 50 } },
        seriesField: 'name',
        colorField: 'name',
        tooltip: {
            title: (text: ForceConstantData) => `${text.name} `,
            items: [(text: ForceConstantData) => `1000lnβ：${text.fractionation}（‰）`, (text: ForceConstantData) => `力常数：${text.forceConstant}（N/m^2）`],
        },

    };


    const downloadImage = useMemoizedFn(() => {
        if (chartRef && chartRef.current) {
            chartRef.current?.downloadImage?.(titleText);
        }
    });

    const renderPlot = useMemoizedFn(() => {
        if (isEmpty(formattered)) return (
            <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{ height: 120, marginTop: 100 }}
                description={(<Typography.Text style={{ fontSize: '14px', lineHeight: '25px' }} type="secondary">暂无数据，请新建任务或者选择任务进行计算</Typography.Text>)}
            />
        );
        if (type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION) return (<Line {...lineConfig} onReady={(chartInstance) => chartRef.current = chartInstance} />);
        if (type === CALCULATION_SERVICE.FORCE_CONSTANT) return (<Scatter {...scatterConfig} onReady={(chartInstance) => chartRef.current = chartInstance} />);
        return (<></>)
    })


    return (
        <>
            <Card
                title={titleText}
                styles={{
                    body: {
                        minHeight: '450px'
                    }
                }}
                extra={
                    <Button type="primary" onClick={downloadImage} icon={<DownloadOutlined />}>下载图片</Button>
                }>
                <Spin spinning={loading}>
                    {
                        renderPlot()
                    }
                </Spin>
            </Card>
        </>
    )
}