import {
  M_SET_ARTICLE_DETAIL,
  M_SET_ARTICLE_ITEM,
  M_SET_TOTAL_ITEM,
  A_QUERY_ARTICLE_DETAIL
} from './mutation-types'
import { QueryArticleParams, ArticleDetail, ArticleItem } from '~/@types'
import { Store } from 'vuex'
import Notification from '~/components/notification'

interface State {
  articleDetail: ArticleDetail;
  articleItem: ArticleItem;
  totalItem: number;
}

/**
 * vuex state
 * */
export const state = (): State => <State> ({
  articleDetail: {},
  articleItem: {
    id: -1,
    uid: '',
    time: {
      year: '',
      month: '',
      monthNum: 0,
      day: '',
      hour: '',
      minute: '',
    },
    title: '',
    introduce: '',
    tag: '',
    views: 0,
    cover: '',
    ctime: 0,
    utime: 0,
  },
  totalItem: 0
})

/**
 * mutations
 * */
export const mutations = {
  [M_SET_ARTICLE_DETAIL] (state: State, payload: ArticleDetail) {
    state.articleDetail = payload
  },
  [M_SET_ARTICLE_ITEM] (state: State, payload: ArticleItem) {
    state.articleItem = payload
  },
  [M_SET_TOTAL_ITEM] (state: State, itemsNum: number) {
    state.totalItem = itemsNum
  }
}

/**
 * actions
 * */
export const actions = {
  async [A_QUERY_ARTICLE_DETAIL] (store: Store<State>, payload: QueryArticleParams) {
    const { uid, id } = payload
    // @ts-ignore
    const res = await this.$axios.get('/records/detail', {
      params: { uid, id }
    })
    if (res.success) {
      store.commit(M_SET_ARTICLE_DETAIL, { ...payload, ...res.data }) // 存储当前文章详情
      return
    }
    Notification({
      title: 'ERROR',
      type: 'error',
      message: res.message
    })
    store.commit(M_SET_ARTICLE_DETAIL, {}) // 查询失败，置空
  }
}
