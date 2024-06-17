import decimal from 'decimal.js';

import { getCellInfo } from '../../formatter/get-cell-info';
import getVibrationFrequencyInfo from '../../formatter/get-vibration-frequency-info';
import { c, h, k } from '../constants';
import { T } from './constants';

/**
 * 计算分馏
 */
export function calculateISOFractionationFromFrequencyByCASTEP(params: {
    freq: {
        heavy: string[];
        light: string[];
    };
    cell: {
        isotopeNumber: number;
    }
}) {
    const { freq, cell } = params;
    const { heavy: waveNumber_heavy, light: waveNumber_light } = freq || {};
    const { isotopeNumber } = cell || {};

    return new Promise((res, rej) => {
        if (!waveNumber_heavy || !waveNumber_light || !isotopeNumber) return rej(new Error('缺少计算必要参数！'));

        const angular_freq_heavy = waveNumber_heavy.map((item) => decimal.mul(item, c));
        const angular_freq_light = waveNumber_light.map((item) => decimal.mul(item, c));

        const fractionationCalculateResults = T.map(({ kelvin: kelvin_t, celsius }) => {
            const u_heavy = angular_freq_heavy.map((angular_heavy) => decimal.mul(angular_heavy, h).div(k).div(kelvin_t));
            const u_light = angular_freq_light.map((angular_light) => decimal.mul(angular_light, h).div(k).div(kelvin_t));

            const PFR = [];
            for (let i = 0; i < u_heavy.length; i++) {
                const u_heavy_item = u_heavy[i];
                const u_light_item = u_light[i];
                const Numerator = decimal.div(u_heavy_item, 2).mul(-1).exp().mul(u_heavy_item).mul(decimal.sub(1, decimal.mul(u_light_item, -1).exp()));
                const Demoninator = decimal.div(u_light_item, 2).mul(-1).exp().mul(u_light_item).mul(decimal.sub(1, decimal.mul(u_heavy_item, -1).exp()));

                PFR.push(decimal.div(Numerator, Demoninator).toString());
            }

            const RPFR = PFR.reduce((pre, acc) => decimal.mul(pre, acc).toString());
            const beta = decimal.pow(RPFR, decimal.div(1, isotopeNumber)).toString();
            const fractionation = decimal.ln(beta).mul(1000).toString();
            return {
                T: {
                    celsius,
                    kelvin: kelvin_t,
                },
                PFR,
                RPFR,
                beta,
                fractionation,
            };
        });

        return res(fractionationCalculateResults);

    });
}

// export default async function calculateIsotopeFractionation(text: { castep: { heavy: string, light: string }, cell?: string }, isFixed?: boolean): Prmose<any>;
// export default async function calculateIsotopeFractionation(text: { castep: { heavy: string, light: string }, cell?: string }[], isFixed?: boolean): Prmose<any>;
export default async function calculateIsotopeFractionationByCASTEP(params: {
    task: { castep: { heavy: string, light: string }, cell?: string, fixAtoms?: boolean }
    | { castep: { heavy: string, light: string }, cell?: string, fixAtoms?: boolean }[]
}) {
    const { task } = params;
    if (Array.isArray(task)) return Promise.all(task.map((taskItem) => calculateIsotopeFractionationByCASTEP({ task: taskItem })));

        const { castep: castepFiles, cell, fixAtoms } = task || {};
        const { heavy: heavyFile, light: lightFile } = castepFiles || {};
        if (fixAtoms && !cell) throw new Error('缺少cell文件！');
        if (!heavyFile || !lightFile) throw new Error('缺少castep文件！');

        const [vibrationFrequencyInfo_heavy, vibrationFrequencyInfo_light] = await getVibrationFrequencyInfo([heavyFile,lightFile]);
        const 


}