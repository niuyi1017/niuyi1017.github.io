---
layout: post
title: docker 常用命令整理
date: 2020-04-11
categories: docker
tags: 
author: 牛一 
subtitle: '最近在了解前端自动化，积累一下相关知识'
cover: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2156293558,1648142323&fm=26&gp=0.jpg'
---  
### 安装docker
```shell
sudo wget -qO- http://get.docker.com/ | sh  
```
### 安装docker-compose
```shell
curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose   
chmod +x /usr/local/bin/docker-compose
```
### 使其他用户有docker使用权限
```shell
sudo usermod -aG docker <username>
```
### 启动docker
```shell
service docker start 
```
### 根据Dockerfile构建镜像
```shell
docker image build ./ -t <name:tag>
```
### 查看镜像列表
```shell
docker images
```
### 删除镜像
```shell
docker rmi <REPOSITORY:TAG>
```

### 启动容器  
```shell
 docker container start <container id>
```
### 停止容器  
```shell
docker container stop <container id>
```
### 删除容器  
```shell
docker container rm <container id>
```

### 检查nginx配置文件是否书写有误 
```shell
nginx -t
```
### 重启nginx 
```shell
service nginx restart
```
