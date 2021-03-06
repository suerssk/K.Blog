import {poolQuery} from '../db/DBUtil'
import {authorMailInfo} from '../common/definition'

enum ArticleType {
    Mood = 'Mood',
    JS = 'JS',
    FrontEnd = 'FrontEnd',
    BackEnd = 'BackEnd',
    StudyNote = 'StudyNote'
}

const articleType = [
    'Mood',
    'JS',
    'FrontEnd',
    'BackEnd',
    'StudyNote'
]

/**
 * 概览数据：
 * 1. 文章总数 total
 * 2. 最新文章发布时间 ctime
 * 3. 评论文章或回复我的未读评论数 unread
 * 4. 评论文章或回复我的总数
 * TODO 5. 不同类别文章数（统计）
 * */
export function getOverviewData() {
    // 文章总数（total） + 最新文章发布时间（ctime）
    // 'SELECT COUNT(id) AS total, max(ctime) as ctime FROM tbl_records;'

    // unread comments（评论文章或回复我的未读评论数）
    // 'SELECT COUNT(is_read) as unread FROM `tbl_comments` WHERE is_read = 0 AND to_email = ?;'
    // 'SELECT COUNT(id) as total, (SELECT COUNT(id) as unread FROM `tbl_comments` WHERE is_read = 0 AND to_email = ?) as unread FROM `tbl_comments` WHERE to_email = ?;'

    const articleStr = `
        SELECT COUNT(id) AS total,
        (SELECT COUNT(id) as Mood FROM tbl_records WHERE tag = ?) as Mood,
        (SELECT COUNT(id) as JS FROM tbl_records WHERE tag = ?) as JS,
        (SELECT COUNT(id) as FrontEnd FROM tbl_records WHERE tag = ?) as FrontEnd,
        (SELECT COUNT(id) as BackEnd FROM tbl_records WHERE tag = ?) as BackEnd,
        (SELECT COUNT(id) as StudyNote FROM tbl_records WHERE tag = ?) as StudyNote
        max(ctime) as ctime FROM tbl_records;
    `
    //  ORDER BY ctime DESC LIMIT 0, 1
    const articleParams = [
        ArticleType.Mood,
        ArticleType.JS,
        ArticleType.FrontEnd,
        ArticleType.BackEnd,
        ArticleType.StudyNote
    ]
    const unreadStr = 'SELECT COUNT(id) as comments, (SELECT COUNT(id) as unread FROM `tbl_comments` WHERE is_read = 0 AND to_email = ?) as unread FROM `tbl_comments` WHERE to_email = ?;'

    const {user} = authorMailInfo

    const articlePro = poolQuery(articleStr, articleParams)
    const unreadPro = poolQuery(unreadStr, [user, user])

    return new Promise((resolve, reject) => {
        Promise.all([articlePro, unreadPro])
            .then(([articleRes, unreadRes]) => {
                resolve({
                    /* @ts-ignore */
                    total: articleRes.length ? articleRes[0].total : 0,
                    /* @ts-ignore */
                    ctime: articleRes.length ? articleRes[0].ctime : 0,
                    /* @ts-ignore */
                    unread: unreadRes.length ? unreadRes[0].unread : 0,
                    /* @ts-ignore */
                    comments: unreadRes.length ? unreadRes[0].comments : 0,
                    /* @ts-ignore */
                    chartOption: mapChartOption(articleRes[0])
                })
            })
            .catch(error => {
                reject({
                    status: 500,
                    message: 'Overview data query failed',
                    error
                })
            })
    })
}

function mapChartOption (opt: any) {
    const result: any[] = []

    if (opt) {
        articleType.forEach(type => {
            result.push({
                name: type,
                value: opt[type]
            })
        })
    }
    return result
}