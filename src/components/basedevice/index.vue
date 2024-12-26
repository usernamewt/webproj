<template>
  <div class="cards">
    <a-card
      v-for="item in dataSource"
      :key="item.id"
      hoverable
      style="margin-bottom: 3vh; width: 300px"
      class="card-flex"
      @click.stop="toSourceList(item)"
    >
      <template #cover> </template>
      <template #actions>
        <plus-outlined key="setting" @click.stop="addSource(item)" />
        <edit-outlined key="edit" @click.stop="toDetail(item)" />
      </template>
      <a-card-meta
        :title="item.device_name || '默认名称'"
        :description="'位置:' + (item.location || '未知')"
      >
        <!-- <template #avatar>
          <a-avatar src="https://joeschmoe.io/api/v1/random" />
        </template> -->
      </a-card-meta>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { PlusOutlined, EditOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { onMounted, ref } from "vue";
import { getEquipmentList } from "../../api/user";
import router from "../../router";
import { useTestStore } from "../../store";
const dataSource = ref<any>([]);
onMounted(() => {
  baseStore.header = "设备列表";
  // TODO:对接用户id
  getEquipmentList("2").then((res) => {
    if (res.code === 0) {
      dataSource.value = res.data;
    } else {
      message.error(res.msg);
    }
  });
});
const baseStore = useTestStore();

// 设备编辑
const toDetail = (item: any) => {
  baseStore.header = "设备编辑";
  router.push("/deviceDetail/" + item.id);
};

// 添加资源
const addSource = (item: any) => {
  baseStore.header = "添加资源";
  router.push("/sourceAdd/" + item.id);
};

// 资源列表
const toSourceList = (item: any) => {
  console.log(item);

  baseStore.header = "资源列表";
  router.push("/sourceList/" + item.id);
};
</script>

<style lang="less" scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  box-sizing: border-box;
  .card-flex {
    width: calc(33.33333% - 40px) !important;
    margin-right: 20px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .cards {
    .card-flex {
      width: calc(33.33333% - 60px) !important;
    }
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .cards {
    .card-flex {
      width: calc(50% - 40px) !important;
    }
  }
}
@media (max-width: 767px) {
  .cards {
    .card-flex {
      width: 100vw !important;
    }
  }
}
</style>
