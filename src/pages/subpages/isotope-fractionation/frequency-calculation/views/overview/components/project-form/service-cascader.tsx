import { useMemo } from 'react';
import { Cascader as AntdCascader } from 'antd';
import { CalculationServiesOptions, CALCULATION_SERVICE } from '../../../../constants';
import { last } from 'lodash';

interface Options {
    label: string;
    value: number;
    children?: Options[];
}

function findLeafValue(values: CALCULATION_SERVICE[][]): number[] {
    const leafValues = values?.map((value) => {
        if (Array.isArray(value)) {
            return last(value);
        } else {
            return value;
        }
    });
    return leafValues?.filter(Boolean) as number[] || [];
}

function findPath(nodeValue: number, options: Options[], path: number[]) {
    if (!options || options.length === 0) return path;
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

function recoverCascaderValue(leafValues: number[]): CALCULATION_SERVICE[][] {
    const cascaderValue = leafValues?.map((value) => {
        const path = findPath(value, CalculationServiesOptions, []) || [];
        return path;
    });
    return cascaderValue;
}

export default function Cascader(props: {
    value?: number[],
    onChange?: (value: number[]) => void
}) {
    const { value, onChange } = props;

    const innerValue = useMemo(() => {
        if (value) {
            return recoverCascaderValue(value);
        }
        return [];
    }, [value]);

    const handleChange = (values: CALCULATION_SERVICE[][]) => {
        const leafValues = findLeafValue(values);
        onChange?.(leafValues);
    };

    return (
        <AntdCascader
            options={CalculationServiesOptions}
            value={innerValue}
            onChange={handleChange}
            multiple
            showCheckedStrategy="SHOW_CHILD"
            maxTagCount="responsive"
            showSearch
            placeholder="请选择涉及到的计算服务" />
    )
}