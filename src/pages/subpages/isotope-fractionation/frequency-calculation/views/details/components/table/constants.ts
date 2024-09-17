export const TableHeaderMap = Object.freeze({
    name: '名称',
    celsius: '摄氏度（°C）',
    kelvin: '华氏度（K）',
    thousand_div_T: '1000/T（K⁻¹）',
    thousand_div_T_square: '10⁶/T²（K⁻²）',
    beta: 'β',
    fractionation: '1000lnβ（‰）',
    thousand_Beta_minor: '1000(β-1)（‰）',
    forceConstant: '力常数（N/mN/mss）',
    isotope: '计算同位素',
    isotopeMass: '同位素质量',
    isotopeNumber: '同位素原子数量',
    fixedIsotopeNumber: '固定同位素原子数量',
    calculationMethod: '计算模式',
});

export const ISOTOPE_FRACTIONATION_TableHeaderList = [
    'name', 
    'celsius',
    'kelvin',
    'thousand_div_T',
    'thousand_div_T_square',
    'beta',
    'fractionation',
    'thousand_Beta_minor',
    'isotope',
    'isotopeMass',
    'isotopeNumber',
    'fixedIsotopeNumber',
    'calculationMethod',
];

export const FORCE_CONSTANT_TableHeaderList = [
    'name', 
    'forceConstant',
    'isotope',
    'isotopeMass',
    'isotopeNumber',
    'fixedIsotopeNumber',
    'calculationMethod',
];
