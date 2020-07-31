package com.my.weather.app;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import com.my.weather.app.databinding.ActivityMainBinding;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.IOException;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;


public class MainActivity extends AppCompatActivity {
    private ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        binding.button.setOnClickListener(v -> {
            getInfo();
        });

    }

    //展示天气信息
    private void showWeather(String weatherInfo){
        runOnUiThread(()->{
            binding.weatherContent.setText(weatherInfo);
        });
    }

    //发送Http请求获取天气信息
    private String getInfo(){
        new Thread(()->{
            //创建OkHttpClient实例
            OkHttpClient client = new OkHttpClient();

            //创建request对象并传入参数
            Request request = new Request.Builder()
                                    .url(getUrl())
                                    .build();

            //调用OkHttpClient的newCall()方法创建一个Call对象，并调用它的execute方法发送请求，接受response对象数据。
            try {
                Response response = client.newCall(request).execute();
                //处理response数据
                showWeather(parseJson(response));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }).start();
        return null;
    }

    private String getUrl(){
        String city = null;
        //
        return "https://way.jd.com/he/freeweather?city=" + city + "&appkey=d1f0e670fecaadeef96e3cdcfaeb9fb6";
    }

    private String parseJson(Response response)throws IOException {
        String responseData = null;
            responseData = response.body().string();
        try {
            JSONArray jsonArray = new JSONArray(responseData);
        } catch (JSONException e) {
            e.printStackTrace();
        }


        return "";
    }
}
