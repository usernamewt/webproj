<template>
  <div>
    <a-form>
      <a-result
        title="确认条款"
        :is-success="true"
        sub-title="预计两小时内到账"
        style="max-width: 560px; margin: 40px auto 0"
      >
        <div class="information">
          <a-row>
            <a-col :sm="8" :xs="24">法律条规:</a-col>
            <a-col :sm="16" :xs="24"
              ><a @click="confirmLigal = true">请确认法律条规</a></a-col
            >
          </a-row>
        </div>
      </a-result>
      <a-modal
        v-model:open="confirmLigal"
        title="Vertically centered modal dialog"
        centered
        @ok="confirmLigal = false"
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>

        <a-checkbox v-model:checked="confirmLigalc"
          >我已阅读并同意法律条规</a-checkbox
        >
      </a-modal>
      <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
        <a-button type="primary" @click="prevStep">上一步</a-button>
        <a-button style="margin-left: 8px" @click="toDeviceList">确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { message } from "ant-design-vue";
import { ref } from "vue";

const emits = defineEmits(["prevStep", "finish"]);
const confirmLigal = ref(false);
const confirmLigalc = ref(false);
const prevStep = () => {
  emits("prevStep");
};
const toDeviceList = () => {
  if (confirmLigalc.value) {
    emits("finish");
  } else {
    message.error("请确认法律条规");
  }
};
</script>
<style lang="less" scoped>
.information {
  line-height: 22px;

  .ant-row:not(:last-child) {
    margin-bottom: 24px;
  }
}
.money {
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 14px;
}
</style>
