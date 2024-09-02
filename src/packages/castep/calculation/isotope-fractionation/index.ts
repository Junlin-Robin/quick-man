import decimal from 'decimal.js';

// import { getCellInfo } from '../../formatter/get-cell-info';
// import getVibrationFrequencyInfo from '../../formatter/get-vibration-frequency-info';
import { c, h, k } from '../constants';
import { T } from './constants';

export type IsotopeFractionationReturn = Array<{
    T: {
        celsius: string;
        kelvin: string;
    };
    PFR: string[];
    RPFR: string;
    beta: string;
    fractionation: string;
}>

export interface IsotopeFractionationParams {
    freq: {
        heavy: string[][];
        light: string[][];
    };
    cell: {
        isotopeNumber: number;
    };
    proportions: string[];
}
/**
 * 计算分馏
 */
export function calculateISOFractionationFromFrequencyByCASTEP(params: IsotopeFractionationParams): Promise<IsotopeFractionationReturn>;
export function calculateISOFractionationFromFrequencyByCASTEP(params: IsotopeFractionationParams[]): Promise<IsotopeFractionationReturn[]>;
export function calculateISOFractionationFromFrequencyByCASTEP(params: IsotopeFractionationParams | IsotopeFractionationParams[]): Promise<IsotopeFractionationReturn | IsotopeFractionationReturn[]> {
    if (Array.isArray(params)) return Promise.all(params.map((param) => calculateISOFractionationFromFrequencyByCASTEP(param)));

    const { freq, cell, proportions } = params;
    const { heavy: waveNumber_heavy_arr, light: waveNumber_light_arr } = freq || {};
    const { isotopeNumber } = cell || {};

    if (waveNumber_heavy_arr?.length !== waveNumber_light_arr?.length) throw new Error('波数数组长度不一致！');
    if (waveNumber_heavy_arr?.length !== proportions?.length) throw new Error('波数数组长度不一致！');


    return new Promise((res, rej) => {
        // if (!waveNumber_heavy || !waveNumber_light || !isotopeNumber) return rej(new Error('缺少计算必要参数！'));

        // const angular_freq_heavy = waveNumber_heavy.map((item) => decimal.mul(item, c).toString());
        // const angular_freq_light = waveNumber_light.map((item) => decimal.mul(item, c).toString());

        const fractionationCalculateResults = T.map(({ kelvin: kelvin_t, celsius }) => {
            const _results = proportions.map((proportion, index) => {
                const waveNumber_heavy = waveNumber_heavy_arr[index];
                const waveNumber_light = waveNumber_light_arr[index];

                if (!waveNumber_heavy || !waveNumber_light || !isotopeNumber) return rej(new Error('缺少计算必要参数！'));

                const angular_freq_heavy = waveNumber_heavy.map((item) => decimal.mul(item, c).toString());
                const angular_freq_light = waveNumber_light.map((item) => decimal.mul(item, c).toString());
                const u_heavy = angular_freq_heavy.map((angular_heavy) => decimal.mul(angular_heavy, h).div(k).div(kelvin_t).toString());
                const u_light = angular_freq_light.map((angular_light) => decimal.mul(angular_light, h).div(k).div(kelvin_t).toString());


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
                /**
                 * 这里有问题，直接乘以比例，应在单独设置一个变量存放这个乘以比例的值
                 */
                const fractionation = decimal.ln(beta).mul(1000).mul(proportion).toString();
                // const fractionation = decimal.mul(fractionation_raw, proportion).toString();
                return {
                    PFR,
                    RPFR,
                    beta,
                    // fractionation_raw,
                    fractionation,
                };
            });
            const SumResult = (_results as unknown as {
                PFR: string[];
                RPFR: string;
                beta: string;
                fractionation: string;
            }[]).reduce((acc, cur) => ({
                PFR: (acc?.PFR || []).concat(cur?.PFR || []),
                RPFR: decimal.add(acc?.RPFR || 0, cur?.RPFR || 0).toString(),
                beta: decimal.add(acc?.beta || 0, cur?.beta || 0).toString(),
                fractionation: decimal.add(acc?.fractionation || 0, cur?.fractionation || 0).toString(),
            }));

            return {
                T: {
                    celsius,
                    kelvin: kelvin_t,
                },
                ...SumResult,
            }

        });

        return res(fractionationCalculateResults);

    });
}

// export default async function calculateIsotopeFractionationByCASTEP(text: { castep: { heavy: string, light: string }, cell?: string }, isFixed?: boolean): Prmose<any>;
// export default async function calculateIsotopeFractionationByCASTEP(text: { castep: { heavy: string, light: string }, cell?: string }[], isFixed?: boolean): Prmose<any>;
// export default async function calculateIsotopeFractionationByCASTEP(params: {
//     task: { castep: { heavy: string, light: string }, cell?: string, fixAtoms?: boolean }
//     | { castep: { heavy: string, light: string }, cell?: string, fixAtoms?: boolean }[]
// }) {
//     const { task } = params;
//     if (Array.isArray(task)) return Promise.all(task.map((taskItem) => calculateIsotopeFractionationByCASTEP({ task: taskItem })));

//     const { castep: castepFiles, cell, fixAtoms } = task || {};
//     const { heavy: heavyFile, light: lightFile } = castepFiles || {};
//     return new Promise((res, rej) => {
//         if (isFixed && !cell) throw new Error('缺少cell文件！');
//         if (fixAtoms && !cell) throw new Error('缺少cell文件！');
//         if (!heavyFile || !lightFile) throw new Error('缺少castep文件！');

//         const [vibrationFrequencyInfo_heavy, vibrationFrequencyInfo_light] = await getVibrationFrequencyInfo([heavyFile, lightFile]);
//         const
//     })


// }