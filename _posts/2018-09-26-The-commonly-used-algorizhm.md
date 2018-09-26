---
layout: post
title: 一些常用到的算法题
date: 2018-09-26
categories: 前端
tags: 算法 PAT 笔试 
author: 牛一 
subtitle: '【持续更新】积累在刷题过程中常见的小问题'
cover: 'http://p7kyjkmgh.bkt.clouddn.com/69b7d63agy1fvipp4gnztj21hc0p51bx.jpg'
---  

### 进制转换  

将10进制n转化为d进制的数，转化后的每一位储存在数组arr里（倒序）
```c++
int len = 0,arr[100];   
    while(n!=0){
        arr[len++] = n%d;
        n = n/d;   
    }
```
