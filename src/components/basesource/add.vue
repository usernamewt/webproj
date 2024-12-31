<template>
  <MainContainer>
    <div style="background-color: #fff; border-radius: 20px; padding: 40px">
      <!-- 选择新增模式 -->
      <a-form
        ref="radioform"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        :model="form"
        :rule="radioformRule"
      >
        <a-form-item label="选择新增模式" name="target">
          <a-radio-group v-model:value="form.target">
            <a-radio :value="1">资源库</a-radio>
            <a-radio :value="2">自定义</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>

      <!-- 资料库模式 -->
      <a-form
        ref="library"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        :model="libraryform"
        :rules="libraryRules"
        v-if="form.target === 1"
      >
        <a-form-item :label="'搜索资源库'">
          <a-input
            v-model:value="libraryform.deviceName"
            :placeholder="'搜索'"
            @input="searchOne"
          >
            <template #addonAfter>
              <SearchOutlined style="cursor: pointer" @click="searchOne" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="选中资源" name="choosedLibrary">
          <a-tag
            closable
            @close="addSource(item)"
            v-for="item in libraryform.choosedLibrary"
            :key="item"
            >{{ item.resource_name }}</a-tag
          >
        </a-form-item>

        <!-- 当前资料库下的url -->
        <a-form-item name="url" label="资源库列表">
          <a-list
            class="demo-loadmore-list"
            :loading="initLoading"
            item-layout="horizontal"
            :data-source="searchList"
          >
            <template #loadMore>
              <div
                v-if="!initLoading && !loading"
                :style="{
                  textAlign: 'center',
                  marginTop: '12px',
                  height: '32px',
                  lineHeight: '32px',
                }"
              >
                <a-button
                  style="margin-right: 20px"
                  @click="nextPage(-1)"
                  v-if="current > 1"
                  >上一页</a-button
                >

                <a-button @click="nextPage(1)" v-if="current < totalPage"
                  >下一页</a-button
                >
              </div>
            </template>
            <template #renderItem="{ item }">
              <div>
                <a-list-item style="display: flex; align-items: center">
                  {{ item.resource_name
                  }}<a
                    key="list-loadmore-edit"
                    @click="addSource(item)"
                    v-if="!item.checked"
                  >
                    添加
                  </a>
                  <a v-else style="color: green" @click="addSource(item)">
                    已添加
                  </a>
                </a-list-item>
              </div>
            </template>
          </a-list>
        </a-form-item>

        <a-form-item
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
          label="出口"
          name="libraryTag"
        >
          <a-space wrap>
            <!-- <a-checkable-tag
            v-for="(tag, index) in tagsData"
            :key="tag"
            v-model:checked="librarySelectTags[index]"
            style="cursor: pointer"
            @change="() => handleChange(tag, '1')"
          >
            {{ tag.location }}
          </a-checkable-tag> -->

            <a-radio-group v-model:value="libraryform.libraryTag">
              <a-radio
                v-for="tag in tagsData"
                :key="tag"
                :value="tag.gateway_ip"
                >{{ tag.location }}</a-radio
              >
            </a-radio-group>
          </a-space>
        </a-form-item>

        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button @click="backToList">返回</a-button>
          <a-button
            style="margin-left: 8px"
            @click="handleSubmit"
            type="primary"
            >提交</a-button
          >
        </a-form-item>
      </a-form>

      <!-- 自定义模式 -->
      <a-form
        ref="custom"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        :model="customform"
        :rules="customRules"
        v-else
      >
        <a-form-item :label="'自定义资源名称'" name="device">
          <a-input
            v-model:value="customform.device"
            :placeholder="'请输入名称'"
          />
        </a-form-item>
        <!-- 自定义url输入框 -->
        <a-form-item :label="'url'" name="url">
          <a-input :placeholder="'请输入'" v-model:value="customform.url">
            <template #addonAfter>
              <PlusOutlined @click="addUrl" style="cursor: pointer" />
            </template>
          </a-input>
        </a-form-item>
        <!-- 自定义url列表 -->
        <a-form-item label="url列表" name="urls">
          <a-list size="small">
            <a-list-item :key="index" v-for="(item, index) in customform.urls">
              <div
                class="list-content"
                style="
                  display: flex;
                  justify-content: space-between;
                  width: 100%;
                "
              >
                {{ item.url }}<a @click="deleteone(item)">删除</a>
              </div>
            </a-list-item>
          </a-list>
        </a-form-item>
        <a-form-item label="出口" name="customTag">
          <a-space wrap>
            <a-radio-group v-model:value="customform.customTag">
              <a-radio
                v-for="tag in tagsData"
                :key="tag"
                :value="tag.gateway_ip"
                >{{ tag.location }}</a-radio
              >
            </a-radio-group>
          </a-space>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button @click="backToList">返回</a-button>
          <a-button
            style="margin-left: 8px"
            @click="handleSubmit"
            type="primary"
            >提交</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </MainContainer>
</template>

<script lang="ts" setup>
import { message } from "ant-design-vue";
import { ref, onBeforeUnmount, onMounted, nextTick } from "vue";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons-vue";
import type { Rule } from "ant-design-vue/es/form";
import { getPreSetList, getOutPort, addAccelerate } from "../../api/user";
import router from "../../router";
import { useRoute } from "vue-router";
import { useTestStore } from "../../store";
import MainContainer from "../MainContainer.vue";
const form = ref({
  target: 1,
});
const customform = ref<any>({
  url: "",
  device: "",
  urls: [],
  customTag: "",
});
const libraryform = ref<any>({
  deviceName: "",
  url: [],
  libraryTag: "",
  choosedLibrary: [],
});

const radioformRule: Record<string, Rule[]> = {
  target: [{ required: true, message: "请选择工作模式", trigger: "change" }],
};
const custom = ref();
const radioform = ref();
const library = ref();
const timer = ref(0);
const totalPage = ref(0);
const clicked = ref(false);
const tagsData = ref([]);
//
const customTag = ref<any>();
// 资料库
const libraryList = ref<any>([]);
const searchList = ref<any>([]);
const initLoading = ref(true);
const loading = ref(false);
const pageSize = ref(5);
const current = ref(1);
const baseStore = useTestStore();
// deviceId
const deviceId = ref("");

// 资料库规则
const libraryRules = {
  choosedLibrary: [
    {
      required: true,
      message: "请选择加速资源",
      trigger: "change",
      type: "array",
    },
  ],
  libraryTag: [
    {
      required: true,
      message: "请选择出口节点",
    },
  ],
};

// 自定义规则
const customRules = {
  urls: [
    {
      required: true,
      message: "请添加加速url",
    },
  ],
  device: [{ required: true, message: "请输入设备名称" }],
  customTag: [{ required: true, message: "请选择出口节点" }],
};

// 处理提交下一步
const handleSubmit = () => {
  let params: any = {
    resource_type: "",
    resource_name: "",
    resource_list: [],
    device_id: route.params.id as string,
    urls: [],
    node_ip: "",
  };
  //   资源库

  if (form.value.target === 1) {
    library.value.validate().then(() => {
      params.node_ip = libraryform.value.libraryTag;
      params.resource_list = libraryform.value.choosedLibrary.map((i: any) => {
        return i.resource_name;
      });
      params.resource_type = "1";
      clicked.value = true;
      baseStore.boxLoading = true;
      message.info("资源在处理中，请稍后查看");
      router.push("/deviceList");
      addAccelerate(params).then((res: any) => {
        if (res.code === 0) {
          // baseStore.boxLoading = false;
          message.success("添加成功");
        } else {
          baseStore.boxLoading = false;
          message.error(res.msg);
        }
      });
    });
  }
  //   自定义
  else {
    custom.value.validate().then(() => {
      params.node_ip = customform.value.customTag;
      params.resource_type = "0";
      params.resource_name = customform.value.device;
      console.log(customform);

      params.urls = customform.value.urls.map((el: any) => {
        return el.url;
      });
      baseStore.boxLoading = true;
      addAccelerate(params).then((res: any) => {
        if (res.code === 0) {
          baseStore.boxLoading = false;
          router.push("/deviceList");
        } else {
          baseStore.boxLoading = false;
          message.error(res.msg);
        }
      });
    });
  }
};

// 移除选中
const removeItem = (item: any) => {
  libraryform.value.choosedLibrary = libraryform.value.choosedLibrary.filter(
    (el: any) => {
      return el.id !== item.id;
    }
  );
};

// 路由
const route = useRoute();

// 查询资源
onMounted(() => {
  deviceId.value = route.params.id as string;
  getOut();
  getAcc();
});

// 获取加速资源
const getAcc = () => {
  getPreSetList().then((res: any) => {
    libraryList.value = res;
    totalPage.value = Math.ceil(res.length / pageSize.value);
    libraryList.value = res.map((el: any) => {
      el.checked = false;
      return el;
    });
    searchList.value = res
      .map((el: any) => {
        el.checked = false;
        return el;
      })
      .slice(
        pageSize.value * (current.value - 1),
        pageSize.value * current.value
      );
    initLoading.value = false;
  });
};

// 上/下一页
const nextPage = (val: number) => {
  current.value += val;
  loading.value = true;
  searchList.value = libraryList.value
    .filter((i: any) => {
      const st = i.resource_name.toLocaleLowerCase();
      return st.indexOf(libraryform.value.deviceName) !== -1;
    })
    .slice(
      pageSize.value * (current.value - 1),
      pageSize.value * current.value
    );
  loading.value = false;
  nextTick(() => {
    window.dispatchEvent(new Event("resize"));
  });
};

//查询资源
const searchOne = () => {
  current.value = 1;
  searchList.value = libraryList.value
    .filter((i: any) => {
      const st = i.resource_name.toLocaleLowerCase();
      return st.indexOf(libraryform.value.deviceName) !== -1;
    })
    .slice(0, pageSize.value * current.value);
};

// 判断是否url
const isUrl = (val: string) => {
  let regex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return regex.test(val);
};

// 添加url
const addUrl = () => {
  if (!customform.value.url) {
    message.error("请输入url");
    return;
  }
  if (!isUrl(customform.value.url)) {
    message.error("请输入正确的url");
    customform.value.url = "";
    return;
  }

  customform.value.urls.push({
    url: customform.value.url,
    id: customform.value.urls.length,
  });
  customform.value.url = "";
};

// 删除自定义url
const deleteone = (item: any) => {
  customform.value.urls = customform.value.urls.filter(
    (i: any) => i.id !== item.id
  );
};

// 添加资源同时input上显示
const addSource = (item: any) => {
  item.checked = !item.checked;
  if (item.checked) {
    libraryform.value.choosedLibrary.push(item);
  } else {
    removeItem(item);
  }
};

// 获取出口
const getOut = () => {
  getOutPort().then((res: any) => {
    if (res.code === 0) {
      tagsData.value = res.data;
    } else {
      message.error(res.msg);
    }
  });
};

const backToList = () => {
  router.push("/deviceList");
};

onBeforeUnmount(() => {
  clearTimeout(timer.value);
});
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
