import { last, isEmpty } from "lodash";
import type { Options } from './models';

export function findLeafValue(values: (string | number | null)[][]): (string | number)[] {
    const leafValues = values?.map((value) => {
        if (Array.isArray(value)) {
            return last(value);
        } else {
            return value;
        }
    });
    return leafValues?.filter(Boolean) as (string | number)[] || [];
}

export function findPath(nodeValue: string | number | null, options: Options[], path: (string | number)[]) {
    if (!options || options.length === 0) return path;
    if (nodeValue === null) return path;
    let innerPath = [...path];
    options.find((item) => {
        innerPath.push(item.value);
        if (item.value === nodeValue) {
            return true;
        } else {
            innerPath = findPath(nodeValue, item.children || [], innerPath)
            if (last(innerPath) === nodeValue) return true;
            innerPath.pop();
            return false;
        }
    });
    return innerPath;
}

export function recoverCascaderValue(leafValues: (string | number | null)[], options: Options[]): (string | number)[][] {
    const cascaderValue = leafValues?.map((value) => {
        const path = findPath(value, options, []) || [];
        return path.length === 0 ? null : path;
    });
    return cascaderValue.filter(Boolean) as (string | number)[][];
}

/**全选可选的字节点 */
export function getAllAbledLeafValue(options: Options[]): (string | number)[] {
    const res: (string | number)[] = [];
    if (isEmpty(options) || !options) return res;
    options?.forEach((option) => {
        if (option.disabled) return;
        if (isEmpty(option.children) || !option.children) return res.push(option.value);
        res.push(...getAllAbledLeafValue(option.children || []));
    });

    return res || [];
}
