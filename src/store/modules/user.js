export default {
    state: {
        user: JSON.parse(localStorage.getItem('user')) || {},
        token: localStorage.getItem('token') || false
    },
    getters: {},
    mutations: {
        //登陆
        login(state, userInfo) {
            // 修改vuex
            state.user = userInfo;
            state.token = userInfo.token;
            // 本地存储
            localStorage.setItem('user', JSON.stringify(userInfo));
            localStorage.setItem('token', userInfo.token)
        },
        //退出
        logout(state) {
            // 修改vuex
            state.user = {};
            state.token = false;
            // 本地存储
            localStorage.clear()
        }
    },
    actions: {}
}