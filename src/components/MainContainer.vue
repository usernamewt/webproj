<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Header from "./layout/Header.vue";
import router from "../router";
import { UnorderedListOutlined } from "@ant-design/icons-vue";
import { useTestStore } from "../store";
const baseStore = useTestStore();
const type = ref("equipmentlist");
const onCollapse = (collapsed: boolean, type: string) => {
  console.log(collapsed, type);
};

// 监听菜单通过其他方式切换
watch(
  () => baseStore.menuType,
  (newVal: string) => {
    type.value = newVal;
    if (newVal === "equipmentlist") {
      selectedKeys.value = ["1"];
    } else if (newVal === "acceryon") {
      selectedKeys.value = ["2"];
    }
  }
);

const onBreakpoint = (broken: boolean) => {
  console.log(broken);
};

// 当前选中的menu
const selectedKeys = ref<string[]>(["1"]);

// 处理menu切换，如果没有选择设备，无法进入加速目标
const handelmenuswitch = (item: any) => {
  switch (item.key) {
    case "1":
      router.push("/deviceList");
      break;
    case "2":
      router.push("/setting");
      break;
    default:
      router.push("/equipmentlist");
  }
};
onMounted(() => {});
</script>
<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo">AppFast - 网讯达</div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="handelmenuswitch"
      >
        <a-menu-item key="1">
          <UnorderedListOutlined />
          <span class="nav-text">设备列表</span>
        </a-menu-item>
        <!-- <a-menu-item key="2">
          <ApiOutlined />
          <span class="nav-text">基础设置</span>
        </a-menu-item> -->
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <Header />
      <div style="box-sizing: border-box; padding: 10px">
        <slot></slot>
      </div>
      <a-layout-footer style="text-align: center"> </a-layout-footer>
    </a-layout>
  </a-layout>
  <a-back-top />
</template>

<style scoped lang="less">
// :deep .ant-menu-item-selected {
//   background-color: #60a5fa !important;
// }
.logo {
  height: 32px;
  // background: rgba(255, 255, 255, 0.2);
  text-align: center;
  line-height: 32px;
  color: #fff;
  margin: 16px;
  font-weight: bolder;
  cursor: pointer;
}

.site-layout-sub-header-background {
  background: #fff;
}

.site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout-sub-header-background {
  background: #141414;
}

.read-the-docs {
  color: #888;
}
.container-layout {
  // height: calc(100vh - 60px);
  width: 100%;
  .sections {
    padding: 2vh 2vw 0;
    box-sizing: border-box;
  }
}
.main-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
}
</style>
