# lunch_project

This project helps you choose today's lunch restaurant.


# Core Feature

Choose one restaurant ramdomly.
One day, One choose.


# Useage Tech
Server
-Node.js
-Express

DataBase
-PostgresSql

FrontEnd
-Angular 1.0

# First Setup
When you setup this project in the first time, you need to make a file below

File : /modules/dev.define.js
```js
var dev_define = 
{
	DB_CONNECTION_INFO : "postgres://userId:password@dbip/dbname"
}
module.exports = dev_define;
```