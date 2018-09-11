---
layout: post
title: node学习（一） http小爬虫 crawler.js 
date: 2018-09-10
categories: Node
tags: 前端 Node 慕课网 爬虫 HTTP Promise
author: 牛一 
subtitle: '一个用Promise写的http小爬虫'
cover: 'http://p7kyjkmgh.bkt.clouddn.com/%E6%A2%B5%E9%AB%98%E6%98%9F%E7%A9%BA.jpeg'
---  



## node学习（一） http小爬虫 crawler.js  

### 一、实现功能  
* 爬取慕课网课程基本信息（课程名+学习人数），并排序显示  
* 爬取每一个课程的章节信息及视频id 

### 二、效果图  

![crawler](http://p7kyjkmgh.bkt.clouddn.com/%E7%88%AC%E8%99%AB.gif)   

### 三、主要流程    

#### 根据课程id获取课程信息

因为爬取每个网页的时间是不能确定的，所以使用Promise来异步获取课程信息。  

每个Promise对象中发起两个https请求，分别用来获取该课程的学习人数和课程的章节信息的HTML代码。最后将学习人数和原网页代码一并交给resolve()进一步处理。

坑：本来以为可以通过一个爬取原网页HTML代码的请求就可以取到这两个信息，但是原网页中的课程学习人数是通过aJax获取的，无法直接从爬取的原网页HTML代码中筛选出来。最后只能发送一个专门用来获取学习人数...  


```js

function getPageAsync(id) {
    
    return new Promise((resolve, reject) => {
       
        var url = baseUrl+id
        console.log('正在爬取' + url +'\n')

        let Lnumber = 0;
        var html = ''
        getNumber(id).then(number => {
            Lnumber = number
        })

        https.get(url, res => {
           
            res.on('data', data => {
                html += data
            })
            res.on('end', () => {
                resolve({html,Lnumber})
            })
        }).on('error', err => {
            console.log(err + ':获取课程信息出错！')
            reject(err)
        })

    })
}
```

#### 数据整理，从爬取的内容中筛选出有用的信息  

使用了cheerio这个包，node中的jQuery。可以很方便的操纵爬取过来的网页源代码。  
对爬取的每一个网页的信息进行整理（主要整理出课程名称title、学习人数number、章节信息videos）后，把数据放到courseData对象中，最后return出去。
```js
function filterChapter(page) {
    
    const $ = cheerio.load(page.html)
    const chapters = $('.chapter')
    var title = $('.course-infos h2').text()
    var number = page.Lnumber
 
    var courseData = {
        title,
        number,
        videos:[]
    }

    chapters.each(function () {
        var chapter = $(this)
        var chapterTitle = chapter.find('h3').text()
        var videos = chapter.find('.video').children('li')
        var chapterData = {
            chapterTitle,
            videos: []
        }
        videos.each(function () {
            var video = $(this).find('.J-media-item')
            var videoTitle = video.text().trim().split('(')[0]
            var id = video.attr('href').split('video/')[1]
            chapterData.videos.push({
                title: videoTitle,
                id
            })
        })
        courseData.videos.push(chapterData)
    })
    return courseData
}

```  
#### 输出打印整理后的信息 

```js
function printCourseInfo(coursesData) {
    
    coursesData.forEach(courseData => {
        console.log('【'+courseData.number +'】'+'人学过 '+courseData.title+ '\n')
    })
    coursesData.forEach(courseData => {
        
        console.log('\n')
        console.log('----------------------------------------------------------------------------------\n')
        console.log('                           ' + courseData.title + '                               \n')
        console.log('----------------------------------------------------------------------------------\n')
        courseData.videos.forEach(item =>{
            var chapterTitle = item.chapterTitle
            console.log( chapterTitle + '\n')
            item.videos.forEach(video => {
                console.log('【id ' + video.id + '】' + video.title)
            })
        })
        
    })
}
```  
#### 整体骨架  

将每一个用来爬取网页信息的Promise对象放到fetchCourseArray中，使用Promise.all()方法来执行所有的Promise。
然后将爬取过来的数据进行整理、打印输出。

```js
   var fetchCourseArray = []
    videosIds.forEach(id =>{
        fetchCourseArray.push(getPageAsync(id))
    })

    Promise.all(fetchCourseArray)
            .then((pages) =>{
                var coursesData = []
            
                pages.forEach(page => {
                    var courses = filterChapter(page)
                    coursesData.push(courses) 
                })
                coursesData.sort((a,b) =>{
                    return a.number < b.number
                })
                printCourseInfo(coursesData)
            })
```
### 其他  

这个爬虫依然是根据慕课网相关教程[进击Node.js基础（二）](https://www.imooc.com/learn/637)做的。  

课程录制的时间比较早了，其中的一些效果已经不能用课程中的方法来实现了，比如获取学习人数。   

Scott老师讲的还是比较透彻的，尤其是讲HTTP的时候，把我在计算机网络课上听得云里雾里的地方用很幽默的例子讲明白。  

最好玩的是Scott老师喜欢拿慕课网开刀...  

[完整课程练习代码](https://github.com/niuyi1017/imooc/tree/master/imoocNode)   