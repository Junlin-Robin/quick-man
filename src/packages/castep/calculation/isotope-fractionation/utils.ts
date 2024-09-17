import { c, h, k } from '../constants';
import decimal from 'decimal.js';

import type {
    IsotopeFractionationParams,
    MinimizationImplParamsType,
} from './models';

/**
 * 校验同位素分馏的入参是否合法，防止意外数据造成计算错误和崩溃
 * @param inputParams 调用 calculateISOFractionationFromFrequencyByCASTEP 方法的入参，注意如果入参是数组这里需要遍历校验
 * @returns 抛出异常
 */
export function validateIsotopeFractionationInputParams(inputParams: IsotopeFractionationParams) {
    const { freq, isotopeNumber, proportions, TGradient } = inputParams || {};

    const { heavy: waveNumber_heavy_arr, light: waveNumber_light_arr } = freq || {};

    //校验输入数据格式，防止可能的计算问题
    if (waveNumber_heavy_arr?.length !== waveNumber_light_arr?.length) throw new Error('轻、重同位素的输入波数数组长度不一致！');
    if (waveNumber_heavy_arr?.length !== proportions?.length) throw new Error('同位素波数数组与比例数组长度不一致！');

    if (isotopeNumber <= 0 || !isotopeNumber) throw new Error('计算同位素的原子数设置错误！');

    if (TGradient?.length && TGradient?.some((item) => Number(item?.kelvin || 0) <= 0)) throw new Error('温度梯度设置不能小于 0 K！');

}

/**
 * 同位素分馏的最小粒度底层计算实现
 * @param params kelvin-开尔文温度；isotopeNumber-计算同位素的原子数量；waveNumber_heavy-重同位素波数数组；waveNumber_light-轻同位素波数数组
 * @returns PFR-配分函数；RPFR-约化配分函数；beta-β值；fractionation-同位素分馏值
 */
export function calculateIsotopeFractionation_MinimizationImpl(params: MinimizationImplParamsType) {
    const { waveNumber_heavy, waveNumber_light, isotopeNumber, kelvin } = params || {};

    //波数转化频率
    const angular_freq_heavy = waveNumber_heavy.map((item) => decimal.mul(item, c).toString());
    const angular_freq_light = waveNumber_light.map((item) => decimal.mul(item, c).toString());

    const u_heavy = angular_freq_heavy.map((angular_heavy) => decimal.mul(angular_heavy, h).div(k).div(kelvin).toString());
    const u_light = angular_freq_light.map((angular_light) => decimal.mul(angular_light, h).div(k).div(kelvin).toString());
    //计算配分函数
    const PFR = [];
    for (let i = 0; i < u_heavy.length; i++) {
        const u_heavy_item = u_heavy[i];
        const u_light_item = u_light[i];
        const Numerator = decimal.div(u_heavy_item, 2).mul(-1).exp().mul(u_heavy_item).mul(decimal.sub(1, decimal.mul(u_light_item, -1).exp()));
        const Demoninator = decimal.div(u_light_item, 2).mul(-1).exp().mul(u_light_item).mul(decimal.sub(1, decimal.mul(u_heavy_item, -1).exp()));
        if (Demoninator.toString() === '0') PFR.push('1')
        else PFR.push(decimal.div(Numerator, Demoninator).toString());
    }

    //计算约化配分函数，β值和同位素分馏值
    const RPFR = PFR.reduce((pre, acc) => decimal.mul(pre, acc).toString());
    const beta = decimal.pow(RPFR, decimal.div(1, isotopeNumber)).toString();
    const fractionation = decimal.ln(beta).mul(1000).toString();
    return {
        /**
         * 配分函数
         */
        PFR,
        /**
         * 约化配分函数
         */ 
        RPFR,
        /**
         * β值
         */
        beta,
        /**
         * 同位素分馏值
         */
        fractionation,
    };

}