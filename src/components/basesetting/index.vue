<template>
  <div>
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
          <a-radio :value="1">自定义</a-radio>
          <a-radio :value="2">资源库</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>

    <a-form
      ref="custom"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      :model="customform"
      v-if="form.target == '1'"
    >
      <!-- 自定义模式 -->
      <!-- 自定义名称 -->
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
      <a-form-item label="url列表">
        <a-list size="small">
          <a-list-item :key="index" v-for="(item, index) in data">
            <div slot="actions">
              <a @click="deleteone(item)">删除</a>
            </div>
            <div class="list-content">
              <div class="list-content-item">
                <p>{{ item.url }}</p>
              </div>
              <div class="list-content-item"></div>
            </div>
          </a-list-item>
        </a-list>
      </a-form-item>
      <a-form-item label="出口">
        <a-space wrap>
          <a-checkable-tag
            v-for="(tag, index) in tagsData"
            :key="tag"
            v-model:checked="selectTags[index]"
            style="cursor: pointer"
            @change="(checked) => handleChange(tag, checked)"
          >
            {{ tag }}
          </a-checkable-tag>
        </a-space>
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
        <a-button @click="prevStep">上一步</a-button>
        <a-button style="margin-left: 8px" @click="handleSubmit" type="primary"
          >提交</a-button
        >
      </a-form-item>
    </a-form>

    <!-- 资料库模式 -->
    <a-form
      ref="library"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      :model="libraryform"
      v-else
    >
      <a-form-item :label="'资源库名称'" name="deviceName">
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
      <a-form-item label="选中资源">
        <a-tag
          closable
          @close="addSource(item)"
          v-for="item in choosedLibrary"
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
      >
        <a-space wrap>
          <a-checkable-tag
            v-for="(tag, index) in tagsData"
            :key="tag"
            v-model:checked="selectTags[index]"
            style="cursor: pointer"
            @change="() => handleChange(tag)"
          >
            {{ tag }}
          </a-checkable-tag>
        </a-space>
      </a-form-item>

      <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
        <a-button @click="prevStep">上一步</a-button>
        <a-button style="margin-left: 8px" @click="handleSubmit" type="primary"
          >提交</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { message } from "ant-design-vue";
import { ref, onBeforeUnmount, onMounted, nextTick } from "vue";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons-vue";
import type { Rule } from "ant-design-vue/es/form";
import { getPreSetList } from "../../../api/user";
const form = ref({
  target: "1",
});
const customform = ref({
  url: "",
  device: "",
});
const libraryform = ref({
  deviceName: [],
  url: [],
});

const radioformRule: Record<string, Rule[]> = {
  target: [{ required: true, message: "请选择工作模式", trigger: "change" }],
};
const custom = ref(null);
const radioform = ref(null);
const library = ref(null);
const timer = ref(0);
const totalPage = ref(0);
// 加速url
const data = ref<any[]>([]);
const clicked = ref(false);
const tagsData = ref(["香港", "日本", "美国"]);
const selectTags = ref([true, false, false]);
// 资料库
const libraryList = ref<any>([]);
const searchList = ref<any>([]);
const initLoading = ref(true);
const loading = ref(false);
const pageSize = ref(5);
const current = ref(1);

// 选中资料库
const choosedLibrary = ref<any>([]);

// 移除选中
const removeItem = (item: any) => {
  choosedLibrary.value = choosedLibrary.value.filter((el: any) => {
    return el.id !== item.id;
  });
};

// 查询资源
onMounted(() => {
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
});

// 上/下一步
const nextPage = (val: number) => {
  current.value += val;
  loading.value = true;
  searchList.value = libraryList.value
    .filter((i: any) => {
      return i.resource_name.indexOf(libraryform.value.deviceName) !== -1;
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

const emits = defineEmits(["nextStep", "prevStep"]);

// 添加url
const addUrl = () => {
  if (!customform.value.url) {
    message.error("请输入url");
    return;
  }
  data.value.push({
    url: customform.value.url,
    id: data.value.length,
  });
  customform.value.url = "";
};

// 删除自定义url
const deleteone = (item: any) => {
  data.value = data.value.filter((i) => i.id !== item.id);
};

//查询资源
const searchOne = () => {
  console.log("触发输入");

  current.value = 1;
  searchList.value = libraryList.value
    .filter((i: any) => {
      const st = i.resource_name.toLocaleLowerCase();
      return st.indexOf(libraryform.value.deviceName) !== -1;
    })
    .slice(
      pageSize.value * (current.value - 1),
      pageSize.value * current.value
    );
};

// 添加资源同时input上显示
const addSource = (item: any) => {
  item.checked = !item.checked;
  if (item.checked) {
    choosedLibrary.value.push(item);
  } else {
    removeItem(item);
  }
};

// 出口选择
const handleChange = (tag: any) => {
  selectTags.value = selectTags.value.map((i: any, index) => {
    if (tag === tagsData.value[index]) {
      return true;
    } else {
      return false;
    }
  });
  console.log(choosedLibrary.value);
};

// 处理提交下一步
const handleSubmit = () => {
  // 验证自定义资源库
  if (form.value.target === "1") {
    clicked.value = true;
    if (data.value.length === 0) {
      message.error("请添加url");
      return;
    }
    emits("nextStep");
  } else {
    // 验证选择资源库
    emits("nextStep");
  }
};
const prevStep = () => {
  emits("prevStep");
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
