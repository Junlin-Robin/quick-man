import { useMemo } from 'react';
import { CALCULATION_SERVICE } from '../../../../constants';

import type { ColumnsType } from 'antd/lib/table';
import type { TableRecord } from './models';

export const useColumns: (type: CALCULATION_SERVICE) => ColumnsType<TableRecord> = (type) => {
    return useMemo(() => [
        {
            title: '名称',
            width: 120,
            dataIndex: 'name',
            fixed: 'left',
            onCell: (_, index?: number) => {
                if (type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION) {
                    if ( (index ?? 0) % 13 === 0) return { rowSpan: 13 };
                    return { rowSpan: 0 }
                }
                return { rowSpan: 1 }
            }
        },
        ...(
            type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION ? ([
                {
                    title: '摄氏度（°C）',
                    width: 120,
                    dataIndex: 'celsius',
                }, {
                    title: '华氏度（K）',
                    width: 120,
                    dataIndex: 'kelvin',
                }, {
                    title: (<>1000/T（K<sup>-1</sup>）</>),
                    width: 130,
                    dataIndex: 'thousand_div_T',
                }, {
                    title: (<>10<sup>6</sup>/T<sup>2</sup>（K<sup>-2</sup>）</>),
                    width: 130,
                    dataIndex: 'thousand_div_T_square',
                }, {
                    title: 'β',
                    width: 80,
                    dataIndex: 'beta',
                }, {
                    title: '1000lnβ（‰）',
                    width: 130,
                    dataIndex: 'fractionation',
                }, {
                    title: '1000(β-1)（‰）',
                    width: 150,
                    dataIndex: 'thousand_Beta_minor',
                },
            ]) : []
        ),
        ...(
            type === CALCULATION_SERVICE.FORCE_CONSTANT ? ([
                {
                    title: '力常数（N/m）',
                    width: 150,
                    dataIndex: 'forceConstant',
                }
            ]) : []
        ),
        {
            title: '计算同位素',
            width: 110,
            dataIndex: 'isotope',
            onCell: (_, index?: number) => {
                if (type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION) {
                    if ((index ?? 0) % 13 === 0)
                        return { rowSpan: 13 }
                    return { rowSpan: 0 }
                }
                return { rowSpan: 1 }
            }
        }, {
            title: '同位素质量',
            width: 220,
            dataIndex: 'isotopeMass',
            render: (_, record) => {
                const { isotopeMass } = record;
                const [heavy, light] = isotopeMass || [];
                return (
                    <>
                        <div>{heavy}</div>
                        <div>{light}</div>
                    </>
                )
            },
            onCell: (_, index?: number) => {
                if (type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION) {
                    if ((index ?? 0) % 13 === 0)
                        return { rowSpan: 13 }
                    return { rowSpan: 0 }
                }
                return { rowSpan: 1 }
            }
        }, {
            title: '同位素原子数量',
            width: 130,
            dataIndex: 'isotopeNumber',
            onCell: (_, index?: number) => {
                if (type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION) {
                    if ((index ?? 0) % 13 === 0)
                        return { rowSpan: 13 }
                    return { rowSpan: 0 }
                }
                return { rowSpan: 1 }
            }
        }, {
            title: '固定同位素原子数量',
            width: 160,
            dataIndex: 'fixedIsotopeNumber',
            onCell: (_, index?: number) => {
                if (type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION) {
                    if ((index ?? 0) % 13 === 0)
                        return { rowSpan: 13 }
                    return { rowSpan: 0 }
                }
                return { rowSpan: 1 }
            }
        }, {
            title: '计算模式',
            width: 100,
            dataIndex: 'calculationMethod',
            onCell: (_, index?: number) => {
                if (type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION) {
                    if ((index ?? 0) % 13 === 0)
                        return { rowSpan: 13 }
                    return { rowSpan: 0 }
                }
                return { rowSpan: 1 }
            }
        },
    ], [type])
}