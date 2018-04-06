---
layout: post
title: 'Oracle 数据库知识点总结（一）'
date: 2018-04-06
author: niuyi
categories: 记录
tags: oracle 数据库 慕课网 
---


###### 一点关于Oracle数据库的小总结  
 
>本文依据慕课网 [Oracle 数据库开发必备利器路径](https://www.imooc.com/course/programdetail/pid/40)相关课程整理  

#目录
* 表空间
* 管理表
* 操作表中数据
* 约束
* 查询语句


# 表空间  
1. 表空间概述 -- 逻辑存储空间  


    **可以把我们电脑比作一个数据库，而表空间就相当于C盘、D盘.....E盘，根据企业的需求不同，一个数据库中可以只有一个表空间，就如同电脑只设有一个C盘一样，同时也可以设有多个表空间，就如同电脑有C、D、E、F多个盘一样，表空间里是存放:表、视图、索引等内容的，就如同C、D...磁盘一样可以存放文本件**


    * 数据库与表空间  

    >表空间是数据库的逻辑存储空间。可以理解为在表空间中开辟一个空间用来存储数据库的对象。一个数据库可以由多个表空间构成。可用过表空间进行优化
    * 表空间与数据文件  
    >表空间是由一个或多个数据文件构成，数据文件的位置，大小可由用户定义。表，数据库当中的一些其他的对象都是存放在表空间中的数据文件里面的。
    * 表空间的分类  
    >永久表空间：表，视图，存储过程  
    >临时表空间：数据库操作过程中的中间执行的过程，执行完后会自行删除将不永久保存
    >Undo表空间：保存事务所修改的旧值,修改前的数据(利于撤销等方便回滚)  
2. 查看用户表空间 
    
    **语法：**
    
    ```
    desc dba_tablespaces
    select tablespace_name frome dba_tablespaces; 

    desc user_tablespaces
    select tablespance_name frome user_tablespaces;
    ```

    >Dba_tablespaces该数据字典针对的系统管理员级的用户来查看的数据字典，
    >user_tablespace该数据字典为普通用户登录后来查看的数据字典。


    作为系统管理员登录的时候，对应的表空间(dba_tablespaces下面的表空间)
    
    默认情况下为这6个：
    



    >System:用来存放sys用户的表、视图以及存储过程的数据库对象，也被我们称为是一个系统表空间。
    Sysaux：作为example的一个辅助表空间。
    Undotbs1：主要用于存储撤销信息的。
    Temp：存储sql语句处理的表和索引信息的，他是一个临时表空间。
    Users：属于一个永久性表空间，存储数据库用户创建的数据库对象。  
    example:  老师没说...


3. 创建用户表空间
    **语法：**
    ```
        create tablespace test1_tablespace datafile 'test1file.dbf' size 10m; 
        //创建永久表空间 
        create temporary tablespace teptest1_tablespace tempfile 'tempfile1.dbf' size 10m;
        //创建临时表空间
    ```
4. 修改用户表空间
    **语法**
    ```

    ALTER TABLESPACE table_name ONLINE | OFFLINE
    //设置联机或脱机装态，默认为ONLINE
     ALTER TABLESPACE table_name READ ONLY | READ WRITE
    //设置联只读或读写状态，默认为 READ WRITE
    select status from dba_tablespaces where tablespace_name='TEST1_TABLESPACE';
    //查看名为TEST1_TABLESPACE的表空间状态

    ```
5. 修改数据文件
     **语法**
    ```

    ALTER TABLESPACE table_name 
    ADD DATEFILE 'xx.dbf' SIZE nn;
    //向表空间中添加 名为 "xx.dbf" 大小为 nn 的文件

    ALTER TABLESPACE table_name 
    DROP DATEFILE 'xx.dbf' ;
    //从表空间中删除 名为 "xx.dbf"的文件

    select file_name from dba_files where tablespace_name='TEST1_TABLESPACE';
    //查看名为TEST1_TABLESPACE的表空间中的数据文件

    ```
    >拓展
    控制文件的扩展名：.ctl，位于oradata\ORCL\CONTROLFILE
    日志文件的扩展名：.log，位于oradata\ORCL\ONLINELOG
    数据文件的扩展名：.dbf，位于oradata\ORCL\DATAFILE

6. 删除表空间
      **语法：**
    ```
        DROP TABLESPACE tablespace_name [INCULDING CONTENTS] 
        //删除表空间 [（可选）包括表空间中的数据文件]
    ```

#管理表
1. 认识表
    * 基本储存单元
    * 二维结构
    * 行和列
        >行：每行叫做一条记录
        列：每一列叫做“字段”或“域”  

    **约定：**
        **1.  每一列必须具有相同数据类型
        2.  列名唯一
        3.  每一行数据唯一**  



2. 表的数据类型
    >数据类型：字符型、数值型、日期型、其它类型  

    >字符型：char(n)最大2000、nchar(n)最大1000 【若n=10 实际为3 占用是10，后面补贴7】

    >varchar2(n)最大4000、nvarchar2(n)最大2000  【比上面两个节省空间，若n=10 实际为3 占用就是3】

    >数值型：number(p,s) p有效数字，s小数点后面的位数   number(5,2):有效数字5位，保留2位小数，如123.45

    >日期型：date（常用）  timestamp（更精确）

    >其他类型：blob(以二进制) clob（以字符串）
3. 创建表
   **语法**
   ```
   CREAT TABLE table_name
   (
       col_name1 datatype,
       col_name2 datatype,
       col_name3 datatype...
   );
   ```
   
   **示例**
    
    ```
    create table userinfo
    (id number(6,0),
    username varchar2(20),
    userpwd varchar2(20),
    email varchar2(30),
    regdate date);
    
    
    desc userinfo
    //查看表的信息

    ```
4. 修改表
    **语法**
    ```
    ALTER TABLE tb_name

    [ADD column_name datatype]
    //添加一个字段（列）
    [MODIFY column_name datatype]
    //修改一个字段（列）的数据类型
    [DROP COLUMN column_name]
    //删除一个字段（列）
    [SET UNUSED(column_name)]
    //设置一个字段（列）为不可用状态
    [RENAME COLUMN old_column_name TO new_column_name]
    //修改一个字段（列）的名字
    [RENAME tb_name TO new_tb_name]
    //修改当前表名
    
    ```

    **示例**
    ```
    alter table userinfo add remarks varchar2(500);
    //添加remarks字段（列），数据类型为 varchar2 空间大小为500
    alter table userinfo modify remarks varchar2(400);
    //修改remarks字段（列），数据类型为 varchar2 空间大小为400
    alter table userinfo drop column remarks;
    //删除remarks字段（列）
    alter table userinfo rename column email to new_email;
    //重命名 email 字段（列）为 new_email
    rename userinfo to new_userinfo;
    //重命名 表名 userinfo 为 new_userinfo
    ```


5. 删除表

    >drop table tb_name：不仅删除表中全部记录，而且把表也一并删除
truncate table tb_name：删除表中全部记录，但表结构还在，是一个空表，速度快效率高(又称为表的截断)
delete from tb_name：删除表中的记录，数据可恢复；（可以添加where精准删除）



#操作表中的数据
1. 操作表中的数据
2. 复制表数据
3. 修改表数据
4. 删除表数据

#约束
1. 约束概述
2. 非空约束
3. 主键约束
4. 在修改表时添加主键约束
5. 在创建表时添加外键约束
6. 在修改表时添加外键约束
7. 删除约束
8. 在创建表时设置唯一约束
9. 在修改表时添加唯一约束
10. 删除唯一约束
11. 在创建表时设置检查约束
12. 在修改表时添加检查约束
13. 删除检查约束

# 查询语句
1. 查询概述
2. 基本查询语句
3. 在sql/plus中设置格式
4. 查询表中的所有字段及指定字段
5. 给字段设置别名
6. 运算符和表达式
7. 在select中使用运算符
8. 条件的查询
9. 模糊查询
10. 范围查询
11. 对查询结果进行排序
12. case...when语句
13. 

