<template>
  <div>
    <a-form>
      <a-result
        title="操作成功"
        :is-success="true"
        sub-title="预计两小时内到账"
        style="max-width: 560px; margin: 40px auto 0"
      >
        <div class="information">
          <a-row>
            <a-col :sm="8" :xs="24">法律条规:</a-col>
            <a-col :sm="16" :xs="24">ant-design@alipay.com</a-col>
          </a-row>
        </div>
        <template #extra>
          <a-button type="primary" @click="prevStep">上一步</a-button>
          <a-button style="margin-left: 8px" @click="toDeviceList"
            >确定</a-button
          >
        </template>
      </a-result>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(["prevStep", "nextStep"]);
const prevStep = () => {
  emits("prevStep");
};
const toDeviceList = () => {
  emits("nextStep");
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
