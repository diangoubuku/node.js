const api_pad = "/api/pad/"

const api_mom = "/api/monitor/"

// const api_server = "/system-server/"

const setTablesNameApi = api_pad + 'setTablesName';        //设置桌号
const userLoginApi = api_pad + 'login';        //pad登陆
const getSelfInfoApi = api_pad + "getSelfInfo"      //获取登录桌信息
const getSelfAwardListApi = api_pad + "getSelfAwardList"    //获取登录桌奖项
const confirmLotteryResultApi = api_pad + "confirmLotteryResult"        //提交
const getLangPadHomeApi = api_pad + "getLangPadHome"        //语系
const RePasswordApi = api_pad + "RePassword"      //更改密码

const momLoginApi = api_mom + "login"           //显示器登录
const momIndexApi = api_mom + "index"           //显示器首页

export default {
    setTablesNameApi,
    userLoginApi,
    getSelfInfoApi,
    getSelfAwardListApi,
    confirmLotteryResultApi,
    getLangPadHomeApi,
    RePasswordApi,


    momLoginApi,
    momIndexApi
}

