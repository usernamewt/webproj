<template>
  <page-header-wrapper>
    <!-- PageHeader 第二种使用方式 (v-slot) -->
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="设备信息" />
        <a-step title="填写加速资源" />
        <a-step title="条款确认" />
        <!-- <a-step title="完成" /> -->
      </a-steps>
      <div class="content">
        <step1 v-show="currentTab === 0" @nextStep="setDeviceMode" />
        <step2
          v-show="currentTab === 1"
          @nextStep="setAddParam"
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
import Step1 from "./Step1.vue";
import Step2 from "./Step2.vue";
import Step3 from "./Step3.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  getEquipmentInfo,
  addAccelerate,
  editEquipmentInfo,
  bindDevice,
} from "../../../api/user";
import router from "../../../router";
import { getStorage } from "../../../utils/storage";
import { useTestStore } from "../../../store";
const route = useRoute();
const deviceBase = ref<any>();
const currentTab = ref(0);
const baseStore = useTestStore();

const device_sn = ref("");
const addParam = ref<any>();
onMounted(() => {
  device_sn.value = route.params.id as string;
  getDevice();
});

const setDeviceMode = (mode: string) => {
  deviceBase.value = mode;
  nextStep();
};
const getDevice = async () => {
  const res = await getEquipmentInfo({
    device_sn: route.params.id as string,
  });
  deviceBase.value = res.data;
};

const setAddParam = (param: any) => {
  addParam.value = param;
  nextStep();
};

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
const finish = async () => {
  baseStore.boxLoading = true;
  let addSource = await addAccelerate(addParam.value);
  if (addSource.code == 0) {
  }

  // 绑定设备信息
  let setDevice = await editEquipmentInfo(deviceBase.value);
  if (setDevice.code == 0) {
  }

  let bind = await bindDevice({
    user_id: getStorage("uid"),
    device_sn: device_sn.value,
  });
  if (bind.code == 0) {
  }
  baseStore.boxLoading = false;
  router.push("/user/equipment");
};
</script>

<style lang="less" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
</style>
