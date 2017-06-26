const showLoad = (state,status) => {
	state.hmLoad.status = status || 1;
};

const hideLoad = state => {
    state.hmLoad.status = false;
};

const showToast = (state,msg) => {
    state.hmToast.status = 1;
    state.hmToast.msg = msg;
};

const setToastTimer = (state,{fn}) => {
    clearTimeout(state.hmToast.timer);
    state.hmToast.timer = fn;
};

const hideToast = (state) => {
    state.hmToast.status = 2;
};

const setLicensePhoto = (state,photo) => {
    state.userInfo.license_photo = (photo == "http:\/\/ndms.9797168.com\/" || photo == "http:\/\/10.10.39.66:8081\/") ? '':photo;
};
const setUserAvatar = (state,avatar) => {
    state.userInfo.avatar = (avatar == "http:\/\/ndms.9797168.com\/" || avatar == "http:\/\/10.10.39.66:8081\/") ? '':avatar;
};

const nativeSetDrive_time = (state,time) => {
    state.carInfo.drive_time = time || 0;
};

const changeBg = (state,bg) => {
    state.driverBg = bg;
};
const changeTransition = (state,{name,mode}) => {
    if (name) {
        state.driverTransition.name = name;
    }
    if (mode) {
        state.driverTransition.mode = mode;
    }
};

const setPhoto = (state,type) => {
    state.hmPhoto.type = type;
};
const hidePhoto = (state) => {
    state.hmPhoto.isShow = false;
};
const showPhoto = (state) => {
    state.hmPhoto.isShow = true;
};

const setUserInfo = (state,payload) => {
    state.userInfo.license_photo = (payload.license_photo == "http:\/\/ndms.9797168.com\/" || payload.license_photo == "http:\/\/10.10.39.66:8081\/") ? '' : payload.license_photo;
    state.userInfo.avatar = (payload.avatar == "http:\/\/ndms.9797168.com\/" || payload.avatar == "http:\/\/10.10.39.66:8081\/") ? '' : payload.avatar;
    state.userInfo.mobile = payload.mobile;
    state.userInfo.cmp_name = payload.cmp_name;
    state.userInfo.cmp_id = payload.cid;
    state.userInfo.name = payload.name;
    state.userInfo.license = payload.license;
};
const setDeviceSN = (state,payload) => {
    state.deviceInfo.deviceMac = payload.deviceMac;
    state.deviceInfo.deviceSN = payload.deviceID || payload.deviceSN;
};
const setDeviceUsers = (state,payload) => {
    state.deviceInfo.all = payload.all || 0;
    state.deviceInfo.now = payload.now || 0;
};
const setGpsList = (state,list) => {
    state.deviceInfo.gpsList = list || [];
};

const setCarInfo = (state,payload) => {
    state.carInfo.plate_num = payload.plate_num;
    state.carInfo.plate_num2 = payload.plate_num;
    state.carInfo.cmp_name = payload.cmp_name;
    state.carInfo.cmp_id = payload.cmp_id;
    state.carInfo.mdriving_license_img = payload.mdriving_license_img;
};
const updatePlateNum = (state,value) => {
    state.carInfo.plate_num2 = value;
};

export {
    showLoad,
    hideLoad,
    showToast,
    setToastTimer,
    hideToast,
    setLicensePhoto,
    setUserAvatar,
    nativeSetDrive_time,
    changeBg,
    changeTransition,
    setUserInfo,
    setDeviceSN,
    setDeviceUsers,
    setGpsList,
    setCarInfo,
    setPhoto,
    hidePhoto,
    showPhoto,
    updatePlateNum
};