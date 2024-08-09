import decimal from 'decimal.js';
import { nanoid } from 'nanoid';

import { CALCULATION_SERVICE, CalculationServiceMap } from '../../../../constants';

import type { CalculationResults } from '../../models';
import type { TableRecord } from './models';

export function formatterData(dataSource: CalculationResults, type: CALCULATION_SERVICE): TableRecord[] {
    const isIsotopeFractionation = (type === CALCULATION_SERVICE.ISOTOPE_FRACTIONATION);
    const isForceConstant = (type === CALCULATION_SERVICE.FORCE_CONSTANT);
    if (!isIsotopeFractionation && !isForceConstant) return [];
    const overviewData = dataSource.map((item) => {
        const name = item.taskName;
        const taskId = item.taskId;
        const isotope = item.isotopeSetting?.isotope;
        const isotopeMass = [`重同位素质量：${item.isotopeSetting?.massSetting?.heavy || '-'}`, `轻同位素质量：${item.isotopeSetting?.massSetting?.light || '-'}`];
        const isotopeNumber = item.isotopeSetting?.isotopeNumber;
        const fixedIsotopeNumber = item.isotopeSetting.fixedIsotopeNumber;
        const calculationMethod = item.isotopeSetting.isPhonon ? CalculationServiceMap[CALCULATION_SERVICE.PHONON] : CalculationServiceMap[CALCULATION_SERVICE.E_FIELD];
        const forceConstant = new decimal(item.forceConstant || 0).toFixed(4);
        return {
            taskId,
            name,
            isotope,
            isotopeMass,
            isotopeNumber,
            fixedIsotopeNumber,
            calculationMethod,
            forceConstant,
        }
    })
    if (isIsotopeFractionation) {
        const fractionationData: TableRecord[] = [];
        dataSource.forEach((item) => {
            const frequencyInfo = item.frequencyInfo || [];
            const id = item.taskId;
            frequencyInfo.forEach((info) => {
                const celsius = info.T.celsius;
                const kelvin = info.T.kelvin;
                const thousand_div_T = decimal.div(1000, kelvin).toFixed(4);
                const thousand_div_T_square = decimal.div(1000000, decimal.pow(kelvin, 2)).toFixed(4);
                const beta = new decimal(info.beta).toFixed(4);
                const fractionation = new decimal(info.fractionation).toFixed(4);
                const thousand_Beta_minor = decimal.sub(beta, 1).mul(1000).toFixed(4);
                const overViewItem = overviewData.find((data) => data.taskId === id);
                fractionationData.push({
                    ...overViewItem! || {},
                    id: nanoid(),
                    celsius,
                    kelvin,
                    thousand_div_T,
                    thousand_div_T_square,
                    beta,
                    fractionation,
                    thousand_Beta_minor,
                })
            })
        })
        return fractionationData.filter(Boolean);
    } else {
        return overviewData.map((data) => ({ ...data, id: nanoid() })).filter(Boolean);
    }
}