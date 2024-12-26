export const timeFormter = (time:string) => {
    var data = new Date(time);
    // 封装年份时间
    var y = data.getFullYear();
    // 封装月份时间
    var m = data.getMonth();
    // 封装日期时间
    var d = data.getDate();
    // 转换详细时分
    var hours =
      data.getHours() < 10 ? "0" + data.getHours() : data.getHours();
    var minutes =
      data.getMinutes() < 10 ? "0" + data.getMinutes() : data.getMinutes();
    // 输出转换后时间节点
    return `${hours}:${minutes}`;
  }

  export const dayFormter = (time:string) => {
    var data = new Date(time);
    // 封装年份时间
    var y = data.getFullYear();
    // 封装月份时间
    var m = data.getMonth();
    // 封装日期时间
    var d = data.getDate();
    return `${y}-${m}-${d}`;
  }