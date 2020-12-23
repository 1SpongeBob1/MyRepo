export class RandomTools {

    /**
     * 概率数组
     */
    private static readonly _probArrays = {};

    /**
     * 类型数组
     */
    private static readonly _typeArrays = {};


    /**
     *
     * 随机生成卡牌（内部调用）
     *
     * @param objArray 待概率生成的对象数组
     * @param probabilityArray 概率数组
     */
    static randomCardInterval<T>(objArray: Array<T>, probabilityArray: Array<number>): any {
        let sum = 0;
        let factor = 0;
        let random = Math.random();

        //统计概率总和
        for (let everyProbability of probabilityArray) {
            sum += everyProbability;
        }

        random *= sum;

        for (let index = probabilityArray.length - 1; index >= 0; index--) {
            factor += probabilityArray[index];
            if (factor >= random) {
                return objArray[index];
            }
        }
        return null;
    }

    /**
     * 根据概率决定行为
     * dp: 60% 传的是 60.0
     */
    static random(dp: number): boolean {
        let random = Math.ceil(Math.random() * 100);
        return (dp >= random);
    }

    static randomIn(min: number, max: number): number {
        let offset = max - min;
        return min + Math.ceil(Math.random() * offset);
    }

    static randomInNumber(min: number, max: number): number {
        let offset = max - min;
        return min +Math.random() * offset;
    }

}
