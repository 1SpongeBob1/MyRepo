import ccclass = cc._decorator.ccclass;
import BaseComModel from "./BaseComModel";


@ccclass
export class BaseComponent extends cc.Component {


    onLoad() {
        this.setInterrupt();
    }

    onDestroy() {
        //注销全部事件
        this.unRegisterAllEvent();
        //注销全部模块
        this.unRegisterAllModel();
    }

    start() {

    }

    //-------------------------------------------------------------------
    // 事件监听
    //-------------------------------------------------------------------

    /**
     * 监听的事件名
     */
    private msgRegisters = [];

    /**
     * 注销全部事件
     */
    private unRegisterAllEvent() {
        this.msgRegisters.forEach((msgName: string) => {
            this.unRegisterMessage(msgName)
        });
        this.msgRegisters = []
    }

    /**
     * 注册一个事件
     * @param msgName 事件名
     * on_[msgName] 回调方法
     */
    registerMessage(msgName: string) {
        cc.director.on(msgName, this["on_" + msgName], this);
        this.msgRegisters.push(msgName)
    }

    /**
     * 注销一个事件
     * @param msgName
     */
    unRegisterMessage(msgName: string) {
        cc.director.off(msgName, this["on_" + msgName], this)
    }

    //-------------------------------------------------------------------
    // 事件拦截
    //-------------------------------------------------------------------

    /**
     * 是否需要拦截事件传递
     */
    protected shouldInterruptTouch() {
        return true;
    }

    /**
     * 终止所有 Touch 事件传递到给父节点
     */
    setInterrupt() {
        if (this.shouldInterruptTouch()) {
            this.node.on(cc.Node.EventType.TOUCH_START, this.interruptFunc, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.interruptFunc, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.interruptFunc, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.interruptFunc, this);
        } else {
            this.node.off(cc.Node.EventType.TOUCH_START, this.interruptFunc, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.interruptFunc, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.interruptFunc, this);
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.interruptFunc, this);
        }
    }

    private interruptFunc() {
    }

    //-------------------------------------------------------------------
    // 节点控制
    //-------------------------------------------------------------------

    /**
     * 销毁节点，需要 delay 下，不然下一帧数据全没了
     */
    finishNode() {
        // 淡出动画
        if (this.node) {
            this.node.runAction(
                cc.sequence(
                    cc.fadeOut(0.3).easing(cc.easeOut(3.0)),
                    cc.callFunc(() => {
                        if (this.node && cc.isValid(this.node)){
                            this.node.destroy();
                        }
                    })));
        }
    }

    //-------------------------------------------------------------------
    // 模块管理
    //-------------------------------------------------------------------

    private modelList = Array<BaseComModel<any>>();

    /**
     * 注册模块
     * @param type 模块
     * @param context 回调
     */
    registerModel<T extends BaseComModel<any>>(context: any, type: { new(): T }): T {
        //实例化
        let object = new type();
        //回调
        object.callback = context;
        //初始化
        object.onLoad(this);
        //存到数组中
        this.modelList.push(object);
        return object;
    }

    /**
     * 注销全部模块
     */
    private unRegisterAllModel() {
        for (let model of this.modelList) {
            model.onDestroy();
        }
        this.modelList = []
    }

}
