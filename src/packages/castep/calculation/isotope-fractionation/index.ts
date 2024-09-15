import { T } from './constants';

import {
    validateIsotopeFractionationInputParams,
    calculateIsotopeFractionation_MinimizationImpl,
} from './utils';

import decimal from 'decimal.js';

import { getEnv } from '@/utils/get-env';

import type { IsotopeFractionationParams, IsotopeFractionationReturn } from './models';

//环境参数
const env = getEnv();

/**
 * 计算分馏
 */
export function calculateISOFractionationFromFrequencyByCASTEP(params: IsotopeFractionationParams): Promise<IsotopeFractionationReturn>;
export function calculateISOFractionationFromFrequencyByCASTEP(params: IsotopeFractionationParams[]): Promise<IsotopeFractionationReturn[]>;
export function calculateISOFractionationFromFrequencyByCASTEP(params: IsotopeFractionationParams | IsotopeFractionationParams[]): Promise<IsotopeFractionationReturn | IsotopeFractionationReturn[]> {
    if (Array.isArray(params)) return Promise.all(params.map((param) => calculateISOFractionationFromFrequencyByCASTEP(param)));

    return new Promise((res) => {
        //校验入参是否合法
        validateIsotopeFractionationInputParams(params);

        const { freq, isotopeNumber, proportions, TGradient = T } = params;
        const { heavy: waveNumber_heavy_arr, light: waveNumber_light_arr } = freq || {};

        if (env === 'development') {
            console.log('开始计算同位素分馏...');
            console.log('计算参数：', '同位素波数：', { ...freq }, '温度设置：', { TGradient }, '同位素计算原子数：', { isotopeNumber });
            console.time('计算同位素用时：')
        }

        const calculatedRes: IsotopeFractionationReturn = []

        TGradient.forEach(({ kelvin, celsius }) => {
            //计算得到的每一套波数对应的同位素分馏信息
            const fractionationInfoWithNoProportion = waveNumber_heavy_arr.map((_, index) => {
                const waveNumber_heavy = waveNumber_heavy_arr[index];
                const waveNumber_light = waveNumber_light_arr[index];

                return calculateIsotopeFractionation_MinimizationImpl({
                    waveNumber_heavy,
                    waveNumber_light,
                    isotopeNumber,
                    kelvin,
                });
            });

            const normalizedBeta = fractionationInfoWithNoProportion.
                map((item, index) => decimal.mul(item.beta, proportions[index])).
                reduce((cur, acc) => decimal.add(cur, acc)).toString();

            const fractionation_proportion = decimal.ln(normalizedBeta).mul(1000).toString();
            const thousand_BetaMinor_proportion = decimal.sub(normalizedBeta, 1).mul(1000).toString();

            calculatedRes.push({
                T: {
                    kelvin,
                    celsius,
                },
                /**配分函数 */
                PFR: fractionationInfoWithNoProportion.map((item) => item.PFR) || [],
                /**约化配分函数 */
                RPFR: fractionationInfoWithNoProportion.map((item) => item.RPFR) || [],
                /**β值 */
                beta: fractionationInfoWithNoProportion.map((item) => item.beta) || [],
                /**
                 * 原始分馏值：1000lnβ
                 * 未乘以比例
                 */
                fractionation_raw: fractionationInfoWithNoProportion.map((item) => item.fractionation) || [],
                /**每套波数的比例 */
                proportions,
                /**
                 * 实际使用的Beta值：β
                 * 用 β 乘以 proportions 累加得到，业务中直接可以使用此值
                 */
                normalizedBeta,
                /**
                 * 实际使用的分馏值：1000lnβ
                 * 用 fractionation_raw 乘以 proportions 累加得到，业务中直接可以使用此值
                 */
                fractionation: fractionation_proportion,
                /**
                 * 实际使用的分馏值：1000(β-1)
                 * 用原始 1000(β-1) 乘以 proportions 累加得到，业务中直接可以使用此值
                 */
                thousand_BetaMinor: thousand_BetaMinor_proportion,
            })
        });

        if (env === 'development') console.timeEnd('计算同位素用时：')

        // if (!waveNumber_heavy || !waveNumber_light || !isotopeNumber) return rej(new Error('缺少计算必要参数！'));

        // const angular_freq_heavy = waveNumber_heavy.map((item) => decimal.mul(item, c).toString());
        // const angular_freq_light = waveNumber_light.map((item) => decimal.mul(item, c).toString());



        // const fractionationCalculateResults = TGradient.map(({ kelvin: kelvin_t, celsius }) => {
        //     const _results = waveNumber_heavy_arr.map((_, index) => {
        //         const waveNumber_heavy = waveNumber_heavy_arr[index];
        //         const waveNumber_light = waveNumber_light_arr[index];

        //         if (!waveNumber_heavy || !waveNumber_light || !isotopeNumber) return rej(new Error('缺少计算必要参数！'));

        //         const angular_freq_heavy = waveNumber_heavy.map((item) => decimal.mul(item, c).toString());
        //         const angular_freq_light = waveNumber_light.map((item) => decimal.mul(item, c).toString());
        //         const u_heavy = angular_freq_heavy.map((angular_heavy) => decimal.mul(angular_heavy, h).div(k).div(kelvin_t).toString());
        //         const u_light = angular_freq_light.map((angular_light) => decimal.mul(angular_light, h).div(k).div(kelvin_t).toString());


        //         const PFR = [];
        //         for (let i = 0; i < u_heavy.length; i++) {
        //             const u_heavy_item = u_heavy[i];
        //             const u_light_item = u_light[i];
        //             const Numerator = decimal.div(u_heavy_item, 2).mul(-1).exp().mul(u_heavy_item).mul(decimal.sub(1, decimal.mul(u_light_item, -1).exp()));
        //             const Demoninator = decimal.div(u_light_item, 2).mul(-1).exp().mul(u_light_item).mul(decimal.sub(1, decimal.mul(u_heavy_item, -1).exp()));

        //             PFR.push(decimal.div(Numerator, Demoninator).toString());
        //         }

        //         const RPFR = PFR.reduce((pre, acc) => decimal.mul(pre, acc).toString());
        //         const beta = decimal.pow(RPFR, decimal.div(1, isotopeNumber)).toString();
        //         /**
        //          * 这里有问题，直接乘以比例，应在单独设置一个变量存放这个乘以比例的值
        //          */
        //         const fractionation = decimal.ln(beta).mul(1000).mul(proportion).toString();
        //         // const fractionation = decimal.mul(fractionation_raw, proportion).toString();
        //         return {
        //             PFR,
        //             RPFR,
        //             beta,
        //             // fractionation_raw,
        //             fractionation,
        //         };
        //     });
        //     const SumResult = (_results as unknown as {
        //         PFR: string[];
        //         RPFR: string;
        //         beta: string;
        //         fractionation: string;
        //     }[]).reduce((acc, cur) => ({
        //         PFR: (acc?.PFR || []).concat(cur?.PFR || []),
        //         RPFR: decimal.add(acc?.RPFR || 0, cur?.RPFR || 0).toString(),
        //         beta: decimal.add(acc?.beta || 0, cur?.beta || 0).toString(),
        //         fractionation: decimal.add(acc?.fractionation || 0, cur?.fractionation || 0).toString(),
        //     }));

        //     return {
        //         T: {
        //             celsius,
        //             kelvin: kelvin_t,
        //         },
        //         ...SumResult,
        //     }

        // });

        return res(calculatedRes);

    });
}
