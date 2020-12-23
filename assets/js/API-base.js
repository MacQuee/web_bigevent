// 注意：每次调用$.get()或$.post()或$.ajax()的时候
// 会先调用ajaxPrefilter函数
// 其中option代表发请求的路劲
$.ajaxPrefilter(function (options) {
    // 在发起Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);
})