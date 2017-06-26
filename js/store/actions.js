const querystring = require('querystring');

import errcode from "errcode";
import {getN} from "nativeA";
import {URL_GETINFO,URL_USERS} from "device";
import {USERINFO,GETVEL,EDITINFO} from "inter";

var BASEINFO = getN('getBase');

const toast = ({commit},payload) => {
    var msg,time;
    if (typeof payload == "object") {
        msg = payload.msg;
        time = payload.time;
    }else{
        msg = payload;
    }
    commit("showToast",msg);
    commit({
        type: "setToastTimer",
        fn: setTimeout(()=>commit("hideToast"),time||2000)
    });
};

const setUserInfoAsync = ({dispatch,commit}) => {
    fetch(`${BASEINFO.host}${USERINFO}?uid=${BASEINFO.uid}&access_token=${BASEINFO.access_token}&format=json`,{
            cache: "no-cache"   
        })
            .then(response=>response.json())
            .then(message=>{
                if (message.code == 0) {
                    commit('setUserInfo',message.data);
                }else{
                    dispatch('toast',message.message);
                }
            })
            .catch(e=>{
                console.log(e);
                dispatch('toast',errcode.m404);
            });
};


const nativeSetPhoto = ({dispatch,commit,state},payload) => {
    if (payload.type==2) {
        // 用户感觉快 比实际快更重要
        const lastAvatar = state.userInfo.avatar;
        commit("setUserAvatar",payload.link);
        fetch(BASEINFO.host+EDITINFO,{
            method: "POST",
            mode: "cors",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: querystring.stringify({
                format: "json",
                access_token: BASEINFO.access_token,
                token: BASEINFO.token,
                uid: BASEINFO.uid,
                avatar: payload.link,
                type: 2
            })
        })
            .then(response=>response.json())
            .then(message=>{
                if (message.code!=0) {
                    dispatch('toast',message.message);
                    commit("setUserAvatar",lastAvatar);
                }
            })
            .catch(e=>{
                console.log(e);
                dispatch('toast',errcode.m404);
                commit("setUserAvatar",lastAvatar);
            });

    } else {
        commit("setLicensePhoto",payload.link);
    }


    
};

const setDeviceSNAsync = ({dispatch,commit},payload) => {
    fetch(URL_GETINFO)
        .then(response=>response.json())
        .then(message=>{
            commit("setDeviceSN",message);
            payload && payload.cb && payload.cb();
        })
        .catch(e=>{
            console.log(e);
            dispatch('toast',errcode.device);
        });
};
const setDeviceUsersAsync = ({dispatch,commit}) => {
    if (getN('wifi').wangfan != 1) {
        commit("setDeviceUsers",{all:0,now:0});
    }else{
        fetch(URL_USERS)
            .then(response=>response.json())
            .then(message=>{
                commit("setDeviceUsers",message);
            })
            .catch(e=>{
                console.log(e);
                dispatch('toast',errcode.device);
            });
    }
};

const setCarInfoAsync = ({dispatch,commit,state}) => {
    fetch(`${BASEINFO.host}${GETVEL}`,{
        method: "POST",
        mode: "cors",
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: querystring.stringify({
            format: "json",
            equ_sn: state.deviceInfo.deviceSN,
            access_token: BASEINFO.access_token
        })
    })
        .then(response=>response.json())
        .then(message=>{
            if (message.code==0) {
                commit("setCarInfo",message.data);
            }else{
                dispatch("toast",message.message);
            }
        })
        .catch(e=>{
            console.log(e);
            dispatch('toast',errcode.device);
        });
};

const setUserCar = ({dispatch}) => {
    if (getN('wifi').wangfan != 1) {
        dispatch("toast", errcode.device);
    }else{
        dispatch("setDeviceSNAsync",{
            cb: ()=>dispatch("setCarInfoAsync")
        });
    }
};


export {
    toast,
    setUserInfoAsync,
    setDeviceSNAsync,
    setDeviceUsersAsync,
    setCarInfoAsync,
    setUserCar,
    nativeSetPhoto
};