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

// 引用 connect-flash
const flash = require('connect-flash')
app.use(flash())  // 掛載套件

app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})


// 總路由
const routers = require('./routes')
app.use(routers)

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`)
})