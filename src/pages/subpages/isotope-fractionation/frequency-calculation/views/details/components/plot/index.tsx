import { useMemo, useRef, useState } from 'react';
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

import { linearRegression, linearRegressionLine, rSquared } from 'simple-statistics';

import decimal from 'decimal.js';

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

    const [regress, setRegres] = useState<{
        m: number;
        b: number;
        r2: number;
    } | null>(null);

    const lineConfig = {
        data: formattered,
        xField: 'temperature',
        yField: 'fractionation',
        nameField: 'name',
        axis: {
            x: {
                title: ('10⁶/T²（K⁻²）'), titleSpacing: 10, gridStrokeOpacity: 0.25
            }, 
            y: {
                title: '1000lnβ（‰）', titleSpacing: 10, gridStrokeOpacity: 0.25
            },
        }, //轴标题
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
        scale: {
            x: { nice: true, domain: [0, 14], tickCount: 14 },
            y: { nice: true },
        },
        interaction: { brushFilter: true },
        sizeField: 2,
    };

    //力常数拟合曲线
    const lineData = useMemo(() => {
        if (type === CALCULATION_SERVICE.FORCE_CONSTANT && !isEmpty(formattered)) {
            const forceConstantData = formattered as {
                category: string;
                name: string;
                forceConstant: number;
                fractionation: number;
            }[];
            const spotData = forceConstantData.map((item) => [item.forceConstant, item.fractionation]);
            const { m, b } = linearRegression(spotData);
            const r2 = rSquared(spotData, linearRegressionLine({ m, b }));
            setRegres({ m: parseFloat(new decimal(m).toFixed(4)), b: parseFloat(new decimal(m).toFixed(4)), r2: parseFloat(new decimal(r2).toFixed(4)) });
            const minFractionation = decimal.min(...forceConstantData.map((item) => item.forceConstant));
            const maxFractionation = decimal.max(...forceConstantData.map((item) => item.forceConstant));
            const resLineData = [
                {
                    fractionation: decimal.floor(minFractionation).toNumber(),
                    forceConstant: decimal.floor(minFractionation).mul(m).add(b).toNumber(),
                }, {
                    fractionation: decimal.ceil(maxFractionation).toNumber(),
                    forceConstant: decimal.ceil(maxFractionation).mul(m).add(b).toNumber(),
                }
            ];
            return resLineData;
        } else {
            return [];
        }
    }, [formattered, type]);


    const scatterConfig = {
        data: formattered,
        xField: 'forceConstant',
        yField: 'fractionation',
        slider: isLargerThanMinWidth ? {
            x: true,
            y: true,
        } : undefined,
        theme,
        axis: { x: { title: 'Force Constant <F> (N/m)', titleSpacing: 10, gridStrokeOpacity: 0.25 }, y: { title: '1000lnβ（‰）', titleSpacing: 10, gridStrokeOpacity: 0.25 } }, //轴标题
        seriesField: 'name',
        colorField: 'name',
        shapeField: 'point',
        tooltip: {
            title: (text: ForceConstantData) => `${text.name} `,
            items: [(text: ForceConstantData) => `1000lnβ：${text.fractionation}（‰）`, (text: ForceConstantData) => `力常数：${text.forceConstant}（N/m）`],
        },
        label: {
            text: 'name',
            transform: [{ type: 'overlapDodgeY' }],
            style: {
                textAlign: 'start',
                textBaseline: 'middle',
                dx: 15,
                position: 'left',
                fontSize: 10,
            },
        },
        sizeField: 6,
        scale: {
            x: { nice: true },
            y: { nice: true },
        },
        line: {
            data: lineData,
            xField: 'fractionation',
            yField: 'forceConstant',
            style: { stroke: "red", lineWidth: 2, lineDash: [5, 10], opacity: 0.8, shadowBlur: 5 },
            tooltip: false,
            annotations: [
                {
                    type: "text",
                    data: [lineData[1]?.fractionation, lineData[1]?.forceConstant],
                    encode: { text: `y = ${regress?.m}x + ${regress?.b}\nR² = ${regress?.r2}` },
                    style: { textAlign: "center", dy: 70, dx: -20 },
                    tooltip: false,
                }
            ],
        },
        interaction: { brushFilter: true },
        style: { fillOpacity: 0.3, lineWidth: 1 },
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