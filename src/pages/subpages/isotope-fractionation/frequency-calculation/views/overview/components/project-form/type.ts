export interface massValueType {
    /**四舍五入值，传给组件 */
    round?: number;
    /**精确值，用于计算 */
    precision?: string;
}

/**
 * 同位素质量字端value值类型
 */
export interface IsotopeMassValueType {
    /**轻同位素 */
    light?: massValueType;
    /**重同位素 */
    heavy?: massValueType;
}

export interface FormType {
    projectName?: string;
    calculationService?: number[];
    calculationElement?: string;
    isotopeMass: IsotopeMassValueType;
    readPermission?: number[];
    editPermission?: number[];
    projectDescription?: string;
}