<template>
  <div id="app">
    <div class="main">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style style="less">
@import "./assets/css/reset.less";
body{
  background-color: #f8f8ff;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
.main {
  height: auto;
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
