/**
 * 吐司工具
 *
 * @author XuRui
 * @date 2019/2/28 10:13
 */
import {TOAST_DURATION, ToastPrefab} from "./ToastPrefab";
import {LogTool} from "../LogTool";

export default class Toast {

    /**
     * 吐司单例
     */
    private static toastInstance: ToastPrefab = null;

    /**
     * 吐司
     */
    static toast(str: string, duration = TOAST_DURATION.SHORT) {
        if (this.toastInstance && this.toastInstance.node) {
            //不为空并且可用

            this.toastInstance.show(str, duration)
        } else {
            //为空或者不可用
            this.tryToast(str, duration)
        }
    }

    /**
     * 尝试吐司
     */
    private static tryToast(str: string, duration: TOAST_DURATION) {
        let toastUrl = null;
        if (!toastUrl) {
            LogTool.log("未定制 TOAST 预制")
        } else {
            // region 加载到当前画布
            let self = this;
            cc.loader.loadRes(toastUrl,  (err, prefabNode)=> {
                if (err || !prefabNode) {
                    return;
                }
                //创建预置实例
                //添加到父节点
                let canvas = cc.director.getScene().getChildByName('Canvas');
                if (canvas.parent){
                    canvas = canvas.parent;
                }
                if (canvas != null){
                    let prefab = cc.instantiate(prefabNode);
                    canvas.addChild(prefab, 100);
                    //成功回调
                    if (prefab) {
                        let ts: ToastPrefab = prefab.getComponent(ToastPrefab);
                        if (ts) {
                            ts.show(str, duration);
                            self.toastInstance = ts;
                        }
                    }
                }
            });
            // endregion

            // // 启动此方法，防止相互引用
            // //加载预制
            // PrefabTools.loadWindow<ToastPrefab>(toastUrl, (prefab) => {
            //     prefab.show(str, duration);
            //     this.toastInstance = prefab;
            // }, this, Layer.TOAST);
        }
    }

}
