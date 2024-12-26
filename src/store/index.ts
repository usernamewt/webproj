
import { defineStore } from 'pinia'

export const useTestStore = defineStore('BaseStore', {
    state:()=>{
        return {
            // 取值'equipmentlist','acceryon'
            // 菜单类型
            menuType:'equipmentlist',
            // 设备ID
            deviceId:'',
            // 设备位置
            deviceLocation:'',
            targetId:'',
            urlId:'',
            // 设备名称
            device_name:'',
            // 当前控制url
            currentUrl:{
                sourceId:'',
                urllist:[]
            },
            // 是否显示url选择
            isShowUrl:false,
            header:'设备列表'
        }
    }
})
