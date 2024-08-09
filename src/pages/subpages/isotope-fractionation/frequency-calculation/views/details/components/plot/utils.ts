import decimal from 'decimal.js';

import { CALCULATION_SERVICE } from '../../../../constants';

import type { CalculationResults } from '../../models';
import type { IsotopeFractionationData } from './models';

export function formatterData(dataSource: CalculationResults, type: CALCULATION_SERVICE) {
    const isIsotopeFractionation = (type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION);
    const isForceConstant = (type === CALCULATION_SERVICE.FORCE_CONSTANT);
    if (!isIsotopeFractionation && !isForceConstant) return [];
    if (isIsotopeFractionation) {
        const fractionationData: IsotopeFractionationData[] = [];
        dataSource?.forEach((dataItem) => {
            const frequency = dataItem.frequencyInfo;
            const res = frequency?.map((i) => ({
                fractionation: parseFloat(new decimal(i.fractionation).toFixed(4)),
                temperature: parseFloat(decimal.div(decimal.pow(10, 6), decimal.pow(i.T.kelvin, 2)).toFixed(4)),
                kelvin: i.T.kelvin,
                celsius: i.T.celsius,
                category: i.category,
                name: i.name,
            })) || [];
            //每个同位素追一个00值
            fractionationData.push(...res, {
                fractionation: 0,
                temperature: 0,
                category: dataItem.taskId,
                name: dataItem.taskName,
                kelvin: '0',
                celsius: '-273.15',
            });
        });
        return fractionationData;
    } else {
        const forceConstantData = dataSource?.map((dataItem) => {
            const forceConstant = dataItem.forceConstant;
            const frequency = dataItem.frequencyInfo;
            return {
                category: dataItem.taskId,
                name: dataItem.taskName,
                forceConstant: parseFloat(new decimal(forceConstant || 0).toFixed(4)),
                fractionation: parseFloat(new decimal(frequency?.[0]?.fractionation || 0).toFixed(4)),
            };
        });
        return forceConstantData.filter(Boolean);
    }
}