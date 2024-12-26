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
      <a-form-item label="工作模式" name="mode">
        <a-radio-group v-model:value="form.mode" button-style="solid">
          <a-radio value="a">路由模式</a-radio>
          <a-radio value="b">透明模式</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 19, offset: 5 }">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
    <a-divider />
    <div class="step-form-style-desc">
      <h3>说明</h3>
      <h4>转账到支付宝账户</h4>
      <p>
        如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
      </p>
      <h4>转账到银行卡</h4>
      <p>
        如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, UnwrapRef, ref } from "vue";
import type { Rule } from "ant-design-vue/es/form";
interface FormState {
  mode: string;
}
let labelCol = ref({ lg: { span: 5 }, sm: { span: 5 } });
let wrapperCol = ref({ lg: { span: 19 }, sm: { span: 19 } });
let formRef = ref();
const emits = defineEmits(["nextStep"]);
const rules: Record<string, Rule[]> = {
  mode: [{ required: true, message: "请选择工作模式", trigger: "change" }],
};
const form: UnwrapRef<FormState> = reactive({
  mode: "a",
});
const nextStep = () => {
  formRef
    .value!.validate()
    .then(() => {
      emits("nextStep", form);
    })
    .catch(() => {
      console.log("error");
    });
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
