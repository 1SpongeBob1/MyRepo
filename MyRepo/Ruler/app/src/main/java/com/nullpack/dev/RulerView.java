package com.nullpack.dev;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

import androidx.annotation.Nullable;

import java.math.BigDecimal;

public class RulerView extends View {

    private Context context;
    private int max = 101;
    private int min = 0;
    private Paint mLinePaint;
    private Paint mTextPaint;
    private Paint mRulerPaint;
    private float progress = 10;
    private boolean isCanMove;

    public RulerView(Context context) {
        super(context);
        this.context = context;
        init();
    }

    public RulerView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public RulerView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        mLinePaint = new Paint();
        mLinePaint.setColor(Color.BLUE);
        mLinePaint.setAntiAlias(true);//抗锯齿
        mLinePaint.setStyle(Paint.Style.STROKE);
        mLinePaint.setStrokeWidth(4);

        mTextPaint = new Paint();
        mTextPaint.setColor(Color.BLACK);
        mTextPaint.setAntiAlias(true);
        mTextPaint.setStyle(Paint.Style.FILL);
        mTextPaint.setStrokeWidth(2);
        mTextPaint.setTextSize(48);

        mRulerPaint = new Paint();
        mRulerPaint.setAntiAlias(true);
        mRulerPaint.setStyle(Paint.Style.FILL_AND_STROKE);
        mRulerPaint.setColor(Color.RED);
        mRulerPaint.setStrokeWidth(4);

    }

    //测量view尺寸
    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        setMeasuredDimension(1600, setMeasureHeight(heightMeasureSpec));
    }

    //获取view的高度限制
    private int setMeasureHeight(int spec) {
        int mode = MeasureSpec.getMode(spec);
        int size = MeasureSpec.getSize(spec);
        int result = Integer.MAX_VALUE;
        switch (mode){
            case  MeasureSpec.AT_MOST:
                size = Math.min(result, size);
                break;
            case  MeasureSpec.EXACTLY:
                break;
            default:
                size = result;
                break;
        }
        return size;
    }

//    //获取view的宽度限制
//    private int setMeasureWidth(int spec) {
//        int mode = MeasureSpec.getMode(spec);
//        int size = MeasureSpec.getSize(spec);
//        int result = Integer.MAX_VALUE;
//        switch (mode){
//            case  MeasureSpec.AT_MOST:
//                size = Math.min(result, size);
//                break;
//            case  MeasureSpec.EXACTLY:
//                break;
//            default:
//                size = result;
//                break;
//        }
//        return size;
//    }

    protected void onDraw(Canvas canvas){
        super.onDraw(canvas);
        canvas.save();
        for(int i = min; i < max; i++){
            if ( i % 10 == 0 ){
                //起点x坐标10像素， 画厘米线
                canvas.drawLine(10, 0, 10, 72, mLinePaint);
                //计算刻度数
                String text = i / 10 + "";
                Rect rect = new Rect();//Rect类主要用于表示坐标系中的一块矩形区域，并且二可以对其做一些简单的操作。
                //获取文本宽度
                float txtWidth = mTextPaint.measureText(text);
                mTextPaint.getTextBounds(text, 0, text.length(), rect);
                //画字
                canvas.drawText(text, 10 - txtWidth / 2, 72 + rect.height() + 10, mTextPaint);
            }else if ( i % 5 == 0 ){
                //每隔0.5cm画间隔线
                canvas.drawLine(10, 0, 10, 64, mLinePaint);
            } else {
                //画毫米线
                canvas.drawLine(10, 0, 10, 48, mLinePaint);
            }
            //每隔15像素移动一次，达到画线效果。
            canvas.translate(15, 0);
        }
        canvas.restore();
        //画线
        canvas.drawLine(progress, 0, progress, 400, mRulerPaint);//progress是刻度的位置，这里替换了startX、startY。
        //画圆
        canvas.drawCircle(progress, 420, 20, mRulerPaint);
        BigDecimal bd = new BigDecimal((progress - 15) / 150);//BigDecimal用于高精度计算，float和double计算时会出现精度丢失。
        //计算刻度数，保留一位小数，单位cm
        bd = bd.setScale(1, BigDecimal.ROUND_HALF_UP);
        Paint p = new Paint();
        p.setTextSize(100);
        canvas.drawText(bd.floatValue() + "cm", 500, 500, p);
    }

    //触摸事件
    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getAction()){
            case MotionEvent.ACTION_DOWN:
                isCanMove = true;
                break;
            case MotionEvent.ACTION_MOVE:
                if (!isCanMove){
                    return false;
                }
                //前面0坐标线从10像素开始，故而计算的时候要-10
                float x = event.getX() - 10;
                progress = x;
                //刷新
                invalidate();
                break;
        }
        return true;
    }


}
