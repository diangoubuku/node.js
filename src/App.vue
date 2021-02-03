<template>
  <div id="app">
    <router-view/>  
    <!-- <my-socket v-if="HasMysocketCiew"/> -->
  </div>
</template>

<script>
// import MySocket from "./components/socket/MySocket";
export default {
  name: 'App',
  // components: {MySocket},
  data(){
      return{
      }
},
created() {

},
sockets:{
  // connect:function(){
  //   console.log(111)
  //   setTimeout(()=>{
  //     this.$socket.emit("sendMessage",{
  //       messageEvent: 'login',
  //       messageData: {
  //             Platform: "WebPc",
  //             UserType: "staff",
  //             Authorization: localStorage.getItem("logdata"),
  //             DeviceId: localStorage.getItem("deviceId")
  //           }
  //     })
  //   },2000)
  // },
  // newMessage:function(val){
  //   console.log(val)
  // },
  // disconnect:function(){
  //   console.log("777")
  // },
  // reconnect:function(){
  //   console.log(8888)
  // }
},
mounted(){
    document.addEventListener('touchstart', function (e) {
        self.moveY = e.targetTouches[0].pageY;
    })
    document.addEventListener('touchmove', function (e){
        e.preventDefault();
        let moveWidth = self.moveY - e.targetTouches[0].pageY;
        if (moveWidth !== 0) {
            document.body.scrollTop += moveWidth;
        }
    })
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    })
    if(!this.HasMysocketCiew()){
        this.$router.push("/")
    }
  },
methods:{
    HasMysocketCiew:function(){
        return localStorage.getItem("logdata") && localStorage.getItem("logdata").length>10
    },
},
watch:{
    
}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:100%;
  height:100%;
  /* margin-top: 60px; */
  background-color:rgba(245,245,245,1)
}
.rightTab{min-width:1000px;padding: 15px;height:100%}
.ml_200{margin-left:200px}
</style>
