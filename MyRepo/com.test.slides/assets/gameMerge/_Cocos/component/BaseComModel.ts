/**
 * 模块基类
 *
 * @author XuRui
 * @date 2019/2/28 16:32
 */
import {BaseComponent} from "./BaseComponent";

export default class BaseComModel<C> {

    /**
     * 组件
     */
    component: BaseComponent = null;

    /**
     * 回调
     */
    callback: C = null;

    onLoad(component: BaseComponent) {
        this.component = component;
    }

    onDestroy() {
        if( this.component != null ) {
            this.component.unscheduleAllCallbacks();
            this.component = null;
        }
        this.callback = null;
        this.unRegisterAll();
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
    private unRegisterAll() {
        this.msgRegisters.forEach((msgName: string) => {
            this.unRegister(msgName)
        });
        this.msgRegisters = []
    }

    /**
     * 注册一个事件
     * @param msgName 事件名
     * on_[msgName] 回调方法
     */
    register(msgName: string) {
        cc.director.on(msgName, this["on_" + msgName], this);
        this.msgRegisters.push(msgName)
    }

    /**
     * 注销一个事件
     * @param msgName
     */
    unRegister(msgName: string) {
        cc.director.off(msgName, this["on_" + msgName], this)
    }

}
