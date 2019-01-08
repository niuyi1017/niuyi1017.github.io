---
layout: post
title: 一些算法题中常用到的小知识点
date: 2018-09-26
categories: 前端
tags: 算法 PAT 笔试 
author: 牛一 
subtitle: '【持续更新】积累在刷题过程中常见的小问题和他们的解决办法'
cover: 'http://blogpic.niuy.xyz/69b7d63agy1fvipp4gnztj21hc0p51bx.jpg'
---  

### 进制转换  

将10进制n转化为d进制的数，转化后的每一位储存在数组arr里（倒序）
```C++
int len = 0,arr[100];   
    while(n!=0){
        arr[len++] = n%d;
        n = n/d;   
    }
```

### format   
output the sum in standard format -- that is, the digits must be separated into groups of three by commas (unless there are less than four digits).  
即9999999表示为99,999,999 

```C++
string str = to_string(n);
    int leng = str.length();
    for(int i = 0;i<leng;i++){
        cout<< str[i];
        if(str[i] == '-'){
            continue;
        }
        if((i+1) %3 == leng % 3  && i != leng-1){
            cout<< ",";
        }
    }
```