const { ccclass } = cc._decorator;

@ccclass
export default class FAudioMgr extends cc.Component {
	bgm_audioId: number = null;
	soundCacheList: cc.AudioClip[] = [];
	switchSetting = {
		eff: 1,
		bgm: 1,
		shake: 1,
	}

	onLoad() {
		cc.log("[FAudioMgr]Init");
	}

	// 播放音效
	PlayEffect(name, volume = 1) {
		if (this.switchSetting.eff) {
			if (this.soundCacheList[name]) {
				cc.audioEngine.play(this.soundCacheList[name], false, volume);
			}
			else {
				cc.loader.loadRes(`music/${name}`, (err, path) => {
					if (!err) {
						this.soundCacheList[name] = path;
						cc.audioEngine.play(path, false, volume);
					}
				});
			}
		}
	}

	// 播放背景音乐
	PlayBgm(name, volume = 0.5) {
		if (this.switchSetting.bgm) {
			if (this.soundCacheList[name]) {
				if (this.bgm_audioId != null)
					cc.audioEngine.stop(this.bgm_audioId);
					this.bgm_audioId = cc.audioEngine.play(this.soundCacheList[name], true, volume);
			}
			else {
				cc.loader.loadRes(`music/${name}`, (err, path) => {
					if (!err) {
						if (this.bgm_audioId != null)
							cc.audioEngine.stop(this.bgm_audioId);
						this.soundCacheList[name] = path;
						this.bgm_audioId = cc.audioEngine.play(path, true, volume);
					}
				});
			}
		}
		else {
			if (this.bgm_audioId != null)
				cc.audioEngine.stop(this.bgm_audioId);
		}
	}

	// 选择静音
	CloseMusic() {
		this.StopAll();
	}

	// 取消静音
	OpenMusic(bgm: string, volume: number = 1) {
		this.PlayBgm(bgm, volume);
	}

	// 停止所有音乐
	StopAll() {
		cc.audioEngine.stopAll();
	}

	// 暂停音乐
	PauseMusic() {
		if (this.bgm_audioId != null) {
			cc.audioEngine.pause(this.bgm_audioId);
		}
	}

	// 继续播放
	ResumeMusic() {
		if (this.bgm_audioId != null) {
			cc.audioEngine.resume(this.bgm_audioId);
		}
		else {
			this.PlayBgm('bgm_MainScene');
		}
	}
}