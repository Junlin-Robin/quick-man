import forceConstantLightUrl from 'public/force-constant-light.svg';
import forceConstantDarkUrl from 'public/force-constant-dark.svg';
import isotopeFractionationLightUrl from 'public/isotope-fractionation-light.svg';
import isotopeFractionationDarkUrl from 'public/isotope-fractionation-dark.svg';

/**
 * 菜单列表，每次新增页面需在这里配置生效
 */
export const MenuList = [
    {
        label: '同位素分馏',
        path: '/calculaion/qm/isotope-fractionation/frequency',
        key: '/calculation/qm/isotope-fractionation/frequency',
        icon: {
            light: isotopeFractionationLightUrl,
            dark: isotopeFractionationDarkUrl,
        },
    },
    {
        label: '力常数计算',
        path: '/calculation/qm/isotope-fractionation/force-constant',
        key: '/calculation/qm/isotope-fractionation/force-constant',
        icon: {
            light: forceConstantLightUrl,
            dark: forceConstantDarkUrl,
        },
    },
];
