import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/store/modules/user.js'
import menu from '@/store/modules/menu.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        menu
    }
})