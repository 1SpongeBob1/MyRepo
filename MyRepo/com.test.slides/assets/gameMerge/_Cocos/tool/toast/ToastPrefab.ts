import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import {BaseComponent} from "../../component/BaseComponent";

/**
 * 吐司预制
 */
@ccclass
export class ToastPrefab extends BaseComponent {

    @property(cc.Label)
    private text: cc.Label = null;

    /**
     * 显示
     */
    show(text: string, duration: TOAST_DURATION) {
        this.node.active = true;
        this.text.string = text;

        let self = this;
        this.node.stopAllActions();
        this.node.opacity = 0;
        this.node.runAction(cc.sequence(
            cc.fadeIn(0.3),
            cc.delayTime(duration),
            cc.fadeOut(0.3),
            cc.callFunc(function () {
                self.node.active = false;
            })));
    }

    /**
     * 呼吸效果
     */
    breath(text: string) {
        this.node.active = true;
        this.text.string = text;

        this.node.stopAllActions();
        //动画
        let action = cc.sequence(cc.scaleTo(0.18, 1.05), cc.scaleTo(0.36, 1));
        this.node.runAction(cc.repeatForever(action));
    }

    /**
     * 隐藏
     */
    hide() {
        this.node.stopAllActions();
        this.node.active = false;
    }

}

/**
 * 显示时间
 */
export const enum TOAST_DURATION {

    SHORT = 1,

    LONG = 2

}