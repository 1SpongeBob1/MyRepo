import {LogTool} from "./LogTool";
import {Tools} from "./Tools";
import {BaseComponent} from "../component/BaseComponent";

/**
 * 窗口层级
 */
export const enum Layer {

    /**
     * 背景层-最底层
     */
    BACKGROUND = -100,

    /**
     * 吐司层-最高层
     */
    TOAST = 1000,

    /**
     * 子窗口层
     */
    SUB_WINDOW = 100,

    /**
     * 广告层
     */
    AD = 0,

}

/**
 * 预制资源工具类
 *
 * @author XuRui
 * @date 2019/1/17 11:03
 */
export class PrefabTools {

    /**
     * 加载预置
     *
     * @param parent 父节点
     * @param prefabStr 预置资源
     * @param callback  回调 prefab(预置） 可空
     * @param target 回调函数捕获的this(为空时不捕获）
     * @param layer 层级
     */
    static loadPrefab<T extends BaseComponent>(parent: cc.Node, prefabStr: string, callback: (prefab: T) => void = null, target: any = null, layer = Layer.SUB_WINDOW) {

        if (!parent || !parent.isValid) {
            //父节点不可用

            return;
        }

        //加载预置
        cc.loader.loadRes(prefabStr, function (err, prefabNode) {
            if (!(Tools.checkNonNull(parent) && parent.isValid)) {
                return;
            }
            if (err || !prefabNode) {
                LogTool.log(`预制 ${prefabStr} 加载失败：`);
                //失败回调
                if (callback) {
                    //调用的位置不在调用loadPagePrefab()的位置（如Merge2048GamePrefab），this永远无法捕获到调用loadPagePrefab()时的this
                    if (target) {
                        callback.call(target, null)
                    } else {
                        callback(null)
                    }
                }
                return;
            }

            //创建预置实例
            let prefab = cc.instantiate(prefabNode);

            //添加到父节点
            parent.addChild(prefab, layer);

            //成功回调
            if (callback) {
                let component = prefab.getComponents(BaseComponent)[0];
                if (target) {
                    callback.call(target, component);
                } else {
                    callback(component);
                }
            }
        })
    }

    /**
     * 加载对话框预制
     *
     * @param prefabStr 预置资源
     * @param callback 回调 prefab(预置） 可空
     * @param target 回调函数捕获的this(为空时不捕获）
     * @param layer 层级
     */
    static loadWindow<T extends BaseComponent>(prefabStr: string, callback: (prefab: T) => void = null, target: any = null, layer = Layer.SUB_WINDOW) {
        let canvas = cc.director.getScene().getChildByName('Canvas');
        if (canvas.parent){
            canvas = canvas.parent;
        }

        this.loadPrefab(canvas, prefabStr, callback, target, layer)
    }

}
