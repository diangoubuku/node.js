<template>
    <div class="padhome t_left">
        <el-dialog :title="padLangularObj[languageKey].PADHOME.lpad015" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" v-if="padLangularObj.lang_CN">
            <p class="mb_008 font_16"><i class="el-icon-warning warnColor font_18"></i>{{padLangularObj[languageKey].PADHOME.lpad014}}?</p>
            <div v-if="hasWinner">
                <div class="d_flex dialogBox p_relative font_16">
                    <span class="t_right">{{padLangularObj[languageKey].PADHOME.lpad026}}</span>
                    <el-input v-model="award_username" id="award_user_input" :placeholder="padLangularObj[[languageKey]].PADHOME.lpad027" @blur="isNullUser"></el-input>
                    <p class="p_absolute font_14 c_red infoView" v-if="userAwardInfo">{{padLangularObj[languageKey].PADHOME.lpad028}}</p>
                </div>
                <div class="d_flex dialogBox p_relative font_16">
                    <span class="t_right">{{padLangularObj[languageKey].PADHOME.lpad025}}</span>
                    <el-input v-model="award_password" id="award_pass_input" :placeholder="padLangularObj[languageKey].PADHOME.lpad018" @blur="isNullPass" type="password"></el-input>
                    <p class="p_absolute font_14 c_red infoView" v-if="passAwardInfo">{{padLangularObj[languageKey].PADHOME.lpad019}}</p>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" class="el-icon-close" @click="handleClose">{{padLangularObj[languageKey].PADHOME.lpad017}}</el-button>
                <el-button size="small" type="primary" class="el-icon-check" @click="confirmCli" :loading="confirmIng">{{padLangularObj[languageKey].PADHOME.lpad016}}</el-button>
            </span>
        </el-dialog>
        <p class="t_center titleText p_relative">
            <span v-if="padLangularObj.lang_CN && !isChangeSelfPass">{{padLangularObj[languageKey].PADTITLE.TITLE001}}</span>
            <span v-if="isChangeSelfPass">{{padLangularObj[languageKey].PADHOME.lpad031}}</span>
            <span class="languRadioBox us_none">
                <el-radio-group v-model="Language" @change="langularChange">
                    <el-radio :label="val" v-for="(val,keys) in Object.keys(LanguageArr)" :key="keys">{{LanguageArr[val]}}</el-radio>
                </el-radio-group>
            </span>
        </p>
        <div class="homeBox" v-if="!isChangeSelfPass">
            <div class="titleBox mb_004" v-if="padLangularObj.lang_CN">
                <span>{{padLangularObj[languageKey].PADHOME.lpad003}}:{{tabTextObj.card}}</span><br>
                <span>{{padLangularObj[languageKey].PADHOME.lpad002}}:{{tabTextObj.name}}</span>
                <div class="f_right">
                    <el-button size="small" type="warning" @click="isChangeSelfPass = true">{{padLangularObj[languageKey].PADHOME.lpad032}}</el-button>
                    <el-button size="small" type="danger" @click="logoutBtn">{{padLangularObj[languageKey].PADHOME.lpad004}}</el-button>
                </div>
            </div>
            <div class="osBtn mb_004" v-if="padLangularObj.lang_CN">
                <el-button size="small" type="primary" @click="openBetting">{{padLangularObj[languageKey].PADHOME.lpad005}}</el-button>
                <el-button size="small" type="info" @click="stopBetting" v-if="gameStatus != -1">{{padLangularObj[languageKey].PADHOME.lpad006}}</el-button>
            </div>
            <div class="tabBody mb_004">
                <el-table :header-cell-style="{background:'#DCDFE6',color:'#000'}" :data="tableData.value" border size="mini" style="width: 100%" v-loading="tabLoad" v-if="padLangularObj.lang_CN">
                    <el-table-column v-for="(item,index) of tableData.title" :key="index" :label="padLangularObj[languageKey].PADHOME[item.namekeys]" align="center" :min-width="item.id | filterWidth(tabTextObj.game)">
                        <template slot-scope="scope">
                            <div v-if="item.id === 'resu'">
                                <el-radio-group v-model="scope.row.choice" v-if="scope.row.resu.lang_CN">
                                    <el-radio :label="val" v-for="(val,keys) in Object.keys(scope.row.resu.lang_CN.award_type)" :key="'CN'+keys" :disabled="scope.row.balance | isDisabled(gameStatus)" @click.native.prevent="chosenRadio(val,scope.$index)">{{scope.row.resu[languageKey].award_type[val]}}</el-radio>
                                </el-radio-group>
                            </div>
                            <span v-if="item.id !== 'resu' && item.id != 'balance'">{{scope.row[item.id]}}</span>
                            <el-input size="mini" v-if="item.id == 'balance'" v-model="scope.row.balance" :disabled="gameStatus != 1" class="c_red"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="t_right">
                <el-button size="small" type="primary" v-if="gameStatus === 2 && padLangularObj.lang_CN" @click="open" style="width:0.6rem">{{padLangularObj[languageKey].PADHOME.lpad007}}</el-button>
            </div>
        </div>
        <div v-else class="pt_008 t_center">
            <div class="selfInfoBox">
                <el-form :model="selfInfoForm" label-width="120px">
                    <el-form-item :label="padLangularObj[languageKey].PADHOME.lpad003">
                        <!-- <el-input disabled :value="tabTextObj.name"></el-input> -->
                        <p class="t_left">{{tabTextObj.card}}</p>
                    </el-form-item>
                    <el-form-item :label="padLangularObj[languageKey].PADHOME.lpad033" class="p_relative">
                        <el-input v-model="selfInfoForm.oldPass" type="password" id="oldPassDom" @blur="verifiOldPass(selfInfoForm.oldPass)">
                        </el-input>
                        <span class="promptText">{{selfInfoForm.oldPassPrompt}}</span>
                    </el-form-item>
                    <el-form-item :label="padLangularObj[languageKey].PADHOME.lpad034" class="p_relative">
                        <el-input v-model="selfInfoForm.newPass" type="password" id="newPassDom" @blur="verifiNewPass(selfInfoForm.newPass)"></el-input>
                        <span class="promptText">{{selfInfoForm.newPassPrompt}}</span>
                    </el-form-item>
                    <el-form-item :label="padLangularObj[languageKey].PADHOME.lpad035" class="p_relative">
                        <el-input v-model="selfInfoForm.newPass1" type="password" id="newPassDom1" @blur="verifiNewPass1(selfInfoForm.newPass1)"></el-input>
                        <span class="promptText">{{selfInfoForm.newPassPrompt1}}</span>
                    </el-form-item>
                </el-form>
                <p class="t_right">
                    <el-button size="small" type="primary" @click="changePassConfirm" style="min-width:100px">{{padLangularObj[languageKey].PADHOME.lpad007}}</el-button>
                </p>
            </div>
            <p class="t_left">
                <el-button size="small" type="primary" @click="backHome">{{padLangularObj[languageKey].PADHOME.lpad036}}</el-button>
            </p>
        </div>
        <MySocket :gameStatus="gameStatus" @setBetNum="setBetNum"></MySocket>
    </div>
</template>
<script>
import { Loading } from 'element-ui';
import MySocket from "../socket/MySocket";
export default {
    components: {MySocket},
    data(){
        return{
            padLangularObj:{},
            loadingInstance:"",
            tableData:{
                title:[{id:"site",namekeys:"lpad008"},{id:"balance",namekeys:"lpad009"},{id:"resu",namekeys:"lpad010"}],
                value:[]
            },
            tabTextObj:{},
            gameStatus:-1,
            tabLoad:true,
            tableId:"",
            LanguageArr:[],
            Language:"CN",
            languageKey:"lang_CN",
            dialogVisible:false,
            award_username:"",
            award_password:"",
            userAwardInfo:false,
            passAwardInfo:false,
            hasBet:false,
            hasWinner:false,
            confirmPamars:{},
            confirmIng:false,
            isChangeSelfPass:false,
            selfInfoForm:{
                oldPass:"",
                newPass:"",
                newPass1:"",
                oldPassPrompt:"",
                newPassPrompt:"",
                newPassPrompt1:""
            }
        }
    },
    created(){
        this.loadingInstance = Loading.service({ fullscreen: true });
    },
    mounted(){
        this.getSelfInfo();         //获取登录桌信息
    },
    methods:{
        getSelfInfo(){
            var _this = this
            this.$http.get(this.$Api.getSelfInfoApi).then(
                (res)=>{
                    if(res.data.code === 0){
                        console.log(888,res)
                        var arr1 = [1,2,3,5,6,7,8];
                        var arr2 = [1,2,3,5,6];
                        var arr = []
                        if(res.data.data.game == 'nn'){
                            arr2.forEach((val)=>{
                                arr.push({site:val,balance:"",choice:0,resu:[]})
                            })
                        }else{
                            arr1.forEach((val)=>{
                                arr.push({site:val,balance:"",choice:0,resu:[]})
                            })
                        }
                        _this.tableData.value = [...arr]
                        _this.tabTextObj = res.data.data
                        // this.getSelfAwardList();    //获取登录桌奖项
                        this.getLangPadHome();
                    }
                    _this.loadingInstance.close()
                },
                (error)=>{
                    console.log(error);
                    _this.loadingInstance.close()
                }
            )
        },
        getLangPadHome(){
            var params = {game:this.tabTextObj.game}
            this.$http.post(this.$Api.getLangPadHomeApi,params).then(
                (res)=>{
                    console.log("语系",res)
                    if(res.data.code === 0){
                        console.log(222,res.data.data)
                        this.padLangularObj = res.data.data;
                        this.LanguageArr = res.data.data.lang_CN.language;
                        this.tableData.value.forEach((elem) => {
                            elem.resu = JSON.parse(JSON.stringify(res.data.data));
                        });
                        this.tabLoad = false
                    }
                },
                (error)=>{
                    console.log(error)
                }
            )
        },
        langularChange(val){
            console.log(888,val)
            if(this.Language == "CN"){
                this.languageKey = "lang_CN";
            }else if(this.Language == "KH"){
                this.languageKey = "lang_KH";
            }else if(this.Language == "US"){
                this.languageKey = "lang_EN";
            }
        },
        // getSelfAwardList(){
        //     this.$http.get(this.$Api.getSelfAwardListApi).then(
        //         (res)=>{
        //             if(res.data.code === 0){
        //                 console.log(222,res.data.data)
        //                 this.tableData.value.forEach((elem) => {
        //                     elem.resu = JSON.parse(JSON.stringify(res.data.data));
        //                 });
        //                 this.tabLoad = false
        //             }
        //         },
        //         (error)=>{
        //             console.log(error)
        //         }
        //     )
        // },
        handleClose(){
            var str = this.padLangularObj[this.languageKey].PADHOME.lpad022;
            this.$message({
                type: 'info',
                message: str,
            });
            this.dialogVisible = false
        },
        isNullUser(){
            if(this.award_username.length == 0){
                this.userAwardInfo = true;
            }else{
                this.userAwardInfo = false;
            }
        },
        isNullPass(){
            if(this.award_password.length == 0){
                this.passAwardInfo = true;
            }else{
                this.passAwardInfo = false;
            }
        },
        openBetting(){
            var _this = this;
            // var str = this.Language == "CN" ? "lang_CN" : (this.Language == "KH" ? "lang_KH" : "lang_EN");
            var str1 = this.padLangularObj[this.languageKey].PADHOME.lpad011;
            var str2 = this.padLangularObj[this.languageKey].PADHOME.lpad012;
            if(this.gameStatus == -1){
                this.gameStatus = 1
            }else if(this.gameStatus == 1){
                this.$message({
                    type: 'info',
                    message: str1,
                }); 
            }else if(this.gameStatus == 2){
                this.$message({
                    type: 'info',
                    message: str2,
                }); 
            }
        },
        stopBetting(){
            var _this = this;
            // var str = this.Language == "CN" ? "lang_CN" : (this.Language == "KH" ? "lang_KH" : "lang_EN");
            var str1 = this.padLangularObj[this.languageKey].PADHOME.lpad013;
            if(this.gameStatus == 2){
                this.$message({
                    type: 'info',
                    message: str1,
                }); 
            }else{
                this.gameStatus = 2
            }
        },
        chosenRadio(val,i){
            if(this.gameStatus == 2){
                if(this.tableData.value[i].choice === val){
                    this.tableData.value[i].choice = 0
                }else{
                    if(this.tabTextObj.game == "bjr"){
                        this.tableData.value.forEach((item)=>{
                            if(item.choice != val){
                                item.choice = 0
                            }
                        })
                    }
                    this.tableData.value[i].choice = val;
                }
            }
        },
        open() {
            var _this = this;
            this.award_username = "";
            this.award_password = "";
            this.userAwardInfo = false;
            this.passAwardInfo = false;
            var arr = [];
            this.hasBet = false;
            this.hasWinner = false;
            this.tableData.value.forEach((val)=>{
                if(val.balance > 0){
                    var obj = {site:val.site,award_type_id:val.choice};
                    arr.push(obj)
                    _this.hasBet = true;
                    if(val.choice !== 0){
                        _this.hasWinner = true;
                    }
                }
            })
            this.confirmPamars = arr;
            this.dialogVisible = true
        },
        confirmCli(){
            var _this = this;
            this.confirmIng = true;
            // var item = this.Language == "CN" ? "lang_CN" : (this.Language == "KH" ? "lang_KH" : "lang_EN");
            if(this.hasBet){
                var NowTime = this.getTime();
                var form_token = NowTime + "-" + _this.tabTextObj.id;
                var params;
                if(this.hasWinner){
                    if(this.award_username == "" || this.award_username == null || this.award_username === undefined){
                        $("#award_user_input").focus();
                        this.confirmIng = false;
                    }else if(this.award_password == "" || this.award_password == null || this.award_password === undefined){
                        $("#award_pass_input").focus();
                        this.confirmIng = false;
                    }else{
                        params = {data:this.confirmPamars,form_token,award_username:this.award_username,award_password:this.award_password};
                        this.postConfirmLotteryResultApi(params);
                    }
                }else{
                    params = {data:this.confirmPamars,form_token};
                    this.postConfirmLotteryResultApi(params);
                }
            }else{
                _this.$message({
                    type: 'info',
                    message: _this.padLangularObj[_this.languageKey].PADHOME.lpad023,
                });  
                this.gameStatus = -1;
                this.confirmIng = false;
                this.dialogVisible = false;
            }
        },
        postConfirmLotteryResultApi(params){
            var _this = this;
            // var item = this.Language == "CN" ? "lang_CN" : (this.Language == "KH" ? "lang_KH" : "lang_EN");
            this.$http.post(_this.$Api.confirmLotteryResultApi,params).then(
                    (res)=>{
                        console.log(999,res)
                        if(res.data.code == 0){
                            _this.$message({
                                type: 'success',
                                message: _this.padLangularObj[_this.languageKey].PADHOME.lpad020,
                            });
                            this.gameStatus = -1
                            this.tableData.value.forEach((str,ii)=>{
                                str.balance = ""
                                str.choice = 0
                            })
                            this.dialogVisible = false;
                            console.log(5555,this.tableData.value)
                        }
                        _this.confirmIng = false;
                    },
                    (error)=>{
                        _this.confirmIng = false;
                        consoel.log(error)
                    },
                )
        },
        getTime(){
            var myDate = new Date();
            var NowTime = myDate.getYear().toString() + myDate.getFullYear() + (myDate.getMonth() + 1) + myDate.getDate() + myDate.getHours() + myDate.getMinutes() + myDate.getSeconds();
            return NowTime;
        },
        logoutBtn(){
            var _this = this;
            // var str = this.Language == "CN" ? "lang_CN" : (this.Language == "KH" ? "lang_KH" : "lang_EN");
            var propmptTxet1 = this.padLangularObj[this.languageKey].PADHOME.lpad024;
            var propmptTxet2 = this.padLangularObj[this.languageKey].PADHOME.lpad015;
            var btnText1 = this.padLangularObj[this.languageKey].PADHOME.lpad016;
            var btnText2 = this.padLangularObj[this.languageKey].PADHOME.lpad017;
            var cancelText = this.padLangularObj[this.languageKey].PADHOME.lpad022;
            this.$confirm(propmptTxet1, propmptTxet2, {
                confirmButtonText: `\u00A0\u00A0${btnText1}\u00A0\u00A0`,
                cancelButtonText: `\u00A0\u00A0\u00A0${btnText2}\u00A0\u00A0\u00A0`,
                type: 'warning',
                customClass: 'font_16'
            }).then(() => {
                localStorage.removeItem("logdata");
                this.$router.push("/login")
            }).catch(() => {
                console.log(8855)
                _this.$message({
                    type: 'info',
                    message: cancelText,
                });          
            });
        },
        setBetNum(str){
            console.log("下注",str)
            if(this.gameStatus == 1){
                this.tableData.value.forEach((val)=>{
                    if(val.site == Number(str)){
                        val.balance = 1;
                    }
                })

            }
        },
        backHome(){
            var _this = this;
            Object.keys(_this.selfInfoForm).forEach((val)=>{
                _this.selfInfoForm[val] = ""
            })
            this.isChangeSelfPass = false
        },
        changePassConfirm(){
            var _this = this;
            if(this.selfInfoForm.oldPass == ""){
                $("#oldPassDom").focus();
            }else if(this.selfInfoForm.newPass == ""){
                $("#newPassDom").focus();
            }else if(this.selfInfoForm.newPass == ""){
                $("#newPassDom1").focus();
            }else if(this.selfInfoForm.newPass != this.selfInfoForm.newPass1){
                $("#newPassDom1").focus();
            }else{
                var propmptTxet1 = this.padLangularObj[this.languageKey].PADHOME.lpad014;
                var propmptTxet2 = this.padLangularObj[this.languageKey].PADHOME.lpad015;
                var btnText1 = this.padLangularObj[this.languageKey].PADHOME.lpad016;
                var btnText2 = this.padLangularObj[this.languageKey].PADHOME.lpad017;
                var cancelText = this.padLangularObj[this.languageKey].PADHOME.lpad022;
                var successText = this.padLangularObj[this.languageKey].PADHOME.lpad020;
                this.$confirm(propmptTxet1, propmptTxet2, {
                    confirmButtonText: `\u00A0\u00A0${btnText1}\u00A0\u00A0`,
                    cancelButtonText: `\u00A0\u00A0\u00A0${btnText2}\u00A0\u00A0\u00A0`,
                    type: 'warning',
                    customClass: 'font_16'
                }).then(() => {
                    var params = {password:_this.selfInfoForm.oldPass,password_new:_this.selfInfoForm.newPass}
                    _this.$http.post(_this.$Api.RePasswordApi,params).then(
                        (res)=>{
                            console.log("提交更新密码",res)
                            if(res.data.code == 0){
                                _this.backHome()
                                _this.$message({
                                    type: 'success',
                                    message: successText,
                                }); 
                            }
                        },
                        (error)=>{
                            console.log(error)
                        }
                    )
                }).catch(() => {
                    console.log(8855)
                    _this.$message({
                        type: 'info',
                        message: cancelText,
                    });          
                });
            }
        },
        verifiOldPass(val){        //原始密码非空验证
            if(val == ""){
                this.selfInfoForm.oldPassPrompt = this.padLangularObj[this.languageKey].PADHOME.lpad037;;
            }else{
                this.selfInfoForm.oldPassPrompt = "";
            }
        },
        verifiNewPass(val){        //新密码非空验证
            if(val == ""){
                this.selfInfoForm.newPassPrompt = this.padLangularObj[this.languageKey].PADHOME.lpad038;
            }else{
                this.selfInfoForm.newPassPrompt = "";
            }
        },
        verifiNewPass1(val){        //重复新密码非空验证
            if(val == ""){
                this.selfInfoForm.newPassPrompt1 = this.padLangularObj[this.languageKey].PADHOME.lpad039;
            }else if(val != this.selfInfoForm.newPass){
                console.log("重复新密码不一致",11,val,22,this.selfInfoForm.newPass)
                this.selfInfoForm.newPassPrompt1 = this.padLangularObj[this.languageKey].PADHOME.lpad040;
            }else{
                this.selfInfoForm.newPassPrompt1 = "";
            }
        },
    },
    filters:{
        filterWidth(val,str){
            if(val == "site"){
                return '80'
            }else if(val == "balance"){
                return '100'
            }else if(val == "resu"){
                if(str == "bjr"){
                    return '780'
                }else{
                    return '640'
                }
            }
        },
        isDisabled(num,val){
            if(num > 0){
                if(val === 2){
                    return false
                }else{
                    return true
                }
            }else{
                return true
            }
        },
        filterText(str1,str2,str3,val){
            if(val == "CN"){
                return str1
            }else if(val == "KH"){
                return str2
            }else if(val == "US"){
                return str3
            }
        }
    }
}
</script>
<style scoped>
.padhome{font-size:16px;padding:0.1rem 0.3rem}
.languRadioBox{position:absolute;left:0;line-height: 30px;}
.titleText{font-size:22px;line-height:30px}
.titleBox{line-height: 32px;}
/* .titleBox button{margin-right:0.4rem} */
.mb_004{margin-bottom:0.04rem}
.mb_008{margin-bottom:0.08rem}
.mr_008{margin-right:0.08rem}
.pt_008{padding-top:0.08rem}
.us_none{
    -moz-user-select:none; /* Firefox私有属性 */
    -webkit-user-select:none; /* WebKit内核私有属性 */
    -ms-user-select:none; /* IE私有属性(IE10及以后) */
    -khtml-user-select:none; /* KHTML内核私有属性 */
    -o-user-select:none; /* Opera私有属性 */
    user-select:none; /* CSS3属性 */
}
.font_16{font-size:16px}
.font_14{font-size:14px}
.font_18{font-size:18px}
.dialogBox{padding-bottom:22px}
.dialogBox span{min-width:100px;margin-right:10px;line-height: 40px;}
.dialogBox .infoView{bottom:4px;left:110px}
.warnColor{color:#E6A23C}
.selfInfoBox{display: inline-block;margin:0 auto;width:360px;}
.promptText{position:absolute;left:0;top:40px;color:#f00;font-size:14px;line-height:22px}
</style>