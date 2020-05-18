package com.my.weather.app;

import android.content.Context;
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

/**
 * 获取地址并根据地址获取天气信息并解析
 */
public class GetWeatherInfo {
    private String city;
    private Context context;
    Double[] db;

    public GetWeatherInfo(Context context){
        this.context = context;
    }
    public GetWeatherInfo(String cityInfo){
        city = cityInfo;
    }

    public String getCityInfo(){
        //判断是否传入city名
        if ( city != null ){
            return city;
        }else{
            getAddress_();
            city = parseAddr(getAddress());
            return city;
        }
    }

    //高德地图获取地址信息
    public Double[] getAddress_(){
        //声明AMapLocationClient类对象
        AMapLocationClient mLocationClient = null;
        //初始化定位
        mLocationClient = new AMapLocationClient(context.getApplicationContext());
        //设置定位回调监听
        AMapLocationListener mAMapLocationListener = new AMapLocationListener() {
            @Override
            public void onLocationChanged(AMapLocation aMapLocation) {
                if (aMapLocation != null) {
                    if (aMapLocation.getErrorCode() == 0) {
                        Double longitude = aMapLocation.getLongitude();
                        Double latitude = aMapLocation.getLatitude();
                        db = new Double[2];
                        db[0] = longitude;
                        db[1] = latitude;
                        /*longitude = aMapLocation.getLongitude();
                        latitude = aMapLocation.getLatitude();*/
                    }
                }
            }
        };

        mLocationClient.setLocationListener(mAMapLocationListener);
        //启动定位
        mLocationClient.startLocation();
        return db;
    }

    //向api发送请求获取地理信息并返回信息。
    public String getAddress() {
        try {
            String strUrl = "https://api.go2map.com/engine/api/regeocoder/json?points=" + db[0] + "," + db[1] + "&type=1";
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
        JSONObject jo = JSON.parseObject(addrInfo);
        JSONObject response = JSON.parseObject(jo.getString("response"));
        JSONArray data = response.getJSONArray("data");
        JSONObject jo_2 = JSON.parseObject(data.get(0).toString());
        String cityInfo = jo_2.getString("city");
        return cityInfo;
    }
}
