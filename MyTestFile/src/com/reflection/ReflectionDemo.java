package com.reflection;

import java.lang.reflect.Constructor;
import java.lang.reflect.Modifier;

public class ReflectionDemo {
    public static void main(String[] args) {
        ReflectionDemo demo = new ReflectionDemo();
        Test t = new Test();
        demo.test(t);


    }

    private void test(Test t){


        Class c = t.getClass();
        Constructor[] constructors = c.getDeclaredConstructors();


        for (int i = 1; i <= constructors.length; i ++){
            System.out.println("-----------" + "\n" + i);
            System.out.println(constructors[i - 1].toString());
            System.out.println("修饰符:" + Modifier.toString(constructors[i - 1].getModifiers()));
            Class[] parameterTypes = constructors[i - 1].getParameterTypes();
            for (int j = 1; j <= parameterTypes.length; j ++){
                System.out.println("参数" + j + ":" + parameterTypes[j - 1].getName() + "");
            }
        }
    }

}

class Test{
    private int i = 0;
    private String string = "1";
    private float f = 1f;
    public String s = "sss";

    Test(){}

    private Test(int i){
        this.i = i;
    }

    private Test(String s){

    }

    private Test(String s, float f){

    }

    private Test(String s, float f, int i){

    }
}
