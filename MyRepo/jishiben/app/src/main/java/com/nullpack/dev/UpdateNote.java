package com.nullpack.dev;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.Nullable;

public class UpdateNote extends Activity {
    private EditText editText;
    private Button saveButton;
    private Bundle info;
    private NoteDatabaseHelper DBHelper;
    private SQLiteDatabase db;
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.update_note);

        editText = (EditText)findViewById(R.id.et_2);
        info = this.getIntent().getExtras();

        //打开数据库
        DBHelper = new NoteDatabaseHelper(UpdateNote.this);
        db = DBHelper.getReadableDatabase();

        //预显示之前的note信息
        editText.setText(info.getString("note"));

        saveButton = (Button)findViewById(R.id.bt_2);
        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if( !editText.getText().toString().equals( info.getString("note") ) ){
                    //更新数据库
                    ContentValues values = new ContentValues();
                    values.put("note", editText.getText().toString());
                    String time = info.getString("time");
                    db.update("noteTable", values, "time=?", new String[]{time});
                }
                Toast.makeText(UpdateNote.this, "save successed", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(UpdateNote.this, MainActivity.class));
            }
        });
    }
}