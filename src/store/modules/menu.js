import {
    stat
} from "fs";

export default {
    state: {
        topActiveIndex: "0",
        topMenuList: []
    },
    getters: {},
    mutations: {
        createMenuTree(state, menu) {
            let menuTree = menu.map(item => {
                let subMenuList = item.child.map(v => {
                    return {
                        index: v.id,
                        name: v.name,
                        icon: v.icon,
                        pathName: v.frontpath
                    }
                })
                return {
                    index: item.id,
                    name: item.name,
                    subMenuIndex: '0',
                    subMenuList: subMenuList
                }
            })
            state.topMenuList = menuTree;
            localStorage.setItem('topMenuList', JSON.stringify(menuTree))
        },
        changeMenuTree(state, menu) {
            state.topMenuList = menu;
        },
        changeTopActiveIndex(state, topIndex) {
            state.topActiveIndex = topIndex
            localStorage.setItem("top", topIndex);
        }
    },
    actions: {}
}