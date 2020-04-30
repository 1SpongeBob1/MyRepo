package com.my.weather.app;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationListener;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;


public class MainActivity extends AppCompatActivity {
    private TextView weather;
    private TextView max;
    private TextView min;
    private TextView address;
    private EditText et;
    private Button button;
    private String addr;
    private Handler handler;    //消息处理器，收到请求后修改布局
    private JSONObject weatherInfo;
    private JSONObject tmp;     //存储获取的温度信息 "tmp":{"max":"value_1", "min":"value_2"}
    private JSONObject cond;    //存储获取的天气信息 "cond":{"code_d":"104","code_n":"300","txt_d":"阴","txt_n":"阵雨"}
    private JSONObject jo;
    private Double longitude;
    private Double latitude;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        weather = (TextView) findViewById(R.id.weather);
        max = (TextView) findViewById(R.id.max);
        min = (TextView) findViewById(R.id.min);
        address = (TextView) findViewById(R.id.address);
        et = (EditText)findViewById(R.id.editText);
        button = (Button)findViewById(R.id.button);

        /*Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                GetWeatherInfo gwi = new GetWeatherInfo(getApplicationContext());
                //gwi.getCityInfo();
                button.setText(gwi.getCityInfo());
            }
        });
        t2.start();*/




        getAddress_();
        t.start();

        handler = new Handler() {
            @Override
            public void handleMessage(Message msg) {
                super.handleMessage(msg);
                //判断返回参数是否正常
                if (msg.what == 10000) {
                    if (weatherInfo.getString("msg").equals("查询失败")) {
                        max.setText("查询失败");
                    } else {
                        weather.setText("今日天气情况：" + cond.getString("txt_d"));
                        max.setText("最高温：" + tmp.getString("max"));
                        min.setText("最低温：" + tmp.getString("min"));



                    }
                } else {
                    max.setText("查询出错" + weatherInfo);
                }
            }
        };
    }

    //向天气api发送请求
    public String sendRequest() {
        try {
            String strURL = "https://way.jd.com/he/freeweather?city=" + parseAddr(getAddress()) + "&appkey=d1f0e670fecaadeef96e3cdcfaeb9fb6";
            URL url = new URL(strURL);
            //创建http连接并开启连接
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoInput(true); //设置允许输入输出
            connection.setDoOutput(true);
            BufferedReader bf = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = bf.readLine()) != null) {
                sb.append(line);
            }
            bf.close();
            String responseInfo = sb.toString();    //收集响应信息并返回
            return responseInfo;
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "false";
    }

    //向api发送请求获取地理信息并返回信息。
    public String getAddress() {
        try {
            String strUrl = "https://api.go2map.com/engine/api/regeocoder/json?points=" + longitude + "," + latitude + "&type=1";
            URL url = new URL(strUrl);
            //创建http连接并开启连接
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setDoInput(true); //设置允许输入输出
            connection.setDoOutput(true);
            URLDecoder.decode(connection.getInputStream().toString(), "UTF-8");
            BufferedReader bf = new BufferedReader(new InputStreamReader(connection.getInputStream(), "GBK"));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = bf.readLine()) != null) {
                sb.append(line);
            }
            bf.close();
            String addrInfo = sb.toString();    //收集响应信息并返回
            return addrInfo;
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "false";
    }

    //解析获取本地城市信息
    public String parseAddr(String addrInfo) {
        jo = JSON.parseObject(addrInfo);
        JSONObject response = JSON.parseObject(jo.getString("response"));
        JSONArray data = response.getJSONArray("data");
        JSONObject jo_2 = JSON.parseObject(data.get(0).toString());
        String city = jo_2.getString("city");
        addr = city;
        return city;
    }


    //解析天气的json信息
    public String JSONParser(String addrInfo) {
        //FastJson将json对象转为java对象
        weatherInfo = JSON.parseObject(addrInfo);
        JSONObject result = JSON.parseObject(weatherInfo.getString("result"));
        JSONArray weathers = result.getJSONArray("HeWeather5");
        JSONArray daily_forecast = JSON.parseObject(weathers.get(0).toString()).getJSONArray("daily_forecast");
        for (Object object : daily_forecast) {
            JSONObject json = (JSONObject) object;
            if (json.getString("date") != null && json.getString("date").equals(getDate())) {
                tmp = json.getJSONObject("tmp");
                cond = json.getJSONObject("cond");
            }
        }
        //向消息处理器发送消息
        int i = Integer.parseInt(weatherInfo.getString("code"));
        handler.sendEmptyMessage(i);
        return "true";
    }

    //获取当前日期
    public String getDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(new Date());
    }

    //开启一个线程来发送请求信息
    Thread t = new Thread(new Runnable() {
        @Override
        public void run() {

            while(longitude == null || latitude == null){
                try {
                    Thread.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            JSONParser(sendRequest());


        }
    });

    //高德地图获取地址信息
    public void getAddress_(){
        //声明AMapLocationClient类对象
        AMapLocationClient mLocationClient = null;
        //初始化定位
        mLocationClient = new AMapLocationClient(getApplicationContext());
        //设置定位回调监听
        AMapLocationListener mLocationListener = new AMapLocationListener() {
            @Override
            public void onLocationChanged(AMapLocation aMapLocation) {
                if (aMapLocation != null) {
                    if (aMapLocation.getErrorCode() == 0) {
                        longitude = aMapLocation.getLongitude();
                        latitude = aMapLocation.getLatitude();
                        address.setText("目前所在地：" + aMapLocation.getAddress());
                    }
                }else{
                    Toast.makeText(MainActivity.this, "something went wrong", Toast.LENGTH_SHORT).show();
                }
            }
        };
        mLocationClient.setLocationListener(mLocationListener);
        //启动定位
        mLocationClient.startLocation();
    }
}
