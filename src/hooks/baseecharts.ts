import * as echarts from 'echarts'

import {
    Ref,
    shallowRef,
    unref,
    onMounted,
    onDeactivated,
    onBeforeUnmount,
  } from "vue";
  
  export type EChartsCoreOption = echarts.EChartsCoreOption;
  
  const useEcharts = (elRef: Ref<HTMLDivElement>, options: EChartsCoreOption) => {
    const charts = shallowRef<echarts.ECharts>();
    const setOptions = (options: EChartsCoreOption) => {
      charts.value && charts.value.setOption(options);
    };
  
    // 初始化
    const initCharts = () => {
      const el = unref(elRef);
      if (!el || !unref(el)) {
        return;
      }
      charts.value = echarts.init(el);
      setOptions(options);
    };
  
    // 重新窗口变化时，重新计算
    const resize = () => {
      charts?.value && charts?.value.resize();
    };
  
    onMounted(() => {
      window.addEventListener("resize", resize);
    });
  
    // 页面keepAlive时，不监听页面
    onDeactivated(() => {
      window.removeEventListener("resize", resize);
    });
  
    onBeforeUnmount(() => {
      window.removeEventListener("resize", resize);
    });
  
    return {
      initCharts,
      setOptions,
      resize,
    };
  };
  
  export { useEcharts };