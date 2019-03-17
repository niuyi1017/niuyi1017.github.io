---
layout: post
title: 如何用JavaScript刷算法题
date: 2019-03-17
categories: 笔记
tags: Node.js 算法 JavaScript 笔试
author: 牛一 
subtitle: '本文介绍如何使用JavaScript（Node.js）实现控制台标准输入输出'
cover: 'http://blogpic.niuy.xyz/b2.jpg'
---  
使用JavaScript刷算法题的关键在于如何实现在控制台的标准输入输出，本文尝试以算法题中常见的几种输入要求为例，介绍JavaScript版控制台标准输入输出的实现
### 一、基本模版  
实现echo  

```JavaScript
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let inputs = ''

rl.on('line',data => {
  inputs = data.trim() //输入
  console.log('你所输入的是：' + inputs)//输出
  process.exit(0)
})

```  
运行结果：   
![hello world](http://blogpic.niuy.xyz/node_stdio/hello%20world.png)

### 二、处理单行输入
将上文中基本模版添加数据处理的部分即可

```JavaScript
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let inputs = ''
let result = null
rl.on('line',data => {
  inputs = data.trim() //获取输入
  result = handle(inputs)//处理数据
  console.log(result)//输出
  process.exit(0)
})

function handle(inputs){
  //Do something
}
```
#### 示例：实现字符串反转  
>输入示例：  
 hello world!  
输出示例：  
 !dlrow olleh   

```JavaScript
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let inputs = ''
let result = null
rl.on('line',data => {
  inputs = data.trim()//获取输入
  result = handle(inputs)//数据处理
  console.log(result)//输出
  process.exit(0)
})

function handle(inputs){
  return inputs.split('').reverse().join('')
}  

```  
运行结果：  
![reverse](http://blogpic.niuy.xyz/node_stdio/reverse.png)
### 处理确定行输入  
确定行即题目中已明确给出测试用例的行数。  
有了上文中处理单行输入的基础，直接上示例
#### 示例：合并字符串  
> 输入示例：   
abcd  
1234  
输出示例：  
a1b2c3d4  

```JavaScript
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let lineNum = 2 //要输入两行
let inputs = [] //储存输入的数据
let result = null
rl.on('line', data => {
  inputs.push(data.trim().split(''))//每输入一行，都push到inputs数组中
  if(inputs.length == lineNum ){  //当输入的行数与题目中要求的行数相同时
    result = handle(inputs)//数据处理
    console.log(result)//输出结果
    process.exit(0)
  }
})

function handle(inputs) {
  let ret = []
  for(let i = 0; i<inputs.length;i++){
    ret.push(input[0][i])
    ret.push(input[1][i])
  }
  return ret.join()
}
```
运行结果：  
![a1b2c3d4](http://blogpic.niuy.xyz/node_stdio/a1b2c3d4.png)   
### 处理1+N行数据  
这是算法题中最常见的输入格式  
先输入数字N，后面跟着N行输入  
#### 示例： 输出各组的最大值  
> 输入示例：  
 3  
 1 2 3  
 4 5 6  
 7 8 9  
 输出示例：  
 3  
 6  
 9

```javascript
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let N = 0 //将N的初始值设置为0
let inputs = []
let result = null
rl.on('line', data => {
  if(N == 0) //如果N为初始值
    N = Number(data.trim())//将输入的值赋给N
  else{//如果N已经为键盘上输入的值了
    inputs.push(data.trim().split(' '))//将之后的每行输入压入数组inputs
    if(N == inputs.length){//如果输入的行数和要求的行数N相等了
      handle(inputs)//进行数据处理
      process.exit(0)
    }
  }
})

function handle(inputs) {
  inputs.forEach(item => {
    console.log(Math.max(...item))
  })
}
```  
运行结果：  
![369](http://blogpic.niuy.xyz/node_stdio/369.png) 

### 处理多行输入  
多行输入也是比较常见的输入要求  
只需要在处理输入时标记一下当前行号即可  

#### 示例： 统计各组数据在标准数据中的个数  
>输入示例:  
5            
1 2 3 4 5  
3  
1 0 0 0 0  
1 2 0 0 0  
1 2 3 0 0  
输出示例：   
1  
2  
3  

输入示例说明:  
第一行 5 表示标准数组中有5个元素  
第二行 1 2 3 4 5 即为标准数组内的各个元素  
第三行 3 表示接下来有3组测试用例，判断这三组测试用例中的与标准数组中的元素相同的个数  
第4-6行 即为三组测试用例  

```javascript
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let lineNum = 0  //表示当前正在输入的行号，初始化值为0，即还未输入

let elementNum = 0 
let stdArr = []

let testNum = 0
let testArr = []

let result = null
rl.on('line', data => {
  lineNum++ //键盘每输入一行，当前输入行号+1
  if (lineNum == 1) //如果当前输入的是第一行
    elementNum = Number(data.trim())
  else if (lineNum == 2)//如果当前输入的是第二行
    stdArr = data.trim().split(' ')
  else if (lineNum == 3)//如果当前输入的是第三行
    testNum = Number(data.trim()) //testNum 表示之后测试用例的个数
  else {//如果当前输入的是第四行及以后
    testNum --  //每输入一行，测试用例的个数-1
    testArr = data.trim().split(' ')
    console.log(handle(testArr)) //处理该组测试用例，输出
    if (testNum == 0) {
      process.exit(0)
    }
  }
})
function handle(testArr) {
  let count = 0
  testArr.forEach(item => {
    if (stdArr.includes(item)){
      count++
    }
  })
  return count
}
```

运行结果：  
![123](http://blogpic.niuy.xyz/node_stdio/123.png)    
### 总结  

上面总结几种方法，可以当作解题模板，直接套就可以了。  
过程其实很简单，输入 => 处理数据 => 输出  
如果处理数据部分较为简单，就不用单独封装出函数来处理了  
另外，oj 系统一般都支持输入一组测试用例接着输出一组结果，不必等所有测试用例都处理完了再将所有结果一起输出    

希望上述方法对你有所帮助  
  

参考： https://www.cnblogs.com/floor/p/6667059.html
