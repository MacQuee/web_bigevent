// 注意：每次调用$.get()或$.post()或$.ajax()的时候
// 会先调用ajaxPrefilter函数
// 其中option代表发请求的路劲
$.ajaxPrefilter(function (options) {
    // 在发起Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // 统一有权限的接口，设置header请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }
    // complete回调函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }

})