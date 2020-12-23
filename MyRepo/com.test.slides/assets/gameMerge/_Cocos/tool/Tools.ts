import {LogTool} from "./LogTool";
import SpriteFrame = cc.SpriteFrame;

export class Tools {
    static MS_MINUTE = 60 * 1000;
    static MS_HOUR = 60 * 60 * 1000;
    static MS_DAY = 24 * 60 * 60 * 1000;

    /**
     * 获取当前节点转换到某节点下的坐标
     * @param curNode 待转换坐标的节点
     * @param targetNode 目标节点
     */
    static getNodePos(curNode: cc.Node, targetNode: cc.Node): cc.Vec2 {
        let worldPos = curNode.getParent().convertToWorldSpaceAR(curNode.getPosition());
        return targetNode.convertToNodeSpaceAR(worldPos);
    }

    static pToAngle(p: cc.Vec2): number {
        return p.signAngle(new cc.Vec2(0, 1))
    }

    /**
     * 将类似"1#100"，这样的字符串，分割为数字数组[1,100]
     */
    static splitSharpStrToNumArrs(str: string): number[] {
        let strArrs = str.split("#");
        let numArrs: number[] = [];
        for (let i = 0; i < strArrs.length; ++i) {
            numArrs.push(Number(strArrs[i]));
        }
        return numArrs;
    }

    public static isNumberType(obj): boolean {
        return typeof obj === "number";
    }

    static unitStrings = ["", "K", "M", "B", "T", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj ", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az", "ba", "bb", "bc", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bk", "bl", "bm", "bn", "bo", "bp", "bq", "br", "bs", "bt", "bu", "bv", "bw", "bx", "by", "bz", "ca", "cb", "cc", "cd", "ce", "cf", "cg", "ch", "ci", "cj", "ck", "cl", "cm", "cn", "co", "cp", "cq", "cr", "cs", "ct", "cu", "cv", "cw", "cx", "cy"];

    static convertUnit(value: number): string {
        let unit = Tools.getNumCount(value);
        if (unit > 0) {
            unit--;
        }
        let unitIdx = 0;
        if (unit >= 6) {
            unitIdx = Math.floor(unit / 3) - 1;
        }
        unitIdx = Math.min(unitIdx, Tools.unitStrings.length - 1);
        let base = Math.pow(10, unitIdx * 3);
        let numToShow = Math.floor(value / base).toString();
        let numToShowString = "";
        let j = 0;
        for (let i = numToShow.length - 1; i >= 0; --i) {
            ++j;
            numToShowString = numToShow[i] + numToShowString;
            if (i != 0 && j % 3 == 0) {
                numToShowString = "," + numToShowString;
            }
        }
        return numToShowString + Tools.unitStrings[unitIdx];
    }

    static getNumCount(value: number): number {
        let count = 0;
        while (value > 0) {
            count++;
            value = Math.floor(value / 10);
        }
        return count;
    }

    /**
     * 基于权重的随机数
     * @param levelArr 1，2
     * @param weightArr 100，30
     */
    public static getWeightRandom(levelArr: number[], weightArr: number[]) {

        let sum = 0;
        for (let i = 0; i < weightArr.length; i++) {
            sum += weightArr[i];
        }
        let randomArr = [];
        for (let i = 0; i < levelArr.length; i++) {
            let p = Math.floor(weightArr[i] / sum * 10);
            for (let j = 0; j < p; j++) {
                randomArr.push(levelArr[i]);
            }
        }

        let random = randomArr[Math.floor(Math.random() * randomArr.length)];
        return random;
    }

    /**
     * 根据随机权重返回序号
     * @param weightArr 权重列表
     */
    public static getIdxWidthWeights(weightArr: number[]): number {
        let sum = 0;
        for (let i = 0; i < weightArr.length; i++) {
            sum += weightArr[i];
        }
        let random = sum * Math.random();
        let idx = 0;
        let currentSum = 0;
        for (let i = 0; i < weightArr.length; i++) {
            currentSum += weightArr[i];
            if (random < currentSum) {
                idx = i;
                break;
            }
        }
        return idx;
    }

    /**
     * 百分比概率算法
     * @param probability 输入 0.01 - 1
     */
    public static getRandom(probability: number): boolean {
        var probability = probability * 100 || 1;
        var odds = Math.floor(Math.random() * 100);

        if (probability === 1) {
            return true
        }

        if (odds < probability) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 获取整形随机数[min, max)
     * @param min 最小值，包含
     * @param max 最大值，不包含
     */
    public static getRandomNumber(min: number, max: number): number {
        // Math.random()//包括0,不包括1
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * 字符串是否为空字符串或null
     * @param str
     */
    public static isEmpty(str: string) {
        return str == null || str.length == 0;
    }

    public static safeDestroyNode(node: cc.Node) {
        if (Tools.checkNonNull(node) && cc.isValid(node)) {
            node.destroy();
        }
    }

    public static checkNonNull(object: any): boolean {
        return object != undefined && object != null;
    }

    public static checkNonNulls(objects: any[]): boolean {
        for (let i = 0; i < objects.length; i++) {
            if (!Tools.checkNonNull(objects[i])) {
                return false;
            }
        }
        return true;
    }

    // public static convertMillisecondsToTime(second: number): string {
    //     let minute = Math.floor(second / 60);
    //     let sec = second % 60;
    //     if (sec < 10) {
    //         return `${minute}:0${sec}`;
    //     }
    //     return `${minute}:${sec}`;
    // }

    /**
     * 以格式化显示剩余时间，比如剩余一小时01:00:00
     * @param leftTime 毫秒数
     * @param showHour
     * @param showMinute
     * @param showSecond
     */
    public static convertMillisecondsToTime(leftTime: number, showHour = true, showMinute = true, showSecond = true) {
        if (showHour) {
            let hour = Math.floor(leftTime / (Tools.MS_HOUR));
            let minute = Math.floor((leftTime - hour * Tools.MS_HOUR) / (Tools.MS_MINUTE));
            let second = Math.floor(leftTime % (Tools.MS_MINUTE) / 1000);
            // return Tools.sprintf("%02d:%02d:%02d", hour, minute, second);
        }
        if (showMinute) {
            // 不显示小时
            let minute = Math.floor(leftTime / (Tools.MS_MINUTE));
            let second = Math.floor(leftTime % (Tools.MS_MINUTE) / 1000);
            // return Tools.sprintf("%02d:%02d", minute, second);
        }
        if (showSecond) {
            let second = Math.floor(leftTime / 1000);
            // return Tools.sprintf("%02d", second);
        }
        return "";
    }


    public static createSpriteWidthSpriteFrame(spriteFrame: cc.SpriteFrame): cc.Node {
        let n1 = new cc.Node();
        n1.addComponent(cc.Sprite);
        n1.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        return n1;
    }

    /**
     * 发射一次性粒子，播放时长为粒子的duration
     * @param url 资源路径
     * @param parent 父节点
     * @param pos 位置
     * @param zorder parent.addChild的zorder
     * @param loadedCallback 装载成功后的回调，比如装载成功后可以在回调中执行一些代码。参数：当前的粒子实例, 粒子的duration
     */
    public static emitOneTimeParticle(url: string, parent: cc.Node, pos: cc.Vec2, zorder: number, loadedCallback: (node: cc.Node, lifeDuration: number) => void = null) {
        cc.loader.loadRes(url, function (err, prefab) {
            //检查资源加载
            if (err) { /*LogUtils.logV('载入预制资源失败, 原因:' + errorMessage);*/
                return;
            }
            if (!(prefab instanceof cc.Prefab)) { /*LogUtils.logV('你载入的不是预制资源!');*/
                return;
            }
            let node = cc.instantiate(prefab);
            let particle = node.getComponent(cc.ParticleSystem);
            node.position = pos;
            parent.addChild(node, zorder);
            let lifeDuration = particle.duration;
            if (loadedCallback != null)
                loadedCallback(node, lifeDuration);
            if (lifeDuration > 0) {
                node.runAction(
                    cc.sequence(
                        cc.delayTime(lifeDuration),
                        cc.callFunc(function () {
                            Tools.safeDestroyNode(node);
                        })
                    )
                );
            }
        });
    }

    static inertList(list: any[], idx: number, item: any): any[] {
        let left = list.slice(0, idx);
        let right = list.slice(idx, list.length);
        left.push(item);
        return left.concat(right);
    }

    static isDigit(ch): boolean {
        return (ch >= '0' && ch <= '9');
    }

    /**
     * 播放数字翻动画
     * @param label
     * @param num
     * @param updateString
     * @param countingDeltaTime 两次数字变化的间隔时间
     * @param callback
     */
    static showCountingAnimation(label: cc.RichText | cc.Label, num: number, updateString: boolean, countingDeltaTime: number = 0.08,
                                 callback: (label: cc.RichText | cc.Label, num: number, numStr: string) => void = null): number {
        let _currentNumber = "_currentNumber";
        label.node.stopAllActions();
        if (isNaN(label[_currentNumber])) {
            label[_currentNumber] = num;
            if (updateString)
                label["string"] = Tools.convertUnit(num);
            if (callback != null)
                callback(label, num, label["string"]);
            return 0;
        } else {
            let currentNumber = label[_currentNumber];
            let offset = num - currentNumber;
            let max = 8;
            let delay = 0;
            let lastNumber = currentNumber;
            for (let i = 0; i < max; ++i) {
                delay += countingDeltaTime;
                let curr = Math.ceil(currentNumber + (offset / max) * (i + 1));
                if (lastNumber == curr)
                    continue;
                lastNumber = curr;
                label.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function () {
                    label[_currentNumber] = curr;
                    if (updateString)
                        label["string"] = Tools.convertUnit(curr);
                    if (callback != null)
                        callback(label, curr, label["string"]);
                })))
            }
            return delay;
        }
    }

    /**
     * 分离数字和单位
     */
    static splitNumUnit(numStr: string): string[] {
        let unit = "";
        if (numStr.length > 0 && !Tools.isDigit(numStr.charAt(numStr.length - 1))) {
            unit = numStr.charAt(numStr.length - 1);
            if (numStr.length > 1 && !Tools.isDigit(numStr.charAt(numStr.length - 2))) {
                unit = numStr.charAt(numStr.length - 2) + unit;
            }
            numStr = numStr.substring(0, numStr.length - unit.length);
        }
        return [numStr, unit]
    }

    public static getMinute(oldTimeStamp: number, newTimeStamp: number) {
        let lastDate = new Date(oldTimeStamp * 1000).getTime();
        let nowDate = new Date(newTimeStamp * 1000).getTime();
        let utc = nowDate - lastDate;
        let minute = utc / (60 * 1000);
        return minute;
    }

    public static loadNetworkImg(url: string, targetSprite: cc.Sprite, callback?: (sp: SpriteFrame) => void) {
        let httpOrhttpsRegex = "^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$";
        if (!Tools.checkNonNull(url) || url.match(httpOrhttpsRegex) == null) {
            return;
        }
        cc.loader.load({url: url, type: `png`}, function (err, sp) {
            if (err) {
                return;
            }
            if (cc.isValid(targetSprite)) {
                targetSprite.spriteFrame = new cc.SpriteFrame(sp);
            }
            if (callback != null) {
                callback(sp);
            }
        });
    }

    /**
     *
     * @param {string} config 配置
     * @param {string} separator 分割符
     * exp:  "1:200;2:300"  返回[[1,200],[2,300]]
     */
    public static splitCheckInConfig(config: string, separator?: string): number[][] {
        let splitStr: string = (separator == null || separator == undefined) ? ";" : separator;
        let splitArray: string[] = config.split(splitStr);
        let parseArray: Array<number[]> = [];
        if (splitArray == null || splitArray == undefined || splitArray.length == 0) return parseArray;
        for (let i = 0; i < splitArray.length; i++) {
            let itemArray = splitArray[i].split(":");
            parseArray.push([]);
            for (let j = 0; j < itemArray.length; j++) {
                parseArray[i][j] = Number(itemArray[j]);
            }
        }
        return parseArray;
    }

    /**
     * 数字是否为浮点
     * @param num
     */
    public static isFloat(num: number): boolean {
        return (Math.floor(num) != num);
    }

    /**
     * 数字转化为浮点
     * @param num
     */
    public static getFloat(num: number): number {
        if (!Tools.isFloat(num)) {
            return num + 0.99;
        }
        return num;
    }

    /**
     * 验证邮箱格式
     * @param strEmail
     */
    public static isEmailAvailable(strEmail: string): boolean {
        if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(strEmail)) {
            LogTool.log(`redeem: 邮箱格式不正确`);
            return false;
        } else {
            LogTool.log(`redeem: 邮箱格式正确`);
            return true;
        }
    }

    /**
     * load本地图片
     * @param path
     * @param targetSprite
     */
    public static loadLocalImg(path: string, targetSprite: cc.Sprite){
        cc.loader.loadRes(path, cc.SpriteFrame, function (err, sp) {
            if (!err && targetSprite && sp){
                targetSprite.spriteFrame =  sp;
            }
        });
    }

    /**
     * 获取本地时间戳
     */
    public static getClientTimestamp(): number{
        return new Date().getTime();
    }

    /**
     * 移除数组的某个元素
     * @param targetArray 目标数组
     * @param target 待删除元素
     */
    static remove<T>(targetArray: T[], target: T): T[]{
        let index = targetArray.indexOf(target);
        if (index > -1){
            return targetArray.splice(index, 1);
        }
        return targetArray;
    }

}
