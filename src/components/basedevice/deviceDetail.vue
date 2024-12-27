<template>
  <a-form
    style="background-color: #fff; padding: 40px; border-radius: 20px"
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item ref="name" label="设备名称" name="device_name">
      <a-input v-model:value="formState.device_name" />
    </a-form-item>
    <a-form-item label="ip地址" name="ip_address">
      <a-input v-model:value="formState.ip_address" />
    </a-form-item>
    <a-form-item label="防火墙版本" name="firmware_version">
      <a-input v-model:value="formState.firmware_version" />
    </a-form-item>
    <a-form-item label="地址" name="location">
      <a-input v-model:value="formState.location" />
    </a-form-item>
    <a-form-item label="模式" name="device_mode">
      <!-- <a-input v-model:value="formState.device_mode" /> -->
      <a-radio-group v-model:value="formState.device_mode" button-style="solid">
        <a-radio-button value="Bridge">Bridge</a-radio-button>
        <a-radio-button value="Router">Router</a-radio-button>
      </a-radio-group>
      <!-- Bridge  /  Router -->
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="backtoList">返回</a-button>
      <a-button style="margin-left: 10px" @click="onSubmit">确认</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import type { UnwrapRef } from "vue";
import type { Rule } from "ant-design-vue/es/form";
import { useRoute } from "vue-router";
import router from "../../router";
import { getEquipmentInfo, editEquipmentInfo } from "../../api/user";
import { message } from "ant-design-vue";
let routes = useRoute();
onMounted(() => {
  getEquipmentInfo({ device_id: routes.params.id as string }).then(
    (res: any) => {
      formState.device_name = res.data.device_name;
      formState.ip_address = res.data.ip_address;
      formState.firmware_version = res.data.firmware_version;
      formState.location = res.data.location;
      formState.device_mode = res.data.mode;
    }
  );
});

interface FormState {
  device_name: string;
  ip_address: string;
  firmware_version: string;
  location: string;
  device_mode: string;
}
const formRef = ref();
const labelCol = { span: 5 };
const wrapperCol = { span: 13 };

const formState: UnwrapRef<FormState> = reactive({
  device_name: "",
  ip_address: "",
  firmware_version: "",
  location: "",
  device_mode: "",
});
const rules: Record<string, Rule[]> = {
  device_name: [
    {
      required: true,
      message: "请输入设备名称",
      trigger: "change",
    },
  ],
  ip_address: [
    {
      required: true,
      message: "请输入ip地址",
      trigger: "change",
    },
  ],
  firmware_version: [
    {
      required: true,
      message: "请输入防火墙类型",
      trigger: "change",
    },
  ],
  location: [{ required: true, message: "请输入设备地址", trigger: "blur" }],
  device_mode: [{ required: true, message: "请输入模式", trigger: "blur" }],
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      editEquipmentInfo({
        ...formState,
        device_id: routes.params.id as string,
      }).then((res: any) => {
        if (res.code === 0) {
          message.success("修改成功");
          backtoList();
        } else {
          message.error(res.msg);
        }
      });
    })
    .catch(() => {});
};

const backtoList = () => {
  router.push("/deviceList");
};
</script>
