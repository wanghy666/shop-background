import {
    get,
    post
} from '@/api/index.js'

const BASE_RUL = ''

export const getTypeList = (url, params) => get(BASE_RUL + url, params);
/* -----商品评价----*/
//商品评价列表
export const getCommentList = (url, params) => get(BASE_RUL + url, params)
export const getEditComment = (url, params) => post(BASE_RUL + url, params);