<template>
  <div class="header">
    <div class="title" v-if="type === 'equipmentlist'">
      <LeftOutlined v-show="baseStore.header != '设备列表'" @click="toList" />
      {{ baseStore.header }}
    </div>
    <div class="title" v-else>
      <span style="font-weight: bolder">{{ baseStore.deviceLocation }}</span>
    </div>
    <LogoutOutlined class="logout" @click="logout" />
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, onMounted } from "vue";
import { useLocale } from "../../hooks/languageHook";
import { useTestStore } from "../../store";
import { LogoutOutlined, LeftOutlined } from "@ant-design/icons-vue";
import router from "../../router";
import { useRoute } from "vue-router";
const { t } = useLocale();
const route = useRoute();
const baseStore = useTestStore();
const type = ref("equipmentlist");
const toList = () => {
  router.push("/deviceList");
};
onMounted(() => {
  if (route.path.includes("/sourceAdd")) {
    baseStore.header = "资源添加";
  } else if (route.path.includes("/sourceList")) {
    baseStore.header = "资源库";
  } else if (route.path.includes("/deviceList")) {
    baseStore.header = "设备列表";
  } else {
    baseStore.header = "设备详情";
  }
});
watch(baseStore, () => {
  switch (baseStore.menuType) {
    case "equipmentlist":
      type.value = "equipmentlist";
      break;
    case "acceryon":
      type.value = "acceryon";
      break;
    default:
      break;
  }
});

const logout = () => {
  localStorage.removeItem("userInfo");
  router.push("/login");
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
