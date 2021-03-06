import express, {NextFunction, Request, Response} from 'express'
import cors from 'cors'
import verifyPermission from './middleware/permission'
import {createCorsOptionsDelegate} from './utils/util'

import signIn from './routes/sys/managePermission'
import manageOverview from './routes/sys/manageOverview'
import manageRecords from './routes/sys/manageRecords'
import manageUploads from './routes/sys/manageUploads'
import manageMessages from './routes/sys/manageMessages'
import manageComments from './routes/sys/manageComments'
import manageSubscribes from './routes/sys/manageSubscribes'

import record from './routes/web/record'
import comment from './routes/web/comment'
import message from './routes/web/message'
import subscribe from './routes/web/subscribe'

const app = express()

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 9527

// 跨域配置
app.all('*', cors(createCorsOptionsDelegate), (req: Request, res: Response, next: NextFunction) => {
    if (req.method.toLowerCase() === 'options') {
        // 快速结束 options 请求
        res.sendStatus(200)
    } else {
        next()
    }
})

app.get('/uploads/*', (req, res) => {
    res.sendFile(__dirname + req.url)
})

// app.get('/music/*', (req, res) => {
//     res.sendFile(__dirname + "/" + req.url)
// })

// 兼容旧的版本，使用新的 qs 库解析 body 消息体
app.use(express.urlencoded({extended: true}));

// 解析 json 格式请求体
app.use(express.json());

/**
 * sys 端
 * */

// 系统登录
app.post('/sys/login', signIn)

// 后台管理 token 验证 中间件
app.use('/sys/*', verifyPermission)

// 首页概览
app.use('/sys/overview', manageOverview)
// 文章管理 —— 增删改查 文章信息
app.use('/sys/records', manageRecords)
// 上传 / 删除 图片管理
app.use('/sys/upload', manageUploads)
// 留言信息 管理
app.use('/sys/messages', manageMessages)
// 评论 管理
app.use('/sys/comments', manageComments)

// 订阅信息 管理
app.use('/sys/subscribes', manageSubscribes)


/**
 * web 端
 * */

// 文章信息
app.use('/record', record)
// 用户评论
app.use('/comment', comment)
// 用户评论
app.use('/message', message)
// 用户新增订阅、订阅验证
app.use('/subscribe', subscribe)




app.listen(port, () => {
    console.log(`server is listening at ${host}:${port}...`)
})
