/**
 * 页面基类
 *
 * @author XuRui
 * @date 2019/2/13 14:39
 */
import {BaseComponent} from "./BaseComponent";
import executeInEditMode = cc._decorator.executeInEditMode;

const {ccclass, property} = cc._decorator;

/**
 * 底部广告控制
 */
export class BottomBannerAdShowCtrl {
    pageId: number = 0;
    shouldShowBannerAD: boolean = false;
    constructor(pageId: number, shouldShowBannerAD: boolean){
        this.pageId = pageId;
        this.shouldShowBannerAD = shouldShowBannerAD;
    }
}

@ccclass
@executeInEditMode
export default class BaseWindow extends BaseComponent {

    /**
     * 底部广告显示控制
     */
    private static bottomBannerAdShowCtrl: BottomBannerAdShowCtrl[] = [];

    /**
     * 页面id
     */
    private pageId: number = -1;

    /**
     * 是否需要展示底部banner广告
     */
    @property({type:cc.Boolean, tooltip: "是否需要展示底部banner广告"})
    protected shouldShowBannerAD: boolean = false;

    /**
     * 是否对返回键反应
     */
    @property({type:cc.Boolean, tooltip: "是否对返回键反应"})
    shouldResponseBackPress: boolean = true;

    /**
     * 是否开启对话框进入动画，默认开启
     */
    @property({type:cc.Boolean, tooltip: "是否开启进入动画"})
    protected shouldEnterAnimate: boolean = true;
    /**
     * 底部广告是否已经显示
     */
    // private static isBottomBannerAdShown = false;

    /**
     * 之前的显示状态
     */
    // private isLastWindowShownBottomAd: boolean = null;

    /**
     * 返回键，如果不为空，会设置销毁节点的点击事件
     */
    @property({type: cc.Node})
    protected backBtn: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    protected _enterAnimationBgNode: cc.Node;

    onLoad() {
        if (this.shouldEnterAnimate) {
            if( !CC_EDITOR ) {
                this.showEnterAnimation();
            }
        }

        // this.tryShowBottomAd();
        this.setBackBtnClickListener();
        super.onLoad();
        // 广告显示控制
        if (this.shouldShowBannerAD) {
            if (!this.lastDialogIsShowAd()){
                // 如果上个界面没有展示广告则需要显示
                this.showBottomBannerAd();
            }
        }else {
            this.hideBottomBannerAd();

        }
        this.pushBottomAdPage();
    }

    /**
     * dialog弹出动画
     */
    protected showEnterAnimation(){

        if (this.node.children.length > 0
            && this.node.children[0].width < cc.winSize.width
            && (this.node.children[0].height < cc.winSize.height)
            && this.node.children[0].anchorX == 0.5 && this.node.children[0].anchorY == 0.5) {
            // 只有非全屏对话框，才播放动画
            this._enterAnimationBgNode = this.node.children[0];
            this._enterAnimationBgNode.setScale(0.01);
            this._enterAnimationBgNode.runAction(cc.scaleTo(0.2, 1).easing(cc.easeBackOut()))
        }
    }

    protected showBottomBannerAd(){
    }

    protected hideBottomBannerAd(){
    }

    onDestroy() {
        super.onDestroy();
        // 广告显示控制
        this.popBottomAdPage();
    }

    /**
     * 抽离出来可以让子类重写
     */
    protected setBackBtnClickListener(){
        if (this.backBtn) {
        }
    }

    /**
     * 增加一个底部广告页面
     */
    private pushBottomAdPage(){
        this.pageId = Date.now();
        BaseWindow.bottomBannerAdShowCtrl.push(new BottomBannerAdShowCtrl(this.pageId, this.shouldShowBannerAD));
    }

    /**
     * 移除一个底部广告页面
     */
    private popBottomAdPage(){
        if (BaseWindow.bottomBannerAdShowCtrl.length > 0){
            // 找出当前页面下标
            let curPagePos: number = -1;
            for (let i = 0; i < BaseWindow.bottomBannerAdShowCtrl.length; i++){
                if (BaseWindow.bottomBannerAdShowCtrl[i].pageId == this.pageId){
                    curPagePos = i;
                    break;
                }
            }
            // 移除当前页面
            if (curPagePos > -1){
                BaseWindow.bottomBannerAdShowCtrl.splice(curPagePos, 1);
            }
        }
    }

    onBackBtnClick() {
        this.finishNode();
    }

    finishNode() {
        // dialog 淡出动画
        // if( this._enterAnimationBgNode != null ) {
        //     this._enterAnimationBgNode.runAction(cc.scaleTo(0.2, 0).easing(cc.easeBackIn()));
        //     this._enterAnimationBgNode = null;
        // }
        super.finishNode();
    }

    /**
     * 获取最后一个dialog是否显示横幅广告
     */
    private lastDialogIsShowAd(): boolean{
        if (BaseWindow.bottomBannerAdShowCtrl.length > 0){
            return BaseWindow.bottomBannerAdShowCtrl[BaseWindow.bottomBannerAdShowCtrl.length - 1].shouldShowBannerAD;
        }
        return false;
    }
}

