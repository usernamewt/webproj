<template>
  <div class="header">
    <div class="title" v-if="type === 'equipmentlist'">
      <LeftOutlined
        v-if="
          !(route.path.includes('deviceList') || route.path.includes('setting'))
        "
        @click="toList"
      />
      {{ header }}
    </div>
    <div class="title" v-else>
      <span style="font-weight: bolder">{{ baseStore.deviceLocation }}</span>
    </div>
    <LogoutOutlined class="logout" @click="logout" />
  </div>
</template>

<!-- v-show="
          baseStore.header != '设备列表' && baseStore.header != '设备绑定'
        " -->

<script lang="ts" setup>
import { watch, ref, onMounted } from "vue";
import { useLocale } from "../../hooks/languageHook";
import { useTestStore } from "../../store";
import { LogoutOutlined, LeftOutlined } from "@ant-design/icons-vue";
import { userLogout } from "../../api/user";
import router from "../../router";
import { useRoute } from "vue-router";
import { removeToken } from "../../utils/auth";
import { message } from "ant-design-vue";
const { t } = useLocale();
const route = useRoute();
const baseStore = useTestStore();
const header = ref("设备列表");
const type = ref("equipmentlist");
const toList = () => {
  router.push("/deviceList");
};
onMounted(() => {});
watch(
  route,
  (nroute) => {
    if (nroute.path.includes("/sourceAdd")) {
      header.value = "资源添加";
    } else if (nroute.path.includes("/sourceList")) {
      header.value = "资源库";
    } else if (nroute.path.includes("/deviceList")) {
      header.value = "设备列表";
    } else if (nroute.path.includes("/setting")) {
      header.value = "设备绑定";
    } else if (nroute.path.includes("/deviceDetail")) {
      header.value = "设备编辑";
    } else if (nroute.path.includes("/setting")) {
      header.value = "设备绑定";
    } else {
      header.value = "404";
    }
  },
  { immediate: true, deep: true }
);

const logout = () => {
  userLogout().then((res: any) => {
    if (res.code === 0) {
      localStorage.removeItem("userInfo");
      removeToken();
      router.push("/login");
    } else {
      message.error(res.msg);
    }
  });
};
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 9vh;
  border-bottom: 1px solid #eee;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1vh 2vw;
  flex-direction: row;
  flex-wrap: nowrap;
  .title {
    font-weight: 600;
    font-size: 20px;
  }
  :deep.van-switch__node {
    line-height: 1em;
    text-align: center;
  }
  .icon-wrapper {
    font-size: 0.5em;
    height: 2em;
    line-height: 2em;
    text-align: center;
    font-weight: bolder;
  }
  .logout {
    cursor: pointer;
    &:hover {
      color: #1890ff;
    }
  }
}
</style>
