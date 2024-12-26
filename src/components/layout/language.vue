<template>
  <div class="language-wrapper">
    <van-switch v-model="checked" @change="switchLang">
      <template #node>
        <div class="icon-wrapper">
          {{ checked ? "EN" : "中" }}
        </div>
      </template>
    </van-switch>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
let checked = ref(false);

import { useLocale } from "../../hooks/languageHook";

const { currentLocale, changeLocale } = useLocale();

const switchLang = async () => {
  const nextLocale = currentLocale.value === "zh-CN" ? "en-US" : "zh-CN";
  await changeLocale(nextLocale);
};
</script>

<style lang="less" scoped>
@media (max-width: 767px) {
  .language-wrapper {
    right: 10vw !important;
  }
}
.language-wrapper {
  height: 9vh;
  display: flex;
  position: fixed;
  top: 0;
  right: 5vw;
  align-items: center;
  z-index: 999;
}
.icon-wrapper {
  font-size: 0.5em;
  height: 2em;
  line-height: 2em;
  text-align: center;
  font-weight: bolder;
}
</style>
