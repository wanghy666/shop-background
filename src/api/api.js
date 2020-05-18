import http from "@/api/axios"
import QS from 'qs'

const BASE_RUL = ''
//商品类型列表
export const getTypeList = (url, params) => axios.get(
    BASE_RUL + url,
    params
)
//商品分类列表
export const getCategoryList = (url, params) => axios.get(
    BASE_RUL + url,
    params
)

/* -----商品评价----*/
//商品评价列表
export const getCommentList = (url, params) => axios.get(
    BASE_RUL + url, {
        params: params
    }
)
// axios.post(url, QS.stringify(params))
//修改商品评价状态
export const getEditComment = (url, params) => axios.post(
    BASE_RUL + url,
    QS.stringify(params)
)