export interface IsotopeFractionationData {
    fractionation: number;
    temperature: number;
    category: string;
    name: string;
    celsius: string;
    kelvin: string;
}

export interface ForceConstantData {
    category: string;
    name: string;
    forceConstant: number;
    fractionation: number;
}