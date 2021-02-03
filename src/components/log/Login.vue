<template>
    <div id="login" class="p_relative">
        <div class="box d_iblock p_absolute" v-if="hasLogSupTable">
            <h3 class="t_center mb_14">{{gText[1]}}</h3>
            <div class="d_flex">
                <el-input placeholder="请输入桌号" v-model="tables_name" size="small" class="mb_14" @input="tables_name = tables_name.toUpperCase()" id="nameInput" readonly>
                    <i slot="prefix" class="el-input__icon el-icon-monitor"></i> 
                </el-input>
                <el-button type="danger" size="small" class="mb_14 cancleBindBtn" @click="cancleBtnCli">取消绑定</el-button>
            </div>
            <el-input placeholder="请输入员工卡号" v-model="name" size="small" class="mb_14" id="cardInput"> <!-- @input="name = name.toUpperCase()"-->
                <i slot="prefix" class="el-input__icon el-icon-user-solid"></i> 
            </el-input>
            <el-input placeholder="请输入密码" v-model="password" size="small" class="mb_14" type="password" id="passwordInput">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i> 
            </el-input>
            <el-button size="small" class="logBtn" id="logBtn" v-if="showloginBtn" @click="login">登陆</el-button>
            <el-button size="small" icon="el-icon-loading" class="logBtn" v-else>登陆</el-button>
            <p class="logoText">{{logoText}}</p>
        </div>
        <div class="box d_iblock p_absolute" v-else>
            <h3 class="t_center mb_14">{{gText[0]}}</h3>
            <el-input placeholder="请输入桌号" v-model="tables_name" size="small" class="mb_14" @input="tables_name = tables_name.toUpperCase()" id="nameInput1">
                <i slot="prefix" class="el-input__icon el-icon-monitor"></i> 
            </el-input>
            <el-input placeholder="请输入主管卡号" v-model="supName" size="small" class="mb_14" id="cardInput1"> <!-- @input="name = name.toUpperCase()"-->
                <i slot="prefix" class="el-input__icon el-icon-user-solid"></i> 
            </el-input>
            <el-input placeholder="请输入密码" v-model="supPassword" size="small" class="mb_14" type="password" id="passwordInput1">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i> 
            </el-input>
            <el-button size="small" class="logBtn" id="logBtn" v-if="showSupLoginBtn" @click="supLogin">登陆</el-button>
            <el-button size="small" icon="el-icon-loading" class="logBtn" v-else>登陆</el-button>
            <p class="logoText">{{logoText}}</p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            hasLogSupTable:false,
            tables_name:"",
            name:"",
            password:"",
            gText:["PAD端(桌号绑定)","PAD端(录数登入)"],
            logoText:"Version: 3.2.4 Develop",
            showloginBtn:true,
            user:1,
            supName:"",
            supPassword:"",
            showSupLoginBtn:true,
            fullLoading:null
        }
    },
    mounted(){
        var _this = this;
        var str = localStorage.getItem("cj_supTableLogUser")
        console.log("local",str)
        if(str == "" || str == null || str === undefined){
            this.hasLogSupTable = false;
        }else{
            var obj = JSON.parse(str);
            console.log(obj)
            this.tables_name = obj.tables_name;
            this.supName = obj.name;
            this.supPassword = obj.password;
            this.supLogin()
        }
        // nameInput.addEventListener("keydown",function(event){
        //     if(event.keyCode == '13'){
        //         if(this.hasLogSupTable){
        //             $("#cardInput").focus()
        //         }else{
        //             $("#cardInput1").focus()
        //         }
        //     }
        // })
        // cardInput.addEventListener("keydown",function(event){
        //     if(event.keyCode == '13'){
        //         if(this.hasLogSupTable){
        //             $("#passwordInput").focus()
        //         }else{
        //             $("#passwordInput1").focus()
        //         }
        //     }
        // })
        // passwordInput.addEventListener("keydown",function(event){
        //     if(event.keyCode == '13'){
        //         if(this.hasLogSupTable){
        //             _this.login()
        //         }else{
        //             _this.supLogin()
        //         }
        //     }
        // })
    },
    methods:{
        FullScreen(){
            var el = document.documentElement;
            var rfs = el.requestFullScreen || el.webkitRequestFullScreen || 
                el.mozRequestFullScreen || el.msRequestFullScreen;
            if(typeof rfs != "undefined" && rfs) {
                rfs.call(el);
            } else if(typeof window.ActiveXObject != "undefined") {
                //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
                var wscript = new ActiveXObject("WScript.Shell");
                if(wscript != null) {
                console.log(85666)
                    wscript.SendKeys("{F11}");
                }
            }
        },
        supLogin(){
            $("#nameInput1").focus()
            this.showSupLoginBtn = false;
            this.fullLoading = this.$loading({      //全屏遮罩
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            var params = {tables_name:this.tables_name,name:this.supName,password:this.supPassword}
            var str = JSON.stringify(params);
            this.$http.post(this.$Api.setTablesNameApi,params).then(
                (res)=>{
                    this.showSupLoginBtn = true;
                    if(res.data.code == 0){
                        this.hasLogSupTable = true;
                        localStorage.setItem("cj_supTableLogUser",str)
                    }
                    this.fullLoading.close();
                },
                (error)=>{
                    this.showSupLoginBtn = true;
                    this.fullLoading.close();
                }
            )
        },
        login(){
            $("#cardInput").focus();
            this.showloginBtn = false;
            // var deviceId = localStorage.getItem("deviceId")
            // if(deviceId == null || deviceId == "" || deviceId === undefined || deviceId.length < 20 || deviceId.length > 30){
            //     var str = this.randomString(20,30);
            //     localStorage.setItem("deviceId",str);
            //     deviceId = str;
            // }
            var params = {tables_name:this.tables_name,name:this.name,password:this.password}
            this.$http.post(this.$Api.userLoginApi,params).then(
                (res)=>{
                    this.showloginBtn = true;
                    if(res.data.code == 0){
                        // var logdata = res.data.data.tokenType + res.data.data.token
                        localStorage.setItem("logdata",res.data.data.accessToken)
                        // localStorage.setItem("userRole",res.data.data.role)
                        this.$router.push("/PadHome")
                        console.log("登陆成功",res)
                    }
                },
                (error)=>{
                    this.showloginBtn = true;
                    console.log(error)
                }
            )
        },
        cancleBtnCli(){
            localStorage.removeItem("cj_supTableLogUser");
            this.tables_name = "";
            this.supName = "";
            this.supPassword = "";
            this.hasLogSupTable=false
        },
        randomString(min,max){
            var arr = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
            var str ="";
            // 随机生成随机数位数
            var num = min + Math.ceil(Math.random() * Math.floor(max - min));
            for(var i=num;i>0;i--){
                var n = Math.ceil(Math.random() * (arr.length - 1))
                str += arr[n]
            }
            return str;
        }
    },
    watch:{},
    filters:{
        // showClass(val){
        //     console.log(222)
        //     if(val == 1){
        //         return "p_relative titView mb_14"
        //     }else{
        //         return "p_relative titView mb_14 active"
        //     }
        // }
    }
}
</script>
<style scoped>
#login{width:100%;height:100%;font-size: 14px;}
.box{width:280px;background-color:rgba(255,255,255,1);padding:36px;left:0;right:0;margin: auto;top: 30%;}
.logBtn{width:100%;height:32px;padding:5px 15px 6px;background-color:#2d8cf0;border: 1px solid transparent;border-radius:4px;color:#fff;margin-bottom:24px}
.logoText{color:rgba(88,88,88,.8);font-size:12px}
.mb_14{margin-bottom:14px}
.cancleBindBtn{min-width:100px;margin-left:10px}
/* .titView span:nth-child(1){background-color:#2d8cf0;color:#fff}
.titView span:nth-child(2){background-color:rgba(100,100,100,0.1);color:#000}
.titView.active span:nth-child(2){background-color:#2d8cf0;color:#fff}
.titView.active span:nth-child(1){background-color:rgba(100,100,100,0.1);color:#000} */
.titView span{width:50%;height:32px;line-height: 32px;}
</style>