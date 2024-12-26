<template>
  <page-header-wrapper>
    <!-- PageHeader 第二种使用方式 (v-slot) -->
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="选择工作模式" />
        <a-step title="填写加速资源" />
        <a-step title="条款确认" />
        <!-- <a-step title="完成" /> -->
      </a-steps>
      <div class="content">
        <step1 v-show="currentTab === 0" @nextStep="nextStep" />
        <step2
          v-show="currentTab === 1"
          @nextStep="nextStep"
          @prevStep="prevStep"
        />
        <step3
          v-show="currentTab === 2"
          @prevStep="prevStep"
          @finish="finish"
        />
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="ts" setup>
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { ref } from "vue";
const currentTab = ref(0);
const form = ref(null);
const nextStep = () => {
  if (currentTab.value < 2) {
    currentTab.value += 1;
  }
};
const prevStep = () => {
  if (currentTab.value > 0) {
    currentTab.value -= 1;
  }
};
const finish = () => {
  currentTab.value = 0;
};
</script>

<style lang="less" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
</style>
