<template>
  <div></div>
</template>
<script>
  import Base64 from 'js-base64'

  export default {
    name: 'MySocket',
    components: {Base64},
    props:["gameStatus"],
    data: function () {
        return {
          websock: null,
          timeoutObj:null,
          serverTimeoutObj:null,
          reconnectData:null,
          lockReconnect:false,    //避免重复连接，因为onerror之后会立即触发 onclose
          timeout:5000,          //5s一次心跳检测
        }
    },
    created(){
        this.initWebSocket();
    },
    mounted: function () {

    },
    watch:{
        gameStatus(){
            console.log(9999,this.gameStatus)
            var str;
            if(this.gameStatus == -1){  //已提交
                str = ""
            }else if(this.gameStatus == 1){   //开始下注
                str = "pad_reset"
                this.websocketsend({event:str})
            }else if(this.gameStatus == 2){     //停止下注

            }
            // this.websocketsend()
        }
    },
    methods: {
        initWebSocket(){
            console.log('启动中')
            let wsurl = 'ws://192.168.2.163:81?api_token=Bearer ' + localStorage.getItem("logdata");
            this.websock = new WebSocket(wsurl);
            this.websock.onopen = this.websocketonopen;          //连接成功
            this.websock.onmessage = this.websocketonmessage;    //广播成功
            this.websock.onerror = this.websocketonerror;        //连接断开，失败
            this.websock.onclose = this.websocketclose;          //连接关闭
        },             //初始化weosocket
        websocketonopen(){
            console.log('连接成功')
            this.heatBeat();
        },           //连接成功
        websocketonerror(){
            console.log('连接失败')
            this.reconnect();
        },          //连接失败
        websocketclose(){
            console.log('断开连接');
            this.reconnect();
        },            //各种问题导致的 连接关闭
        websocketonmessage(val){
            console.log(777,val.data)
            var msgData = JSON.parse(val.data);
            if(msgData.event == "device_post"){
                console.log(msgData,msgData.data)
                var msgData1 = JSON.parse(msgData.data);
                this.$emit("setBetNum",msgData1.site)
            }
            this.heatBeat();      //收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
            // let msgData = JSON.parse(val.data);
            // if(msgData.event == 'award'){
            //     $("#videoBox").css("z-index","999")
            //     $("#videoBox")[0].play()
            //     var arr = []
            //     JSON.parse(msgData.data).forEach((elem) => {
            //         elem.award.forEach((str)=>{
            //             var obj = {game:elem.game,site:elem.site,tableId:elem.tableId,tableName:elem.tableName,...str};
            //             arr.push(obj)
            //         })
            //     });
            //     this.tableData.value = [...arr]
            // }else{
              
            // }
        },    //数据接收
        websocketsend(data){
            console.log(888,data)
            this.websock.send(JSON.stringify(data));
        },         //数据发送
        reconnect(){
            if(this.lockReconnect){       //这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
                return
            }
            this.lockReconnect = true;
            this.reconnectData && clearTimeout(this.reconnectData);
            this.reconnectData = setTimeout(()=>{
                this.initWebSocket();
                this.lockReconnect = false;
            },5000)
        },                 //socket重连
        heatBeat(){
            this.timeoutObj && clearTimeout(this.timeoutObj);
            this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
            this.timeoutObj = setTimeout(()=>{
              console.log(666)
                this.websocketsend({event:'ping'})   //根据后台要求发送
                // this.websocketsend({event:'award'})   //根据后台要求发送
                this.serverTimeoutObj = setTimeout(()=> {
                  console.log(445)
                    this.websock.close();       //如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
                }, 5000);
            }, this.timeout)
        },                  //心跳检测
    },
    beforeDestroy(){
        this.websock.close()                   //离开路由之后断开websocket连接
        this.lockReconnect = true;
        // this.reconnectData && clearTimeout(this.reconnectData);
        clearTimeout(this.reconnectData);      //离开清除 timeout
        clearTimeout(this.timeoutObj);         //离开清除 timeout
        clearTimeout(this.serverTimeoutObj);   //离开清除 timeout
    },
    destroyed() {
    }
  }
</script>
<style scoped>

</style>
