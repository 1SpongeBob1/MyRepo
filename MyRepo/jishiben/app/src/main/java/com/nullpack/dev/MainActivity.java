package com.nullpack.dev;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.util.Log;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Adapter;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import java.sql.Connection;
import java.util.ArrayList;


public class MainActivity extends AppCompatActivity {
    private ListView listView;
    private ArrayList<ItemInfo> itemInfos = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        listView = (ListView)findViewById(R.id.lv);
        //加载item界面
        getScene();
        //item的点击事件
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                ItemInfo ii = (ItemInfo) listView.getItemAtPosition(position);
                Bundle bundle = new Bundle();
                bundle.putString("note", ii.getNote());
                bundle.putString("time", ii.getTime());
                Intent i = new Intent(MainActivity.this, UpdateNote.class);
                i.putExtras(bundle);
                startActivity(i);
            }
        });

        //长按点击事件
        listView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, final int position, long id) {
                AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
                builder.setTitle("delete this item");
                builder.setMessage("are you sure?");
                builder.setPositiveButton("yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //获取此item的内容并删除数据库数据
                        ItemInfo ii = (ItemInfo) listView.getItemAtPosition(position);

                        NoteDatabaseHelper DBHelper = new NoteDatabaseHelper(MainActivity.this);
                        SQLiteDatabase db = DBHelper.getReadableDatabase();
                        db.delete("noteTable", "note=?", new String[]{ii.getNote()});
                        //删除所有item信息，然后重新加载item信息和界面
                        itemInfos.removeAll(itemInfos);
                        getScene();
                        Toast.makeText(MainActivity.this, "delete successed", Toast.LENGTH_SHORT).show();
                    }
                });
                builder.setNegativeButton("no", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Toast.makeText(MainActivity.this, "detele canceled", Toast.LENGTH_SHORT).show();
                    }
                });
                builder.create();
                builder.show();
                return true;
            }
        });


        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(MainActivity.this, WritingPage.class);
                startActivity(i);
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    //获取各个item的信息
    private void initItemInfo(){
        NoteDatabaseHelper DBHelper = new NoteDatabaseHelper(this);
        SQLiteDatabase db = DBHelper.getReadableDatabase();
        Cursor cursor = db.query("noteTable", null, null, null, null, null, null);
        if (cursor.moveToFirst()){
            do{
                itemInfos.add(new ItemInfo( cursor.getString(cursor.getColumnIndex("note")) ,
                            cursor.getString(cursor.getColumnIndex("time")) ));
            }while (cursor.moveToNext());
        }
    }

    //获取场景
    public void getScene(){
        initItemInfo();
        //通过装载器加载界面组件
        Adapter adapter = new NoteAdapter(this, R.layout.item, itemInfos);
        listView.setAdapter((ListAdapter) adapter);
    }

}
