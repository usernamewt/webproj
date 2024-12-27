import request from "../utils/request";

import { ItypeAPI } from "../utils/response";
import { Res } from "../utils/response";

interface DataItem {
    id: string;
    res_name: string;
    status: number;
    address: string;
    res_date:string;
    last_checked:string
}
/**
 * 
 * @param 设备接口
 * @returns 
 */
// 获取设备列表
export const getEquipmentList = (userId:string):Res<ItypeAPI<any>>=>{
    return request.get("/device/list?user_id="+userId)
}

// 获取设备信息
export const getEquipmentInfo = (data:{device_id?:string,device_sn?:string}):Res<ItypeAPI<any>>=>{
    return request.get("/device/get",{params:data})
}

// 修改设备信息
export const editEquipmentInfo = (data:any):Res<null>=>{
    return request.get("/device/set",{params:data})
}

// 注册新设备
export const registerDevice = (data:{device_sn:string,firmware_version:string}):Res<null>=>{
    return request.post("/device/register",data)
}
// 添加设备
export const addDevice = (data:{device_name:string}):Res<null>=>{
    return request.post("/device/add",data)
}

// 绑定设备到用户
export const bindDevice = (data:{user_id:string,device_sn:string}):Res<null>=>{
    return request.post("/device/bind",data)
}

/**
 * 
 * @param 资源接口
 * @returns 
 */
// 获取加速资源列表
export const getAccelerateList = (deviceId:string):Res<ItypeAPI<DataItem[]>>=>{
    return request.get("/resource/list?device_id="+deviceId)
}

// 获取加速网址
export const getAccelerateUrl = (resId:string):Res<ItypeAPI<any[]>>=>{
    return request.get("/resource/url?res_id="+resId)
}

// 获取预设资源库列表
export const getPreSetList = ():Res<ItypeAPI<any>>=>{
    return request.get("/resource/list_preset_resource")
}

// 添加加速资源
export const addAccelerate = (data:any):Res<null>=>{
    return request.post("/resource/add",data)
}

// 修改加速资源
export const editAccelerate = (data:any):Res<null>=>{
    return request.post("/resource/edit",data)
}

// TODO:
// 删除加速资源
export const deleteAccelerate = (data:string):Res<null>=>{
    return request.get("/resource/del?resource_id="+ data)
}

/**
 * 
 * @param 用户接口
 * @returns 
 */

// 获取用户信息
export const getUserInfo = ():Res<ItypeAPI<any>>=>{
    return request.get("/user/info")
}

// 获取验证码
export const getVerifyCode = (data:{mobile:string}):Res<null>=>{
    return request.get("/user/send_sms",{params:data})
}

// 用户登陆
export const userLogin = (data:{mobile:string,vcode:string}):Res<null>=>{
    return request.get("/user/login",{params:data})
}

// 用户退出
export const userLogout = ():Res<null>=>{
    return request.get("/user/logout")
}

/**
 * 
 * @returns 节点接口
 */
export const getOutPort = ():Res<ItypeAPI<any>>=>{
    return request.get("/node/list")
}