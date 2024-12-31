<template>
  <MainContainer>
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
  </MainContainer>
</template>

<script lang="ts" setup>
import Step1 from "./Step1.vue";
import Step2 from "./Step2.vue";
import Step3 from "./Step3.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  addAccelerate,
  editEquipmentInfo,
  bindDevice,
} from "../../../api/user";
import router from "../../../router";
import { getStorage } from "../../../utils/storage";
import { useTestStore } from "../../../store";
import MainContainer from "../../MainContainer.vue";
import { message } from "ant-design-vue";
const route = useRoute();
const deviceBase = ref<any>();
const currentTab = ref(0);
const baseStore = useTestStore();

const device_sn = ref("");
const addParam = ref<any>();
onMounted(() => {
  device_sn.value = route.params.id as string;
  // getDevice();
});

const setDeviceMode = (mode: string) => {
  deviceBase.value = mode;
  nextStep();
};
// const getDevice = async () => {
//   const res = await getEquipmentInfo({
//     device_sn: route.params.id as string,
//   });
//   deviceBase.value = res.data;
// };

const setAddParam = (param: any) => {
  addParam.value = param;
  addParam.value.device_id = deviceBase.value.device_id;
  console.log(addParam.value);

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
  // console.log("添加加速资源");
  // console.log(addParam.value);

  // console.log("设置设备信息");
  // console.log(deviceBase.value);

  // console.log("绑定设备");
  // console.log({
  //   user_id: getStorage("uid"),
  //   device_sn: device_sn.value,
  // });
  let setDevice = await editEquipmentInfo(deviceBase.value);
  if (setDevice.code == 0) {
  }

  let bind = await bindDevice({
    user_id: getStorage("uid"),
    device_sn: device_sn.value,
  });
  if (bind.code == 0) {
  }

  // 加速资源绑定慢，直接跳转
  addAccelerate(addParam.value);
  message.success("绑定成功");
  router.push("/deviceList");
};
</script>

<style lang="less" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
</style>
