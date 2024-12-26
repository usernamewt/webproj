import { defineConfig } from 'vite'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  resolve:{
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
    alias:{
      "@":path.resolve(__dirname,'src'),
      "@Request":path.resolve(__dirname,'src/api')
    }
  },
  server: {
    // 代理配置，用于重定向请求到其他服务器
    host:'0.0.0.0',
    proxy: {
      // 定义一个代理规则，将/hello-world路径下的请求代理到指定的目标服务器
      '/api': {
        // 目标服务器的地址
        target: 'http://192.168.31.84:8000/',
        // 更改请求的origin为代理服务器的origin，以便与目标服务器交互
        changeOrigin: true,
        // 重写请求路径，移除/hello-world前缀
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
