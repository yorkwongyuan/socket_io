
const express = require('express');
const path = require('path');
const app = express();
//使用静态资源访问,public为根目录
console.log(path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')))
 
app.listen(8080, () => {
  console.log(`App listening at port 8080`)
});