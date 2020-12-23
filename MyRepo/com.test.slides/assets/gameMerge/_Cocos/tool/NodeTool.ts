/**
 *
 *
 * @author XuRui
 * @date 2019/1/25 12:47
 */
import {Tools} from "./Tools";
import SpriteFrame = cc.SpriteFrame;
import {BaseButton} from "../component/BaseButton";

export default class NodeTool {

    /**
     * 点击事件
     */
    static setOnClickListener(nodeOrComponent: cc.Node | cc.Component, callback: any, target?: any) {

        let node;

        if (nodeOrComponent instanceof cc.Node) {
            node = nodeOrComponent;
        }

        //获取BaseButton脚本
        let btn: BaseButton = node.getComponent(BaseButton);


            if (callback) {
                node.on(cc.Node.EventType.TOUCH_END, callback, target);
            } else {
                btn.unRegisterMessage(cc.Node.EventType.TOUCH_END);
            }

    }

    /**
     * touchEnd事件
     */
    static setOnTouchEndClickListener(btnNode: cc.Node | cc.Component, callback: any, target: any = null){
        let node;
        if (btnNode instanceof cc.Node) {
            node = btnNode;
        } else if (btnNode instanceof cc.Component) {
            node = btnNode.node;
        }

        let btn: BaseButton = node.getComponent(BaseButton);
        if (btn){
            btn.on(cc.Node.EventType.TOUCH_END, callback, target);
        } else {
            node.on(cc.Node.EventType.TOUCH_END, callback, target);
        }
    }

    //----------------------------------------------------------------------------------------------------------------------

    /**
     * 获取target节点相对于relative的位置
     *
     * @param relative 相对节点
     * @param target 节点
     */
    static getPositionAt(relative: cc.Node, target: cc.Node) {
        let posWorld = NodeTool.getPositionAtWorld(target);
        return relative.convertToNodeSpaceAR(posWorld);
    }

    /**
     * 获取target节点在世界坐标系
     *
     * @param target 节点
     */
    static getPositionAtWorld(target: cc.Node) {
        return target.parent.convertToWorldSpaceAR(target.position);
    }

    //----------------------------------------------------------------------------------------------------------------------

    /**
     * 加载图片
     */
    static loadLocalDrawable(targetSprite: cc.Sprite, url: string, callback?: Function) {
        if (targetSprite && targetSprite.isValid) {
            cc.loader.loadRes(url,  cc.SpriteFrame,function (err, sp) {
                if (err || sp == null) {
                    return;
                }
                if (targetSprite.isValid) {
                    targetSprite.spriteFrame = sp;
                }
                if (callback) {
                    callback(sp);
                }
            });
        }
    }

    public static loadNetworkImg(url: string, targetSprite: cc.Sprite, callback?: (sp: SpriteFrame) => void) {
        let httpOrhttpsRegex = "^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$";
        if (!Tools.checkNonNull(url) || url.match(httpOrhttpsRegex) == null) {
            return;
        }
        try{
            cc.loader.load({url: url}, function (err, sp) {
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
        }catch (e) {

        }
    }

    //---------------------------------------------------------------------------------------------------------------------
}
