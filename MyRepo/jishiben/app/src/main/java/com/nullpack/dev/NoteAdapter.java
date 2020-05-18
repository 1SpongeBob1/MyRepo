package com.nullpack.dev;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.lang.reflect.Array;
import java.util.List;

public class NoteAdapter extends ArrayAdapter {
    private Context context;
    private int resource;
    private int tagId = 0;

    public NoteAdapter(@NonNull Context context, int resource, @NonNull List objects) {
        super(context, resource, objects);
        this.context = context;
        this.resource = resource;
    }


    @Nullable
    @Override
    public Object getItem(int position) {
        return super.getItem(position);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if(convertView == null){
            convertView = LayoutInflater.from(context).inflate(resource, parent, false);
            convertView.setTag(tagId++);
            Log.d("test", "加载了" + convertView.getTag());
        }

        TextView noteInfo = (TextView)convertView.findViewById(R.id.noteInfo);
        TextView timeInfo = (TextView)convertView.findViewById(R.id.timeInfo);

        ItemInfo itemInfo = (ItemInfo) getItem(position);
        //显示在item界面菜单的信息，若过长则省略
        if(itemInfo != null){
            if(itemInfo.getNote().length() <= 10){
                noteInfo.setText(itemInfo.getNote());
            }else{
                //判断是否有回车,如果有，回车前的字符串长度是否大于预设值
                if(itemInfo.getNote().contains("\n")){
                    String[] s = itemInfo.getNote().split("\n");
                    if(s[0].length() <= 10){
                        noteInfo.setText(s[0] + "...");
                    }else{
                        noteInfo.setText(s[0].substring(0,9) + "...");
                    }
                }else{
                    noteInfo.setText(itemInfo.getNote().substring(0,10) + "...");
                }
            }
            timeInfo.setText(itemInfo.getTime());
        }

        return convertView;
    }
}
