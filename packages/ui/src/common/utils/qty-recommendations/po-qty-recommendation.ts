import { BundleAndQtyModel } from "./bundle-qty-model";

export class POQtyRecommendationUtil {
    getPossibleQuantities(bundles: BundleAndQtyModel[]) {
        let possibleQuantities = new Set<number>();
        let combinationsMap = new Map<number, Map<string, number[]>>();
        function findCombinations(index: number, currentSum: number, currentCombo: number[]) {
            if (currentSum > 0) {
                possibleQuantities.add(currentSum);
                let comboKey = JSON.stringify(currentCombo.sort((a, b) => b - a));
                if (!combinationsMap.has(currentSum)) {
                    combinationsMap.set(currentSum, new Map());
                }
                combinationsMap.get(currentSum)?.set(comboKey, [...currentCombo]);
            }
            if (index >= bundles.length) return;

            let { bundleQty, noOfEligibleBundles } = bundles[index];

            for (let i = 0; i <= noOfEligibleBundles; i++) {
                findCombinations(index + 1, currentSum + i * bundleQty, [...currentCombo, ...Array(i).fill(bundleQty)]);
            }
        }

        findCombinations(0, 0, []);
        return {
            quantities: Array.from(possibleQuantities).sort((a, b) => a - b),
            combinationsMap
        };
    }

    getRecommendedQuantities(bundles: BundleAndQtyModel[], userSelectedQty: number): number[] {
        let { quantities } = this.getPossibleQuantities(bundles);

        if (quantities.includes(userSelectedQty)) return [0];

        let before: number | null = null, after: number | null = null;
        for (let qty of quantities) {
            if (qty <= userSelectedQty) before = qty;
            if (qty >= userSelectedQty) {
                after = qty;
                break;
            }
        }

        return [before, after].filter((q): q is number => q !== null);
    }

    getBundlesForQuantity(bundles: BundleAndQtyModel[], targetQuantity: number): BundleAndQtyModel[] {
        let { combinationsMap } = this.getPossibleQuantities(bundles);
        if (!combinationsMap.has(targetQuantity)) return [];

        let possibleCombos = Array.from(combinationsMap.get(targetQuantity)?.values() || []);
        let selectedCombo = possibleCombos.sort((a, b) => b.length - a.length)[0] || [];

        let bundleMap = new Map<number, number>();
        selectedCombo.forEach(qty => {
            bundleMap.set(qty, (bundleMap.get(qty) || 0) + 1);
        });

        return Array.from(bundleMap, ([bundleQty, noOfEligibleBundles]) => ({ bundleQty, noOfEligibleBundles }));
    }


}





// Example Usage
// const bundles = [
//     { bundleQty: 20, noOfEligibleBundles: 4 },
//     { bundleQty: 7, noOfEligibleBundles: 1 },
//     { bundleQty: 6, noOfEligibleBundles: 1 },
// ];
// const userSelectedQty = 15;
// console.log("Possible Quantities:", getPossibleQuantities(bundles));
// console.log("Recommended Quantities:", getRecommendedQuantities(bundles, userSelectedQty));
