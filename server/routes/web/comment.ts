import express from 'express'
import {getRecordComment, addComment} from '../../services/commentService'
import {writeHead, writeResult} from '../../utils/writeResponse'
import {groupCommentList} from '../../utils/util'
import sendMail from '../../utils/sendMail'
import {SendEmailType} from '../../common/types'
import {authEmail, authorMailInfo} from '../../common/definition'

const router = express.Router()

/**
 * 获取当前文章的评论
 * */
router.get('/list', (req, res) => {
    const articleId = req.query.articleId
    getRecordComment({articleId: Number(articleId)})
        .then((result: any) => {
            writeHead(res, 200)
            writeResult(res, true, 'Successfully get the article comment list!', groupCommentList(result))
        })
        .catch(error => {
            writeHead(res, 500)
            writeResult(res, false, 'Something wrong with querying the article comment list!', error)
        })
})

/**
 * 评论文章 / 回复评论
 * */
router.post('/add', (req, res) => {
    try {
        const {
            fromName,
            fromEmail,
            toName,
            toEmail,
            articleId,
            topicId,
            parentId,
            comment,
            articleUid,
            articleTitle
        } = req.body

        addComment({
            fromName,
            fromEmail,
            toName,
            toEmail,
            articleId,
            topicId,
            parentId,
            comment
        })
            .then(() => {
                writeHead(res, 200)
                writeResult(res, true, 'Successful, you have posted a comment')
                // 评论文章或者回复 小K. 的，不发送回复信息邮件
                if (!toEmail || toEmail === authEmail.qq || toEmail === authEmail.outlook) return

                const info = {
                    name: toName,
                    title: articleTitle,
                    email: toEmail,
                    url: `${req.headers.origin}/article/${articleUid}_${articleId}` /* 邮件跳转文章详情页 */
                }
                sendMail(SendEmailType.ADD_COMMENT, info, authorMailInfo)
                    .then(() => undefined)
            })
            .catch(err => {
                writeHead(res, 500)
                writeResult(res, false, 'Something wrong with posting a comment', err)
            })
    } catch (error) {
        writeHead(res, 500)
        writeResult(res, false, 'Something wrong', error)
    }
})


export default router
