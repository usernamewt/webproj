<template>
  <div class="login-container" @touchmove.prevent>
    <a-form
      :model="formState"
      name="basic"
      layout="horizontal"
      :label-col="{ span: 8, style: { textAlign: 'start' } }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      class="login-form"
      ref="loginFormRef"
    >
      <h2 style="text-align: center; margin-bottom: 2vw">验证码登陆</h2>
      <a-form-item
        label="手机号"
        name="phone"
        :rules="[
          {
            required: true,
            message: '请输入正确的手机号',
            type: 'string',
            pattern: /^1[3456789]\d{9}$/,
          },
        ]"
      >
        <a-input v-model:value="formState.phone" />
      </a-form-item>
      <a-form-item
        :label="t('login.code')"
        name="code"
        :rules="[{ required: true, message: t('login.codePlaceholder') }]"
      >
        <a-input-search v-model:value="formState.code">
          <template #enterButton>
            <a-button
              type="primary"
              @click="getCodeReq"
              :loading="getCodeLoading"
              >{{
                !getCodeLoading ? t("login.getCode") : "已发送(" + time + ")s"
              }}</a-button
            >
          </template>
        </a-input-search>
        <!-- <a-button type="primary">获取验证码</a-button> -->
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button @click="onFinish" type="primary" html-type="submit"
          >登录</a-button
        >
      </a-form-item>
    </a-form>
    <Puzzle :show="isVerificationVisible" @submit="handleVerificationSubmit" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from "vue";
import { useLocale } from "../../hooks/languageHook";
import { setStorage } from "../../utils/storage";
import { setToken } from "../../utils/auth";
import { getVerifyCode, userLogin } from "../../api/user";
import Puzzle from "./Puzzle.vue";
import router from "../../router";
import { message } from "ant-design-vue";
import { useTestStore } from "../../store";
const { t } = useLocale();
const loginFormRef = ref();
const isVerificationVisible = ref(false);
const timer = ref();
const getCodeLoading = ref(false);
const time = ref(0);
const baseStore = useTestStore();
const handleVerificationSubmit = () => {
  isVerificationVisible.value = false;
  initCode();
};
interface FormState {
  phone: string;
  code: string;
}

const formState = reactive<FormState>({
  phone: "",
  code: "",
});

const getCodeReq = () => {
  loginFormRef!.value!.validate("phone").then(() => {
    isVerificationVisible.value = true;
  });
};

const initCode = () => {
  getCodeLoading.value = true;
  // 调用短信验证码接口
  getVerifyCode({ mobile: formState.phone }).then((res: any) => {
    if (res.code == 0) {
      formState.code = res.data;
    }
  });
  // 倒计时60s,页面显示倒计时时间,结束后loading消失
  time.value = 60;
  timer.value = setInterval(() => {
    time.value--;
    if (time.value <= 0) {
      clearInterval(timer.value);
      getCodeLoading.value = false;
    }
  }, 1000);
};

const onFinish = () => {
  loginFormRef!
    .value!.validate()
    .then(() => {
      userLogin({ mobile: formState.phone, vcode: formState.code }).then(
        (res: any) => {
          if (res.code == 0) {
            const token = res.data.token;
            setStorage("token", token);
            setToken(token);
            baseStore.uid = res.data.uid;
            // 401登录的原路退回
            nextTick(() => {
              const redirect =
                (router.currentRoute.value.query.redirect as string) ||
                "/deviceList";
              router.push(redirect);
            });
          } else {
            message.error(res.msg);
          }
        }
      );
    })
    .catch(() => {});
};
</script>

<style lang="less" scoped>
@media (min-width: 992px) and (max-width: 1199px) {
  .login-container {
    .login-form {
      width: 60vw !important;
    }
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .login-container {
    .login-form {
      width: 80vw !important;
    }
  }
}
@media (max-width: 767px) {
  .login-container {
    .login-form {
      width: 90vw !important;
    }
  }
}
.login-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: #fff;
  background-image: url("../../assets/loginbg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  .languages {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .login-form {
    padding: 2vw 2vw;
    margin: 0 auto;
    overflow: hidden;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 40vw;
    .title-container {
      text-align: center;
      margin-bottom: 2vw;
      .title {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
      }
    }
  }
}
</style>
