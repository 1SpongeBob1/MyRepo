package com.example.myapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import com.google.android.gms.ads.rewarded.RewardItem;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdCallback;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

public class ShowAdActivity extends AppCompatActivity {

    private RewardedAd rewardedAd;
    private TextView showAd;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_show_ad);

        showAd = (TextView)findViewById(R.id.showAd);

        showAd.setText("showAd");

        //初始化Mobile Ads SDK
        MobileAds.initialize(this, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(InitializationStatus initializationStatus) {

            }
        });
        //创建广告对象
        rewardedAd = new RewardedAd(this, "ca-app-pub-3940256099942544~3347511713");

        //加载广告
        RewardedAdLoadCallback adLoadCallback = new RewardedAdLoadCallback(){
            @Override
            public void onRewardedAdLoaded() {
                super.onRewardedAdLoaded();;
                Toast.makeText(getApplicationContext(), "loading success", Toast.LENGTH_LONG).show();
                //显示广告
                if(rewardedAd.isLoaded()){
                    Activity AcContext = new Activity();
                    RewardedAdCallback adCallback = new RewardedAdCallback() {
                        public void onRewardedAdOpened() {
                            Toast.makeText(getApplicationContext(), "ad opening!", Toast.LENGTH_LONG).show();
                            // Ad opened.
                        }

                        public void onRewardedAdClosed() {
                            Toast.makeText(getApplicationContext(), "ad closing!", Toast.LENGTH_LONG).show();
                            // Ad closed.
                        }

                        @Override
                        public void onUserEarnedReward(@NonNull RewardItem rewardItem) {
                            Toast.makeText(getApplicationContext(), "you get reward!", Toast.LENGTH_LONG).show();
                        }

                        public void onRewardedAdFailedToShow(int errorCode) {
                            // Ad failed to display
                            Toast.makeText(getApplicationContext(), "fail to load", Toast.LENGTH_LONG).show();
                        }
                    };
                    rewardedAd.show(AcContext, adCallback);
                    showAd.setText("finish");
                }else{
                    Log.i("fail", "fail");
                    showAd.setText("something went wrong");
                }
            }
            @Override
            public void onRewardedAdFailedToLoad(int i) {
                super.onRewardedAdFailedToLoad(i);
                Toast.makeText(getApplicationContext(), "failed to load", Toast.LENGTH_LONG).show();
            }
        };
        rewardedAd.loadAd(new AdRequest.Builder().build(), adLoadCallback);





    }
}
