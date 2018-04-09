---
layout: post
title: '算法笔记（一）'
date: 2018-04-09
author: 牛一
cover: 'http://p1.pstatp.com/large/ddb00015d390ad83e21'
tags: 算法 笔记 C C++ Algorithm 
---



# 算法笔记（一）  

#### 一点关于线性表的小总结  
    

## 线性表  
#### 线性表的顺序存储 ———— 顺序表

1. 结构   

```C++


#include<stdio.h>
#include<stdlib.h>
#define MAXSIZE 50  

typedef int ElementType;
typedef struct LNode *List;
struct LNode {
    ElementType Data[MAXSIZE];
    int last;
};


```
2. 创建一个空链表  
```c++
List MakeEmpty(){
    List L;
    L = (List)malloc(sizeof(struct LNode));
    L->last = -1;
    printf("创建成功！\n");
    return L;
}
```  
3. 按值查找
```C++  

int Find(List L,ElementType X ){
    int i = 0;
    while(i<=L->last&&L->Data[i]!=X){
        i++;
    }
    if(i>L->last){
        printf("没有找到！\n");
        return false;
    }else{
        printf("查找成功！\t 在链表的第%d个节点(下标为%d)找到了元素 %d\n",i+1,i,X);
        return i;
    }
    
}  
```  
4. 插入  
```c++
bool Insert(List L,ElementType X ,int i){
    int j;
    if (L->last==MAXSIZE-1){
        printf("表满了\n");
        return false;
    }
    
    if(i<1||i>L->last+2){
        printf("插入位置不合法\n");
        return false;
    }


   else{
       
       for(j = L->last;j>=i-1;j--){
       
        L->Data[j+1] = L->Data[j];

        }

        L->Data[i-1] = X;
        L->last++;
        printf("插入成功！\t 在链表的第%d个节点(下标为%d)插入了元素 %d last(最后一个元素的下标) 为%d  表长为%d \n",i,i-1,X,L->last,L->last+1);
        return true;
    } 

}  
```  
4. 删除节点  
```C++
bool Delete(List L,int i){
    int j;
    if(i<1||i>L->last+1){
        printf("位序不合法！\n");
        return false;

    }

    for (j = i-1;j<=L->last;j++){
        L ->Data[j-1] = L ->Data[j];

    }
    L->last--;
    printf("删除成功！\t 在链表的第%d个节点(下标为%d)删除了元素  last(最后一个元素的下标) 为%d  表长为%d \n",i,i-1, L->last,L->last+1);
}
```
