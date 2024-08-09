import { InputNumber, Space } from 'antd';
import decimal from 'decimal.js';

import type { IsotopeMassValueType } from './type';

interface IProps {
    value?: IsotopeMassValueType;
    onChange?: (v: IsotopeMassValueType) => void;
    massArray: string[];
}

export default function MassInputNumber(props: IProps) {
    const { value, onChange, massArray } = props;

    const handleLightIsotopeMassChange = (v: number | undefined | null) => {
        const precisionValue = massArray?.find((massItem) => decimal.round(massItem).toNumber() === v);
        onChange?.({
            light: {
                round: v || undefined,
                precision: precisionValue,
            },
            heavy: value?.heavy,
        })
    };

    const handleHeavyIsotopeMassChange = (v: number | undefined | null) => {
        const precisionValue = massArray?.find((massItem) => decimal.round(massItem).toNumber() === v);
        onChange?.({
            light: value?.light,
            heavy: {
                round: v || undefined,
                precision: precisionValue,
            },
        })
    };

    return (
        <Space>
            <InputNumber addonBefore="轻" precision={0} value={value?.light?.round} onChange={handleLightIsotopeMassChange} />
            <InputNumber addonBefore="重" precision={0} value={value?.heavy?.round} onChange={handleHeavyIsotopeMassChange} />
        </Space>
    )
}
