import decimal from 'decimal.js';

import { amu, c, pai } from '../constants';
/**
 * 计算分馏
 */
export interface ForceConstantParams {
    freq: {
        heavy: string[][];
        light: string[][];
    };
    isotopeNumber: number;
    massSetting: {
        heavy: string;
        light: string;
    };
    proportions: string[];
}
export function calculateForceConstantFromFrequency(params: ForceConstantParams): Promise<{ forceConstant: string }>
export function calculateForceConstantFromFrequency(params: ForceConstantParams[]): Promise<{ forceConstant: string }[]>
export function calculateForceConstantFromFrequency(params: ForceConstantParams | ForceConstantParams[]) {
    if (Array.isArray(params)) return Promise.all(params.map((param) => calculateForceConstantFromFrequency(param)));
    const { freq, isotopeNumber, massSetting, proportions } = params;
    const { heavy: waveNumber_heavy_arr, light: waveNumber_light_arr } = freq || {};

    if (waveNumber_heavy_arr?.length !== waveNumber_light_arr?.length) throw new Error('波数数组长度不一致！');
    if (waveNumber_heavy_arr?.length !== proportions?.length) throw new Error('波数数组长度不一致！');

    return new Promise((res, rej) => {
        const _results = proportions.map((proportion, index) => {
            const waveNumber_heavy = waveNumber_heavy_arr[index];
            const waveNumber_light = waveNumber_light_arr[index];
            if (!waveNumber_heavy || !waveNumber_light || !isotopeNumber || !massSetting) return rej(new Error('缺少计算必要参数！'));

            const freq_heavy = waveNumber_heavy.map((item) => decimal.mul(item, c));
            const freq_light = waveNumber_light.map((item) => decimal.mul(item, c));

            const delta_freq_square = [];
            for (let i = 0; i < freq_heavy.length; i++) {
                const u_heavy_item = freq_heavy[i];
                const u_light_item = freq_light[i];
                const delta_freq_square_Item = decimal.pow(u_light_item, 2).sub(decimal.pow(u_heavy_item, 2));

                delta_freq_square.push(delta_freq_square_Item);
            }

            const delta_freq_square_sum = delta_freq_square.reduce((pre, acc) => decimal.add(pre, acc));

            const delta_mass = decimal.sub(decimal.div(1, decimal.mul(massSetting.light, amu)), decimal.div(1, decimal.mul(massSetting.heavy, amu)));

            const force = decimal.mul(delta_freq_square_sum, 4).mul(pai).mul(pai).div(delta_mass).div(isotopeNumber);

            const forceConstant = force.div(3).toString();

            return decimal.mul(forceConstant, proportion).toString();
        }) as string[];

        return res({
            forceConstant: _results.reduce((acc, cur) => decimal.add(acc, cur).toString()),
        });

    });
}