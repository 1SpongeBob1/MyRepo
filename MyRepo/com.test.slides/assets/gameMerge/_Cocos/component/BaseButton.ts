import ccclass = cc._decorator.ccclass;
import executeInEditMode = cc._decorator.executeInEditMode;
import property = cc._decorator.property;
import Button = cc.Button;
import {BaseComponent} from "./BaseComponent";
import {Tools} from "../tool/Tools";


/**
 * Button基类（封装了防抖和播放音效）
 *
 * 用法：任意 Node 挂在此组件
 *
 * 监听事件：component.onClick(callback,target)
 *
 */

export enum SoundType {
    None, Normal,
}

@ccclass
@executeInEditMode
export class BaseButton extends BaseComponent {

    @property({visible: false})
    private _soundType: SoundType = SoundType.Normal;

    @property({type: cc.Enum(SoundType)})

    get soundType() {
        return this._soundType
    }

    set soundType(type) {
        this._soundType = type;
    }

    static lastClick = new Date().getTime();

    /**
     * 是否需要拦截事件
     */
    private needInterrupt: boolean = true;

    /**
     * 按钮是否可用
     */
    private _interactable: boolean = true;

    onLoad() {
        super.onLoad();
        this.initButtonScale();
    }

    /**
     * 设置按钮按下缩放效果
     */
    private initButtonScale() {
        let btn = this.node.getComponent(Button);
        if (!Tools.checkNonNull(btn)) {
            btn = this.addComponent(Button);
        }

        btn.enableAutoGrayEffect = true;
        btn.transition = Button.Transition.SCALE;
        btn.zoomScale = 0.9;
        btn.duration = 0.1;
        // btn.node.on(cc.Node.EventType.TOUCH_CANCEL, ()=>{
        //     console.log("BaseButton_onTouchCancel");
        // }, this);
        // btn._onTouchCancel= function () {
        //
        // }
    }

    /**
     * 设置按钮变灰色并且不可按
     */
    set interactable(able: boolean) {
        let btn = this.node.getComponent(Button);
        if (btn != null) {
            btn.interactable = able;
        }

        this._interactable = able;
    }

    on(type: string, callback: any, target?: any) {
        let self = this;

        this.node.on(type, function (event) {
            // 引擎问题，加多一行判断
            if (!self.node.active) {
                return;
            }
            if (!self._interactable){
                // 按钮不可用
                return;
            }
            let curr = new Date().getTime();
            if ((curr - BaseButton.lastClick <= 300) && self.needInterrupt) {
                // event.stopPropagationImmediate();
                // event.stopPropagation();
                return;
            } else {
                BaseButton.lastClick = curr;
                callback.call(target);
                if (self._soundType == SoundType.Normal) {
                }
            }
            // 停止传递事件，会报错
            // event.stopPropagation();
        });
    }

    off(type: string, callback?: Function, target?: any, useCapture?: boolean){
        // let self = this.self;
        this.node.off(type);
    }

    /**
     * 设置是否需要拦截事件
     * @param needInterrupt
     */
    setNeedInterrupt(needInterrupt: boolean){
        this.needInterrupt = needInterrupt;
    }
}