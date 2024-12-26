<template>
  <div>
    <a-row :gutter="16">
      <a-col :xs="24" :lg="12" v-for="item in dataSource" :key="item.id">
        <a-card
          hoverable
          style="margin-bottom: 3vh; min-width: 300px"
          @click.stop="toSourceList(item)"
        >
          <template #title>
            <span style="margin-right: 10px" v-if="!item.titleEdit">{{
              item.res_name || "默认名称"
            }}</span>
            <a-input
              v-else
              style="width: 40%"
              :ref="(ref) => (item.toRef = ref)"
              @blur="editTitle(item)"
              size="small"
              v-model:value="titleVal"
              placeholder="Basic usage"
            />
            <edit-outlined key="edit" @click.stop="toggleTitle(item)" />
            <DeleteOutlined />
          </template>
          <template #extra
            ><a href="javascript:void(0);" @click="toggleUrlShow(item)"
              >详细</a
            ></template
          >
          <!-- <template #actions>
            <plus-outlined key="setting" @click.stop="add(item)" />
            <edit-outlined key="edit" @click.stop="remove(item)" />
          </template> -->
          <!-- <a-card-meta :description="'状态:' + (item.status || '未知')">
          </a-card-meta> -->
          <span
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
            ><div>
              <span style="margin-right: 10px">状态:</span>
              <a-tag
                v-if="item.status === -99"
                :bordered="false"
                color="warning"
                >启动中</a-tag
              >
              <a-tag
                v-else-if="item.status === 1"
                :bordered="false"
                color="success"
                >运行中</a-tag
              >
              <a-tag
                v-else-if="item.status === 0"
                :bordered="false"
                color="error"
                >掉线</a-tag
              >
            </div>
            <div v-if="item.toggleUrl">
              <PlusCircleOutlined @click="addUrl(item)" />
            </div>
          </span>

          <a-list
            v-show="item.toggleUrl"
            style="margin-top: 10px"
            size="small"
            bordered
            :data-source="item.data"
            :pagination="true"
          >
            <template #renderItem="{ item }">
              <a-list-item @click="toggleEditUrl(item)" v-if="!item.editable">
                <span>{{ item.original_url }}</span>
              </a-list-item>
              <a-list-item v-else>
                <a-input
                  autofocus
                  style="width: 40%"
                  :ref="(ref) => (item.toRef = ref)"
                  @blur="editUrl(item)"
                  size="small"
                  v-model:value="item.original_url"
                  placeholder="Basic usage"
                />
              </a-list-item>
            </template>
          </a-list> </a-card
      ></a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  getAccelerateList,
  getAccelerateUrl,
  editAccelerate,
} from "../../api/user";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
let dataSource = ref([]);
const toSourceList = () => {};
const deviceId = ref("");
const route = useRoute();
const titleVal = ref("");
const titleRef = ref();
onMounted(() => {
  deviceId.value = route.params.id as string;
  initList();
});

const initList = () => {
  getAccelerateList(deviceId.value).then((res: any) => {
    dataSource.value = res.data.map((el: any) => {
      el.titleEdit = false;
      el.toggleUrl = false;
      el.toRef = null;
      return el;
    });
  });
};

const editTitle = (item: any) => {
  item.titleEdit = false;
  item.res_name = titleVal.value;
  // TODO:通过资源id修改资源名称
  confrimEdit();
};

// 统一编辑方法
const confrimEdit = async () => {
  const params = {
    device_id: 0,
    resource_name: "string",
    resource_type: 0,
    resource_list: [],
    node_ip: "string",
    urls: [],
  };
  let res = await editAccelerate(params);
  if (res.code === 0) {
    message.success("修改成功");
    initList();
  } else {
    message.error(res.msg);
  }
};

const addUrl = (item: any) => {
  item.data.push({
    original_url: "",
    editable: true,
    toRef: null,
  });
  nextTick(() => {
    item.data[item.data.length - 1].toRef.focus();
  });
};

const toggleTitle = (item: any) => {
  dataSource.value.forEach((el: any) => {
    if (el.id !== item.id) {
      el.titleEdit = false;
    } else {
      el.titleEdit = true;
      titleVal.value = item.res_name;
    }
  });
  nextTick(() => {
    item.toRef.focus();
  });
};

const toggleUrlShow = (item: any) => {
  // TODO:通过资源id获取url
  getAccelerateUrl(item.id).then((res: any) => {
    const resD = res.data.map((el: any) => {
      el.editable = false;
      el.toRef = null;
      return el;
    });
    item.data = resD;
    nextTick(() => {
      item.toggleUrl = !item.toggleUrl;
    });
  });
};

const toggleEditUrl = (item: any) => {
  item.editable = true;
  nextTick(() => {
    item.toRef.focus();
  });
};
const editUrl = (item: any) => {
  item.editable = false;
};
</script>

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 24px;

  .ant-form-item-label,
  .ant-form-item-control {
    line-height: 22px;
  }
}
:deep {
  .ant-space-align-center {
    flex-wrap: wrap;
  }
}
</style>
