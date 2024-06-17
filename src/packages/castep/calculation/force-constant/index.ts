import decimal from 'decimal.js';

import {amu, c, pai} from '../constants';
/**
 * 计算分馏
 */
export function calculateForceConstantFromFrequency(params: {
    freq: {
        heavy: string[];
        light: string[];
    };
    cell: {
        isotopeNumber: number;
        massSetting: {
            heavy: string;
            light: string;
        };
    }
}) {
    const { freq, cell } = params;
    const { heavy: waveNumber_heavy, light: waveNumber_light } = freq || {};
    const { isotopeNumber, massSetting } = cell || {};

    return new Promise((res, rej) => {
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

        return res({
            forceConstant,
        });

    });
}