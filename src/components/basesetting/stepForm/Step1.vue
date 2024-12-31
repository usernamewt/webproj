<template>
  <div>
    <a-form
      ref="formRef"
      :model="form"
      style="max-width: 500px; margin: 40px auto 0"
      :rules="rules"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-form-item ref="name" label="设备名称" name="device_name">
        <a-input v-model:value="form.device_name" />
      </a-form-item>
      <a-form-item label="ip地址" name="ip_address">
        <a-input v-model:value="form.ip_address" />
      </a-form-item>
      <a-form-item label="防火墙版本" name="firmware_version">
        <a-input v-model:value="form.firmware_version" />
      </a-form-item>
      <a-form-item label="地址" name="location">
        <a-input v-model:value="form.location" />
      </a-form-item>
      <a-form-item label="工作模式" name="device_mode">
        <a-radio-group v-model:value="form.device_mode" button-style="solid">
          <a-radio-button value="Bridge">Bridge</a-radio-button>
          <a-radio-button value="Router">Router</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 19, offset: 5 }">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
    <div class="step-form-style-desc">
      <h3>说明</h3>
      <h4>工作模式</h4>
      <p>
        如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
      </p>
      <h4>url</h4>
      <p>
        如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, UnwrapRef, ref, onMounted } from "vue";
import type { Rule } from "ant-design-vue/es/form";
interface FormState {
  device_mode: string;
  device_name: string;
  ip_address: string;
  firmware_version: string;
  location: string;
  device_id: string;
}
import { getEquipmentInfo } from "../../../api/user";
import { useRoute } from "vue-router";
const route = useRoute();
let labelCol = ref({ lg: { span: 5 }, sm: { span: 5 } });
let wrapperCol = ref({ lg: { span: 19 }, sm: { span: 19 } });
let formRef = ref();
onMounted(() => {
  initDevice();
});

const initDevice = async () => {
  const res: any = await getEquipmentInfo({
    device_sn: route.params.id as string,
  });
  form.device_name = res.data.device_name;
  form.ip_address = res.data.ip_address;
  form.firmware_version = res.data.firmware_version;
  form.location = res.data.location;
  form.device_mode = res.data.mode;
  form.device_id = res.data.id;
};
const emits = defineEmits(["nextStep"]);
const rules: Record<string, Rule[]> = {
  device_mode: [
    { required: true, message: "请选择工作模式", trigger: "change" },
  ],
  device_name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
  ip_address: [{ required: true, message: "请输入ip地址", trigger: "blur" }],
  firmware_version: [
    { required: true, message: "请输入防火墙版本", trigger: "blur" },
  ],
  location: [{ required: true, message: "请输入地址", trigger: "blur" }],
};
const form: UnwrapRef<FormState> = reactive({
  device_mode: "Bridge",
  device_name: "",
  ip_address: "",
  firmware_version: "",
  location: "",
  device_id: "",
});
const nextStep = () => {
  formRef
    .value!.validate()
    .then(() => {
      emits("nextStep", form);
    })
    .catch(() => {});
};
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0, 0, 0, 0.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
