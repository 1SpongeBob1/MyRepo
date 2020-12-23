enum ChannelType{
    Unity3d = 1,
    AppLovin = 2,
    MTG = 3,
}

enum PlatformType{
    Android = 1,
    iOS = 2,
}

import { FMgr } from "../Manager/FMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FChannel extends cc.Component {
    public static Me: FChannel = null;

    @property({
        type: cc.Enum(ChannelType),
        displayName: "D_广告渠道类型",
        tooltip: "（可变项）D_广告渠道类型",
    })
    channelType: ChannelType = ChannelType.Unity3d;
    @property({
        type: cc.Enum(PlatformType),
        displayName: "D_硬件平台",
        tooltip: "（可变项）D_硬件平台",
    })
    platform: PlatformType = PlatformType.Android;

    @property({
        displayName: "AndroidUrl",
        tooltip: "AndroidUrl",
    })
    androidAppUrl: string = "https://play.google.com/store/apps/details?id=com.free.tap.money.tree";
    @property({
        displayName: "iOSUrl",
        tooltip: "iOSUrl",
    })
    iOSAppUrl: string = "https://apps.apple.com/us/app/id1536363612";

    @property({
        displayName: "是否支持重新开始",
        tooltip: "是否支持重新开始",
    })
    isGameRetry: boolean = false;
    @property({
        type: cc.Node,
        displayName: "广告图标节点",
        tooltip: "广告图标节点",
    })
    adsOnlyRoot: cc.Node = null;

    onLoad() {
        FChannel.Me = this;

        if (this.adsOnlyRoot != null) {
            if (this.channelType == ChannelType.AppLovin) {
                this.adsOnlyRoot.active = true;
            }
            else {
                this.adsOnlyRoot.active = false;
            }
        }

        this.onGameReady();
    }

    onGameReady() {
        try {
            if (this.channelType == ChannelType.MTG) {
                window.gameReady && window.gameReady();
            }
        } catch (error) { }
    }

    onGameRetry() {
        try {
            if (this.channelType == ChannelType.MTG) {
                if (this.isGameRetry) {
                    //window.gameRetry && window.gameRetry();
                }
            }
        } catch (error) { }
    }

    onInstall() {
        cc.log("[FChannel]onInstall");
		FMgr.Audio.PlayEffect('frame_install');

		try {
            if (this.channelType == ChannelType.MTG) {
                window.install && window.install();
            }

            let url = null;
            if (this.platform == PlatformType.Android) {
                url = this.androidAppUrl;
            }
            else if (this.platform == PlatformType.iOS) {
                url = this.iOSAppUrl;
            }
            mraid.open(url);
		} catch (error) { }
    }

    onGameEnd() {
        try {
            if (this.channelType == ChannelType.MTG) {
                window.gameEnd && window.gameEnd();
            }
        } catch (error) { }
    }
}