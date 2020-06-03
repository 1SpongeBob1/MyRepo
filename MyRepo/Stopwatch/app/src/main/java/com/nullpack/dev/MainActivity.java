package com.nullpack.dev;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class MainActivity extends AppCompatActivity {
    private TextView time;
    private Button button;  //开始停止按钮
    private Button button_2;    //暂停继续按钮
    private boolean isStarting = false;
    private boolean isPause = false;
    private Handler handler;    //设置一个处理器
    private Date startTime;
    private Date currentTime;
    private SimpleDateFormat sdf;
    private long diff;
    private Thread newThread;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        time = (TextView)findViewById(R.id.time);
        button = (Button)findViewById(R.id.button1);
        button_2 = (Button)findViewById(R.id.button2);

        time.setText("00:00:00:000");
        sdf = new SimpleDateFormat("HH:mm:ss:SSS"); //格式精确到毫秒
        sdf.setTimeZone(TimeZone.getTimeZone("GMT"));   //将时间格式设为零时区，不然小时一栏会变成08（GMT+8）。

        //消息处理器处理时间的显示
        handler = new Handler(){
            @Override
            public void handleMessage(@NonNull Message msg) {
                super.handleMessage(msg);
                if(msg.what == 1){
                    //加一层判断，不然最后一次接受消息时的计时会覆盖清零的显示效果。
                    if (isStarting){
                        diff = currentTime.getTime() - startTime.getTime();
                        time.setText( sdf.format(diff) );
                    }
                }
            }
        };

        //开始停止的点击时间
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(isStarting == false){
                    startTime = new Date(System.currentTimeMillis());
                    isStarting = true;
                    newThread = new Thread(r);
                    newThread.start();
                    button.setText("Clear!");
                }else{
                    isStarting = false;
                    isPause = false;
                    button_2.setText("Pause!");
                    button.setText("Start!");
                    time.setText("00:00:00:000");   //计时清零
                }
            }
        });

        //暂停继续的点击事件
        button_2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //判断计时是否已经开始
                if (isStarting){
                    //判断是否暂停
                    if (isPause == false){
                        isPause = true;
                        button_2.setText("Continue!");
                    } else {
                        isPause = false;
                        //唤醒线程任务
                        synchronized (r){
                            r.notify();
                        }
                        button_2.setText("Pause!");
                    }
                }
            }
        });
    }

    //设置一个线程任务，当isStarting = true时不断向向Handler发送信息更新计时
    Runnable r = new Runnable() {           //因为线程不能重复启动，所以要将线程任务分离出来
        @Override
        public void run() {
            while(isStarting){
                //如果暂停就让线程wait
                if(isPause == true){
                    synchronized (this){
                        try {
                            this.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                    break;
                }
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
