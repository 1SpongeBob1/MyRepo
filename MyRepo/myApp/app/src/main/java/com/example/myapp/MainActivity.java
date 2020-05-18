package com.example.myapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
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

public class MainActivity extends AppCompatActivity {


    private Button button;
    private RewardedAd rewardedAd;
    private Button button2;
    private Button button3;
    private Button button4;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        button2 = (Button)findViewById(R.id.bt2);
        button2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, BannerAdActivity.class);
                startActivity(intent);
            }
        });
        button3 = (Button)findViewById(R.id.bt3);
        button3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, InterstitialAdActivity.class);
                startActivity(intent);
            }
        });
        button4 = (Button)findViewById(R.id.bt4);

        //初始化Mobile Ads SDK
        MobileAds.initialize(this, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(InitializationStatus initializationStatus) {

            }
        });
        //创建广告对象
        rewardedAd = new RewardedAd(this, "ca-app-pub-3940256099942544/5224354917");
        loadRewardedAd();
        button = (Button) findViewById(R.id.bt);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showRewardedVideo();
            }
        });
    }

    //加载广告
    private void loadRewardedAd(){
        if (rewardedAd == null || !rewardedAd.isLoaded()) {
            rewardedAd.loadAd(new AdRequest.Builder().build(), new RewardedAdLoadCallback(){
                @Override
                public void onRewardedAdLoaded() {
                    super.onRewardedAdLoaded();;
                    Toast.makeText(getApplicationContext(), "loading success", Toast.LENGTH_SHORT).show();
                }
                @Override
                public void onRewardedAdFailedToLoad(int i) {
                    Toast.makeText(MainActivity.this, "failed to load", Toast.LENGTH_SHORT).show();
                    super.onRewardedAdFailedToLoad(i);
                }
            });


        }
    }

    //展示广告
    private void showRewardedVideo() {
        if (rewardedAd.isLoaded()) {
            RewardedAdCallback adCallback =
                    new RewardedAdCallback() {
                        @Override
                        public void onRewardedAdOpened() {
                            // 打开广告.
                            Toast.makeText(MainActivity.this, "RewardedAdOpened", Toast.LENGTH_SHORT).show();
                        }

                        @Override
                        public void onRewardedAdClosed() {
                            //关闭广告.
                            Toast.makeText(MainActivity.this, "RewardedAdClosed", Toast.LENGTH_SHORT).show();
                        }

                        @Override
                        public void onUserEarnedReward(RewardItem rewardItem) {
                            Toast.makeText(MainActivity.this, "EarnedReward", Toast.LENGTH_SHORT).show();
                        }

                        @Override
                        public void onRewardedAdFailedToShow(int errorCode) {
                            //广告展示失败
                            Toast.makeText(MainActivity.this, "RewardedAdFailedToShow", Toast.LENGTH_SHORT).show();
                        }
                    };
            rewardedAd.show(this, adCallback);
        }
    }

}
