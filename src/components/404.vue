<template>
  <a-result
    status="404"
    title="404"
    sub-title="Sorry, the page you visited does not exist."
  >
    <template #extra>
      <a-button type="primary" @click="toList">返回首页</a-button>
    </template>
  </a-result>
</template>

<script lang="ts" setup>
const toList = () => {
  window.location.href = "/";
};
</script>

<style scoped></style>
