<template>
  <MainContainer>
    <div v-if="dataSource.length !== 0">
      <a-row :gutter="16">
        <a-col
          :xs="24"
          :lg="12"
          v-for="outeritem in dataSource"
          :key="outeritem.id"
        >
          <a-card
            hoverable
            style="margin-bottom: 3vh; min-width: 300px"
            @click.stop="toSourceList(outeritem)"
          >
            <template #title>
              <span style="margin-right: 10px" v-if="!outeritem.titleEdit">{{
                outeritem.res_name || "默认名称"
              }}</span>
              <a-input
                v-else
                style="width: 40%"
                :ref="(ref) => (outeritem.toRef = ref)"
                @blur="editTitle(outeritem)"
                size="small"
                v-model:value="titleVal"
                placeholder="Basic usage"
              />
              <edit-outlined
                v-if="outeritem.toggleUrl && outeritem.res_type === 0"
                key="edit"
                @click.stop="toggleTitle(outeritem)"
                style="margin: 0 10px"
              />

              <a-popconfirm
                cancelText="取消"
                okText="确定"
                v-if="dataSource.length"
                title="确认删除?"
                @confirm.stop="deleteItem(outeritem)"
              >
                <DeleteOutlined v-if="outeritem.toggleUrl" />
              </a-popconfirm>
            </template>
            <template #extra
              ><a href="javascript:void(0);" @click="toggleUrlShow(outeritem)"
                >详细</a
              ></template
            >

            <span
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
              ><div>
                <span style="margin-right: 10px">状态:</span>
                <a-tag
                  v-if="outeritem.status === -99"
                  :bordered="false"
                  color="warning"
                  >启动中</a-tag
                >
                <a-tag
                  v-else-if="outeritem.status === 1"
                  :bordered="false"
                  color="success"
                  >运行中</a-tag
                >
                <a-tag
                  v-else-if="outeritem.status === 0"
                  :bordered="false"
                  color="error"
                  >掉线</a-tag
                >
              </div>
              <div v-if="outeritem.toggleUrl && outeritem.res_type === 0">
                <PlusCircleOutlined @click="addUrl(outeritem)" />
              </div>
            </span>

            <a-list
              v-show="outeritem.toggleUrl"
              style="margin-top: 10px"
              size="small"
              bordered
              :data-source="outeritem.data"
              :pagination="true"
              v-if="outeritem.res_type === 0"
            >
              <template #renderItem="{ item, index }">
                <a-list-item>
                  <span
                    v-if="!item.editable"
                    @click.stop="toggleEditUrl(item)"
                    >{{ item.url }}</span
                  >
                  <a-input
                    v-else
                    autofocus
                    style="width: 40%"
                    :ref="(ref) => (item.toRef = ref)"
                    @blur="editUrl(outeritem, item)"
                    size="small"
                    v-model:value="item.url"
                    placeholder="Basic usage"
                  />
                  <a-popconfirm
                    cancelText="取消"
                    okText="确定"
                    v-if="dataSource.length"
                    title="确认删除?"
                    @confirm.stop="deleteUrl(outeritem, index)"
                    placement="leftTop"
                  >
                    <DeleteOutlined />
                  </a-popconfirm>
                  <!-- <DeleteOutlined @click.stop="deleteUrl(outeritem, item)" /> -->
                </a-list-item>
                <!-- <a-list-item v-else>
                
                <a-popconfirm
                  cancelText="取消"
                  okText="确定"
                  v-if="dataSource.length"
                  title="确认删除?"
                  @confirm.stop="deleteUrl(item, index)"
                >
                  <DeleteOutlined />
                </a-popconfirm>
              </a-list-item> -->
              </template>
            </a-list>

            <a-list
              v-show="outeritem.toggleUrl"
              style="margin-top: 10px"
              size="small"
              bordered
              :data-source="outeritem.data"
              :pagination="true"
              v-else
            >
              <template #renderItem="{ item }">
                <a-list-item>
                  <span>{{ item.url }}</span>
                </a-list-item>
              </template>
            </a-list>
          </a-card></a-col
        >
      </a-row>
    </div>
    <a-empty v-else />
  </MainContainer>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  getAccelerateList,
  getAccelerateUrl,
  editAccelerate,
  deleteAccelerate,
} from "../../api/user";
import {
  EditOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
let dataSource = ref([]);
const toSourceList = () => {};
const deviceId = ref("");
const route = useRoute();
const titleVal = ref("");
import MainContainer from "../MainContainer.vue";
onMounted(() => {
  deviceId.value = route.params.id as string;
  initList();
});

// 编辑title
const editTitle = (item: any) => {
  item.titleEdit = false;
  item.res_name = titleVal.value;
  const params = {
    resource_id: item.id,
    resource_name: titleVal.value,
    resource_type: item.res_type,
    node_ip: item.node_ip,
    urls: item.data.map((el: any) => {
      return el.url;
    }),
  };
  editAccelerate(params).then((res: any) => {
    if (res.code === 0) {
      message.success("修改成功");
    } else {
    }
  });
};

// 判断是否是url
const isUrl = (val: string) => {
  let regex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return regex.test(val);
};
// url编辑
const editUrl = (item: any, input: any) => {
  // 判断是否是url
  if (!input.url) {
    // message.error("url不能为空");
    return;
  }
  if (!isUrl(input.url)) {
    message.error("url地址不正确");
  } else {
    item.editable = false;
    const params = {
      resource_id: item.id,
      resource_name: item.res_name,
      resource_type: item.res_type,
      node_ip: item.node_ip,
      urls: item.data.map((el: any) => {
        return el.url;
      }),
    };
    editAccelerate(params).then((res: any) => {
      if (res.code === 0) {
        message.success("修改成功");
        input.editable = false;
      } else {
      }
    });
  }
};
// 初始化资源列表
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

// 删除资源
const deleteItem = (item: any) => {
  message.success("删除成功");
  deleteAccelerate(item.id).then((res: any) => {
    if (res.code === 0) {
      initList();
    } else {
      message.error(res.msg);
    }
  });
};

// 添加url
const addUrl = (item: any) => {
  item.data.push({
    url: "",
    editable: true,
    toRef: null,
  });
  nextTick(() => {
    item.data[item.data.length - 1].toRef.focus();
  });
};

// 切换title修改状态
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

// 切换url是否展示，提交接口查询url
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

// 切换url编辑状态
const toggleEditUrl = (item: any) => {
  item.editable = true;
  nextTick(() => {
    item.toRef.focus();
  });
};

// 删除url
const deleteUrl = (item: any, index: number) => {
  const urldel = item.data[index].url;
  item.data.splice(index, 1);
  const params = {
    resource_id: item.id,
    resource_name: item.res_name,
    resource_type: item.res_type,
    node_ip: item.node_ip,
    urls: item.data.map((el: any) => {
      return el.url;
    }),
  };
  editAccelerate(params).then((res: any) => {
    if (res.code === 0) {
      message.success("删除成功");
    } else {
      item.data.push({
        url: urldel,
      });
    }
  });
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
