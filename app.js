const express = require('express')
const app = express()
const port = 3000

// Mongoose 連線
require('./config/mongoose')

// 樣板設定
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 靜態檔案引入
app.use(express.static('public'))

// 解析req.body => body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true })) // 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理

// RESTful API
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// 設定 express-session
const session = require('express-session')
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

// 總路由
const routers = require('./routes')
app.use(routers)

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`)
})