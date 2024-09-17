export interface TableRecord {
    id: string;
    name: string;
    celsius?: string;
    kelvin?: string;
    thousand_div_T?: string;
    thousand_div_T_square?: string;
    beta?: string;
    fractionation?: string;
    thousand_Beta_minor?: string;
    forceConstant?: string;
    isotope: string;
    isotopeMass: string[];
    isotopeNumber: number;
    fixedIsotopeNumber: number;
    calculationMethod: string;
}