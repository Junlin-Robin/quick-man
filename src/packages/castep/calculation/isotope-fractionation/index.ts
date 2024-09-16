import { T } from './constants';

import {
    validateIsotopeFractionationInputParams,
    calculateIsotopeFractionation_MinimizationImpl,
} from './utils';

import decimal from 'decimal.js';


import type { IsotopeFractionationParams, IsotopeFractionationReturn } from './models';

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



        return res(calculatedRes);

    });
}
