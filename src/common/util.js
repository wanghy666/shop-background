//解决联级选择器最后一项为暂无数据
// export default {
//     setTreeData: (data) => {
//         for (var i = 0; i < data.length; i++) {
//             if (data[i].child.length < 1) {
//                 data[i].child = undefined;
//             } else {
//                 this.setTreeData(data[i].child);
//             }
//         }
//         return data;
//     }
// }
exports.setTreeData = function (data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].child.length < 1) {
            data[i].child = undefined;
        } else {
            this.setTreeData(data[i].child);
        }
    }
    return data;
}