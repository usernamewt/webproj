<script setup lang="ts">
// import MainContainer from './components/MainContainer.vue';
// 暂时不显示语言切换
// import language from "./components/layout/language.vue";
import MainContainer from "./components/MainContainer.vue";
import { useTestStore } from "./store";
const baseStore = useTestStore();
</script>

<template>
  <!-- <language /> -->
  <a-spin tip="Loading..." :spinning="baseStore.boxLoading">
    <MainContainer />
  </a-spin>
</template>

<style scoped lang="less">
.languages {
  position: fixed;
  top: 1vh;
  right: 4vw;
  z-index: 999;
}
</style>
