/**
 * 音效池
 *
 * @author XuRui
 * @date 2019/1/24 16:11
 */
import AudioSource = cc.AudioSource;
// import {LocalPreferenceTool} from "./LocalPreferenceTool";
import AudioClip = cc.AudioClip;
import {FMgr} from "../../../_Script/_FutureCore/Manager/FMgr";
import {AudioType} from "../../Script/base/AudioType";

export default class AudioTool {

    /**
     * 音效资源后缀
     */
    private static readonly SUFFIX_RES_AUDIO = ".mp3";

    /**
     * 背景音效资源名
     */
    public static KEY_BG_MUSIC = "bg_music";

    /**
     * 按钮点击音效资源名
     */
    public static KEY_BUTTON_CLICK = "btn_click";

    //----------------------------------------------------------------------------------------------------------------------

    /**
     * 音效池
     */
    private static _audios = {};

    /**
     * 上次音效状态
     */
    private static lastMusicsStatus = {};

    /**
     * 预加载所有音效
     */
    static preloadAllAudio() {
        // let audioEnum = CustomTool.AUDIO_ENUM;
        // if (audioEnum) {
        //     for (let key in audioEnum) {
        //         let audioType = audioEnum[key];
        //         let resStr = this.concatResStr(audioType);
        //         this.doLoadAudioInterval(audioType, resStr)
        //     }
        // }
        // //背景音
        // let bgAudioResStr = this.concatResStr(this.KEY_BG_MUSIC);
        // this.doLoadAudioInterval(this.KEY_BG_MUSIC, bgAudioResStr);
        // //按键音
        // let btnClickAudioResStr = this.concatResStr(this.KEY_BUTTON_CLICK);
        // this.doLoadAudioInterval(this.KEY_BUTTON_CLICK, btnClickAudioResStr);
    }

    /**
     * 音效控制
     */
    static control(audioType: string, isOn: boolean, isLoop: boolean = false) {

    }

    /**
     * 音效播放
     */
    static play(audioType: string, isLoop: boolean = false) {
        FMgr.Audio.PlayEffect(audioType);
    }

    static isPlaying(audioType:string){
       return true;
    }

    static get isSoundEffectSettingOn() {
        return true;
    }

    static set isSoundEffectSettingOn(isOn: boolean) {

    }

    public static pause(){

    }

    public static resume(){

    }

    //----------------------------------------------------------------------------------------------------------------------

}
