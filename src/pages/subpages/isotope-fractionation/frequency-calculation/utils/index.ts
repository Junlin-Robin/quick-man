import { isEmpty } from "lodash";
import type { CALCULATION_SERVICE } from "@/pages/subpages/isotope-fractionation/frequency-calculation/constants";
import { CalculationServiesOptions } from "@/pages/subpages/isotope-fractionation/frequency-calculation/constants";

interface Option {
    label: string;
    value: CALCULATION_SERVICE;
    children?: Option[];
}

export function findNode(nodeValue: number, options: Option[] = CalculationServiesOptions): Option | null {
    if (!options || isEmpty(options)) return null;
    let findedNode: Option | null = null;
    options?.some((option: Option) => {
        if (option.value === nodeValue) {
            findedNode = option;
            return true;
        } else {
            const node = findNode(nodeValue, option.children || []);
            if (node && node.value === nodeValue) {
                findedNode = node;
                return true;
            }
            return false;
        }
    });
    return findedNode || null;
}
