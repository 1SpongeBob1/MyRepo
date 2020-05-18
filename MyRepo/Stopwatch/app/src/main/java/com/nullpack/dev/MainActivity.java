package com.nullpack.dev;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import org.w3c.dom.Text;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class MainActivity extends AppCompatActivity {
    private TextView time;
    private Button button;
    private boolean isStarting = false;
    private Handler handler;    //设置一个处理器
    private Date startTime;
    private Date currentTime;
    private SimpleDateFormat sdf;
    private long diff;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        time = (TextView)findViewById(R.id.time);
        button = (Button)findViewById(R.id.button);
        //ImageView imageView = (ImageView)findViewById(R.id.iv);
        //imageView.setAlpha((float) 0.1);    //设置图片透明度
        time.setText("\n" + "00:00:00:000");
        sdf = new SimpleDateFormat("HH:mm:ss:SSS"); //格式精确到毫秒
        sdf.setTimeZone(TimeZone.getTimeZone("GMT"));   //将时间格式设为零时区，不然小时一栏会变成08（GMT+8）。

        handler = new Handler(){
            @Override
            public void handleMessage(@NonNull Message msg) {
                super.handleMessage(msg);
                if(msg.what == 1){
                    diff = currentTime.getTime() - startTime.getTime();
                    time.setText( "\n" + sdf.format(diff) );
                }
            }
        };

        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(isStarting == false){
                    startTime = new Date(System.currentTimeMillis());
                    isStarting = true;
                    new Thread(r).start();
                    button.setText("Click to Stop!");
                }else{
                    isStarting = false;
                    button.setText("Click to Start!");
                }
            }
        });
    }

    //设置一个线程任务，当isStarting = true时不断向向Handler发送信息更新计时
    Runnable r = new Runnable() {           //因为线程不能重复启动，所以要将线程任务分离出来
        @Override
        public void run() {
            while(isStarting){
                currentTime = new Date(System.currentTimeMillis());
                handler.sendEmptyMessage(1);
                try {
                    Thread.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    };
}
