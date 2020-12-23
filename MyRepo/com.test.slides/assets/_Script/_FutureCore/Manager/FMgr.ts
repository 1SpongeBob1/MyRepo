import FAudioMgr from "./FAudioMgr";
import FScreenMgr from "./FScreenMgr";

export namespace FMgr {
    export let Audio: FAudioMgr = null;
    export let Screen: FScreenMgr = null;

	export function Init(root: cc.Node) {
        cc.log("[FMgr]Init")
        Audio = root.addComponent(FAudioMgr);
        Screen = root.addComponent(FScreenMgr);
	}
};