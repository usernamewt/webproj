<template>
  <div class="table-container">
    <a-table :columns="columns" :data-source="dataSource" bordered>
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'status'">
          <!-- TODO:状态样式 -->
          <a-tag v-if="text != 1" color="red">离线</a-tag>
          <a-tag v-else color="green">在线</a-tag>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-button type="link" @click="getAccUrl(record)">查看</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useTestStore } from "../../store";
import { getAccelerateList, getAccelerateUrl } from "../../api/user";
const baseStore = useTestStore();
onMounted(() => {
  getAccList();
});

watch(
  () => baseStore.deviceId,
  () => {
    getAccList();
  }
);

let getAccList = async () => {
  // 真实请求
  // let res = await getAccelerateList(baseStore.deviceId);
  // 模拟请求
  let res = await getAccelerateList("7");
  if (res.code == 0) {
    dataSource.value = res.data as any;
    console.log("加速资源", dataSource.value);
  }
};
const columns = [
  {
    title: "名称(name)",
    dataIndex: "res_name",
    width: "250",
  },
  {
    title: "状态(status)",
    dataIndex: "status",
    width: "150",
  },
  {
    title: "查看网站(view)",
    dataIndex: "operation",
    width: "200",
  },
];
interface DataItem {
  id: string;
  res_name: string;
  status: number;
  res_date: string;
  last_checked: string;
}

const dataSource = ref<DataItem[]>([]);

const getAccUrl = async (id: any) => {
  // 真实请求
  // let res = await getAccelerateUrl(id.id);
  // 模拟请求
  console.log(id);
  let res = await getAccelerateUrl("2");
  if (res.code == 0) {
    console.log(res);
    baseStore.isShowUrl = true;
    baseStore.currentUrl = {
      urllist: res.data,
      sourceId: id.id,
    };
  }
};
</script>

<style lang="less" scoped>
.editable-row-operations a {
  margin-right: 8px;
}

.table-container {
  // max-height: 80vh;
  overflow-y: scroll;
}
</style>
