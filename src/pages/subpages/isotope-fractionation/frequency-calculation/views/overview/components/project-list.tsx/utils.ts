import { isEmpty } from "lodash";
import type { CALCULATION_SERVICE } from "../../../../constants";

interface Option {
    label: string;
    value: CALCULATION_SERVICE;
    children?: Option[];
}

export function findNode(nodeValue: number, options: Option[]): Option | null {
    if (!options || isEmpty(options)) return null;
    let finedNode: Option | null = null;
    options?.some((option: Option) => {
        if (option.value === nodeValue) {
            finedNode = option;
            return true;
        } else {
            const node = findNode(nodeValue, option.children || []);
            if (node && node.value === nodeValue) {
                finedNode = node;
                return true;
            }
            return false;
        }
    });
    return finedNode || null;
}
