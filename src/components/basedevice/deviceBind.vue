<template></template>

<script lang="ts" setup>
import { message } from "ant-design-vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { getEquipmentInfo } from "../../api/user";
import router from "../../router";
const route = useRoute();
onMounted(() => {
  // 设备sn
  const sn = route.params.id as string;
  getEquipmentInfo({ device_sn: sn }).then((res: any) => {
    if (res.code === 0) {
      // 判断设备是否已绑定
      if (!res.data.user_id) {
        // 未绑定跳转到绑定页面
        router.push("/setting/" + sn);
      } else {
        router.push("/deviceList");
      }
    } else {
      message.error(res.msg);
    }
  });
});
</script>

<style lang="less" scoped></style>
