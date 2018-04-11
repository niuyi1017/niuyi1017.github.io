---
layout: post
title: 'Oracle 数据库知识点总结（一）'
date: 2018-04-06
author: niuyi
categories: 记录
tags: oracle 数据库 慕课网 
---

#### 一点关于Oracle数据库的小总结  

 
>本文依据慕课网 [Oracle 数据库开发必备利器路径](https://www.imooc.com/course/programdetail/pid/40)相关课程整理。共分3篇。  
包含Oracle数据库的相关概念、对比、语法，示例等。其中语法部分为方便起见，关键字使用大写，并且使用了较多的换行。实际开发时Oracle对大小写（部分表名等须大写的除外）、换行区分不是很严格，可以依据个人习惯进行书写。  
  


# 目录
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
    
    ```c++
    DESC DBA_TABLESPACES;

    SELECT tablespace_name FROM DBA_TABLESPACES;
    //dba_tablespaces该数据字典针对的系统管理员级的用户来查看的数据字典  
      


    DESC USER_TABLESPEACES;
    
    SELECT tablespace_name FROM USER_TABLESPACES;
    user_tablespace该数据字典为普通用户登录后来查看的数据字典。  

    ```


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
        
    CREAT TABLESPACE tabelespace_name DATAFILE 'xxx.xx' SIZE XX;
    //创建永久表空间 
        

    CREAT TEMPORARY TABLESPACE tablesspace_name TEMPFILE 'xxx.xx' SIZE XX;
    //创建临时表空间
    ```

    **示例**
    ```
    create tablespace test1_tablespace datafile 'test1file.dbf' size 10m;    
   //创建名为test1_tablespace的永久表空间，并向其中添加名为'test1file.dbf'大小为10M的文件  

    create temporary tablespace teptest1_tablespace tempfile 'tempfile1.dbf' size 10m;
    //创建名为teptest1_tablespace的临时表空间，并向其中添加名为'tempfile1.dbf'大小为10M的文件
    ```
4. 修改用户表空间  

    **语法**
    ```

    ALTER TABLESPACE table_name ONLINE | OFFLINE;
    //设置联机或脱机装态，默认为ONLINE  

     ALTER TABLESPACE table_name READ ONLY | READ WRITE;
    //设置联只读或读写状态，默认为 READ WRITE  


    SELECT STATUS FEOM dab_tablespaces WHERE tablespace_name='XXXXXXXX';
    //查看名为XXXXXXXX的表空间状态,注意表空间的名字要大写

    ```
5. 修改数据文件  

     **语法**
    ```

    ALTER TABLESPACE table_name 
    ADD DATEFILE 'xx.dbf' SIZE nn;
    //向表空间中添加 名为 "xx.dbf" 大小为 nn 的文件

    ALTER TABLESPACE table_name 
    DROP DATEFILE 'xx.dbf';
    //从表空间中删除 名为 "xx.dbf"的文件

    select file_name from dba_files where tablespace_name='TEST1_TABLESPACE';
    SELECT file_name FROM dba_files WHERE tablespace_name='XXXXXXX'
    //查看名为TEST1_TABLESPACE的表空间中的数据文件,注意表空间的名字要大写

    ```
    >拓展：  
    >控制文件的扩展名：.ctl，位于oradata\ORCL\CONTROLFILE  
    >日志文件的扩展名：.log，位于oradata\ORCL\ONLINELOG  
    >数据文件的扩展名：.dbf，位于oradata\ORCL\DATAFILE

6. 删除表空间  

      **语法：**
    ```
        DROP TABLESPACE tablespace_name [INCULDING CONTENTS] 
        //删除表空间 [（可选）包括表空间中的数据文件]
    ```

# 管理表
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



# 操作表中的数据
1. 操作表中的数据  
    * 向表中插入数据  
        **语法**  
        ```
        INSERRT INTO table_name 
        (column1,column2,column3....)
        VALUES(value1,value2,value3...)

        ```
        **示例**
        ```
        
        insert into userinfo
        values(1,'xxx','123','xxx@126.com',sysdate);
        //向表中所有字段添加值,注意values的值要和表的字段一一对应. "sysdate"为系统当前时间.

        insert into userinfo(id,username,userpwd)
        values(2,'yyy','123);
        // 向表中指定字段添加值,也要一一对应  


        设置默认值（给字段设置默认值），使用关键字 `dafault`
        1. 在创建表时设置默认值  
            create table userinfo1
            (id number(6,0),
            redate date default sysdate);
            //将regdate字段的默认值设置为sysdate，即系统当前时间

        2. 在修改表时设置默认值
            alter table userinfo
            modify email default '无';
            //将email字段的默认值修改为 '无'
        ```
    
2. 复制表数据
    * 在创建表的时候复制其他表的数据
        **语法**
        ```
        CREAT TABLE new_table
        AS
        SELECT  column1...|* FROM old_table

        ```

        **示例**
        ```
        create table userinfo_new as select * from userinfo;
        //创建了useringfo_new 的表，结构和数据均是由userinfo表复制而来
        create table userinfo_new1 as select id,username from userinfo;
        //创建了useringfo_new1的表，其中字段id,username中的数据是由userinfo表中id,username 的数据复制而来
        ```  
    * 在向表插入数据时复制其他表的数据
        **语法**
        ```
        INERT INTO new_table
        [(column1,...)]
        SELECT  column1... |* FROM old_table
        ```

        **示例**
        ```
        insert into userinfo_new select * from userinfo;
        //向userinfo_new表中插入数据，数据均来自userinfo  

        insert into userinfo_new(id,username) select id,username from userinfo;
        //向userinfo_new表中id,username字段中插入数据，数据来自userinfo表中id,username字段的数据 
        ```  

3. 修改表数据  
    **语法**
    ```
    UPDATE table_name 
    SET column1  = value1,...
    [WHERE conditions]
    ```
    **示例**
    ```
    update userinfo set userpwd='111111';
    //将useinfo表中的userpwd全部重置为'111111'

    update userinfo set userpwd='111',email='111@126.com';
    //将useinfo表中的userpwd全部重置为'111111',email全部重置为'111@126.com'

    update userinfo set userpwd='123456' where username='xxx';
    //将username为'xxx'的记录的userpwd重置为''123456

    ```
4. 删除表数据
    **语法**
   ```
    DELETE FROM table_name [WHERE condition]
    ```

    **示例**
    ```
    delete from testdel;
    //删除 testdel表中的所有数据
    delete from userinfo where username='yyy';
    //删除username为'yyy'的这条记录
    ```


# 约束
1. 约束概述
    ```
    作用：定义规则，确保数据完整性  
    Oracle五个重要的约束：非空约束 主键约束 外键约束 唯一约束 检查约束
    ```
2. 非空约束
    ```
    CREATE TABLE  table_name(column_name DATATYPE NOT NULL,...);
    //在创建表时设置非空约束  

    ALTER TABLE table_name MODIFY column_name DATATYPE NOT NULL;
    //在修改表时添加非空约束  

    ALTER TABLE table_neame MODIFY column_name DATATYPE NULL;
    //在修改表时去除非空约束
    
    ```
3. 主键约束

    >作用：确保表中每一行数据的唯一性（要求这个字段是非空的，值是唯一的）  
    > 一张表中只能设计一个主键约束,但是这个主键约束可以由多个字段来构成，由多个字段构成的主键约束称之为联合主键或复合主键。

    * 在创建表时添加主键约束--约束的名字是唯一的，不写系统会随机分配一个约束名

        **语法**
        ```
        CREAT TBALE table_name 
        (column_name1 DATATYPE PRIMARY KEY,
        column_name2 DATATYPE );
        //在创建表时添加主键约束,未设置主键名，系统会自动生成随机主键名
    
        CREAT TABLE table_name
        (colum_name1,....,
        CONSTRAINT constraint_name PRIMARY KEY (column_name1,...));
        //创建联合主键

        ```
        **示例**
        ```
        create table userinfo_p(id number(6,0) primary key,
        username varchar2(20),
        userpwd varchar2(20));
        //创建userinfo表并为其中的id字段添加主键约束


        create table userinfo_p1
        (id number(6,0),
        username varchar2(20),
        userpwd varchar2(20),
        constraint pk_id_username primary key(id,username));
        //创建由id和username构成的联合主键
 

        select constraint_name from user_constraints where table_name='xx'
        //查询约束(可以查询到表名为'xx'的约束名)
        ```

       

    * 在修改表时添加主键约束
        **语法**
        ```
        ALTER TABLE table_name  
        ADD CONSTRAINT constraint_name PRIMARY KEY(column_name);
        //在修改表时添加主键约束
        ```
        **示例**
        ```
        alter table userinfo
        add constraint pk_id primary key(id);
        //为表名为userinfo的表中的id字段添加名为pk_id的主键约束
        ```

    * 更改约约束名称
        **语法**
        ```
        ALTER TABLE table_name 
        RENAME CONSTRAINT old_constraint_name TO new_constraint_name;
        //更改约束名称
        ```
    * 禁用/启用约束
        **语法**
        ```
        ALTER TABLE table_name 
        DISABLE | ENABLE CONSTRAINT constraint_name;
        //禁用(启用)约束
    * 删除主键约束
        **语法**
        ```
        ALTRT TABLE table_name
        DROP CONSTRIANT constraint_name;
        //删除约束

        ALTER TABKLE table_name
        DROP PRIMARY KEY[CASCADE];
        //cascade 级联（有外键等情况时连同一起删除）
        
        ```
         >如果忘记了约束的名字，可以通过以下命令来查看
        ```
        SELECT CONSTRAINT_NAME,CONSTRAINT_TYPE,STATUS 
        FROM USER_CONSTRAINTS 
        WHERE TABLE_NAME='XXXXXX';
        ```
5. 外键约束
   * 添加外键约束(约束的名字是唯一的，不写系统会随机分配一个约束名)
    **语法（列级）**
        ``` 
        CREATE TABLE table1
        (
            column_name DATATYPE 
            REFERENCE table2(column_name),
            ...
        );
        //在创建表时添加外键约束（列级）
        (table1是从表，table2是主表；主从表中相应的字段必须是同一个数据类型；从表中外键字段的值必须来自主表中的相应字段的值，或为null)
        ```
        **示例**
        ```
        create table typeinfo
        (tyoeid varchar2(10) primary key,
        typename varchar2(20));
        //创建主表

        create table userinfo_f
        (id varchar2(20) primary key,
        username varchar2(20),
        typeid_new varchar2(10) references typeinfo(typeid));
        //创建从表
        ```
        **语法（表级）**
        ```
        CREAT TABLE table_name
        (column_name DATATYPE,
        CONSTRAINT constraint_name FOREIGN KEY(colunnm_name)
        REFERENCE table_name (column_name) [ON DELETE CASCADE]);
        //在创建表时添加外键约束(表级)  ON DELETE CASCADE 表示级联删除，即主表中的数据删除后，从表中的数据也将一同删除
        ```
        **示例**
        ```
        create table userinfo_f2
        (id varchar2(10) primary key,
        username varchar2(20),
        typeid_new varchar2(10),
        constraint fk_typeid_new freign key(typeid_new) 
        references typeinfo(typeid));
        //在创建userinfo_f2时，将typeid_new 字段设置外键约束，参考typeinfo表中的typeid字段
        ```
     **语法（在修改表时设置外键约束）**
        ```
        ALTER TABLE table_name 
        ADD CONSTRAINT constraint_name
        FOREIGN KEY (column_name) REFERENCE table_name(column_name)
        [ON DELETE SASCADE];
        ```
      **示例（在修改表时设置外键约束）**
      ```
        alter table userinfo_f4 
        add constraint fk_typeid_alter 
        foreign key(typeid_new) references typeinfo(typeid);
        //将userinfo_f4表中的typeid_new字段设置外键约束
      ```
        
    * 删除外键约束：
        **语法**
        ```
        ALTER TABLE table_name 
        DISABLE | ENABLE CONSTRAINT constranin_name;
        //禁用/启用 外键约束

        ALTER TABLE table_name 
        DROP CONSTRAINT constraint_name;
         //删除外键约束  

        ```
        >如果忘记了约束的名字，可以通过以下命令来查看
        ```
        SELECT CONSTRAINT_NAME,CONSTRAINT_TYPE,STATUS 
        FROM USER_CONSTRAINTS 
        WHERE TABLE_NAME='XXXXXX';
        ```

5. 唯一约束 
    >作用：保证设置唯一约束的字段值的唯一性  
    唯一约束与主键约束的区别:  
    （1）主键约束的字段为非空的，而唯一约束只允许有一个值为null  
    （2）一张表只能有一个主键约束，而唯一约束可以有多个  



    >比如说你玩网游起名字时，提醒你昵称已被使用。  
    其实这就是网游数据库设置了唯一约束。。。。。。  

    * 在创建表时设置唯一约束（列级）
        **语法**
    ```
    CREATE TABLE table_name
    (column_name datatype UNIQUE,...);
    ```
    * 在创建表时设置唯一约束（表级）
        **语法**
    ```    
    CREATE TABLE table_name
    (column_name datatype,...,
    CONSTRAINT u_name UNIQUE(column_name));
    ```
    **注：
        （1）唯一约束的名称（u_name）必须唯一；    
        （2）如果想设置多个唯一约束字段，需要将子句（CONSTRAINT u_name UNIQUE(column_name)）重复书写即可。**    

    
    * 在修改表时添加唯一约束 
        **语法**
        ```
        ALTER TABLE table_name
        ADD CONSTRAINT condtraint_name
        UNIQUE(column_name);
    * 删除唯一约束：
        **语法**
        ```
        ALTER TABLE table_name 
        DISABLE | ENABLE CONSTRAINT constranin_name;
        //禁用/启用 唯一约束

        ALTER TABLE table_name 
        DROP CONSTRAINT constraint_name;
         //删除唯一约束  

        ```
        >如果忘记了约束的名字，可以通过以下命令来查看
        ```
        SELECT CONSTRAINT_NAME,CONSTRAINT_TYPE,STATUS 
        FROM USER_CONSTRAINTS 
        WHERE TABLE_NAME='XXXXXX';
        ```

6. 检查约束
    >满足一定条件的值才能输入到表中  
    作用：让表中的值更具有实际意义。<br>
    注：检查约束在一张表中也是可以有多个的。<br>
    * 在创建表时添加检查约束
        **语法(列级)**
        ```
        CREATE TABLE table_name
        (column_name datatype 
        CHECK(expressions),...);

        ```
        注：expressions为条件表达式  

        check(salary > 10 and salary < 20)  
        check(salary > 1000 or salary < 100)  
        check(salary in(10, 20, 30))  
        check(id like '_9%')  
        其中_表示一个字符， %表示多个字符，like后面跟的应该可以叫正则表达式。  


        
        **示例（列级）**
        ```
        create table userinfo_c
        (id varvhar2(10) primary key,
        username varchar2(20), 
        salary number(5,0) check(salary>0));
        ```
        **语法（表级）**
        ```
        CREATE TABLE table_name
        (column_name datatype,...,
        CONSTRAINT c_name
        CHECK(expressions));
        ```
        

        **示例(表级)**
        ```
        create table userinfo_c1
        (id varchar2(10) primary key,
        username varchar2(20),
        salary number(5,0),
        constraint ck_salary check(salary>0));
        ```
    * 在修改表时添加检查约束
        **语法**
        ```
        alter table userinfo_c3 add constraint ck_salary_new check(salary>0);
        ALTER TABLE table_name
        ADD CONSTRAINT constraint_name
        CHECKED(expressions)
        ```
        **示例**
        ```
        alter table userinfo_c3 
        add constraint ck_salary_new 
        check(salary>0);
        ```
    * 删除检查约束
        
        **语法**
        ```
        ALTER TABLE table_name 
        DISABLE | ENABLE CONSTRAINT constranin_name;
        //禁用/启用 检查约束

        ALTER TABLE table_name 
        DROP CONSTRAINT constraint_name;
         //删除检查约束  

        ```
        >如果忘记了约束的名字，可以通过以下命令来查看
        ```
        SELECT CONSTRAINT_NAME,CONSTRAINT_TYPE,STATUS 
        FROM USER_CONSTRAINTS 
        WHERE TABLE_NAME='XXXXXX';
        ```
        

7. 小结
    >主键约束（PRIMARY KEY）：主键约束可以保证主键列的数据没有重复值且不为空，即唯一标识表中的每条记录。  

    >外键约束（FOREIGN KEY）：把一个表中的数据和另一个表中的数据进行关联  

    >非空约束（NOT NULL）：约束表中的列不允许取空值（NULL）。

    >唯一约束（UNIQUE）：唯一约束和主键约束都是设置表中的列不能去重复值，不同的是，一个表的唯一约束可以有多个，且唯一约束的列允许存在多个空值。

    >检查约束（CHECK）：只有符合输入条件的数据才能存储到表中。


