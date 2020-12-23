/**
 *
 * 对象工具
 * @author heyuxin
 * @date 2019/9/20 14:53
 */


export class ObjectUtils {
    /**
     * 克隆对象，如果非对象则直接返回
     * @param obj
     */
    public static clone(obj){
        if (typeof obj != 'object') {
            return obj;
        }
        let temp = null;
        if(obj instanceof Array){
            temp = obj.concat();
        }else if(obj instanceof Function){
            //函数是共享的是无所谓的，js也没有什么办法可以在定义后再修改函数内容
            temp = obj;
        }else{
            temp = {};
            for(let item in obj){
                let val = obj[item];
                temp[item] = typeof val == 'object'?ObjectUtils.clone(val):val; //这里也没有判断是否为函数，因为对于函数，我们将它和一般值一样处理
            }
        }
        return temp;
    }
    /**
     * 判断两个对象是否相同
     * @param left
     * @param right
     */
    public static objectEquals(left, right): boolean {
        let leftType = typeof left;
        let rightType = typeof right;
        if (leftType != rightType) {
            return false;
        }
        if (leftType == "object") {
            // 对象类型，则需要递归
            // 优先判断成员数是否相同
            if (ObjectUtils.objectMemberCount(left) != ObjectUtils.objectMemberCount(right)) {
                return false;
            }
            for (let key in left) {
                if (!ObjectUtils.objectEquals(left[key], right[key])) {
                    return false;
                }
            }
        } else if (left != right) {
            // 非对象类型，则只判断值
            return false;
        }

        return true;
    }

    /**
     * 计算对象成员数
     * @param obj
     */
    public static objectMemberCount(obj): number {
        let count = 0;
        for (let key in obj) {
            count++;
        }
        return count;
    }
}
