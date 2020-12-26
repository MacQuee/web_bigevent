$(function () {
    // 调用获取用户数据
    getUseInfo()
    $('#btnLogout').on('click', function () {
        layer.confirm('你确认要退出吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清空本地缓存
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        });

    })
})

function getUseInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers:
        //     { Authorization: localStorage.getItem('token') || '' },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message, { icon: 5 })
            }
            renderAvater(res.data)
        },
        // 实现回调函数
        // complete: function (res) {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }
    })

}
function renderAvater(user) {
    // 获取用户的名称
    var name = user.nickname || user.username;
    // 渲染欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    // 渲染用户的头衔
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    }
    else {
        $('.layui-nav-img').hide();
        var first = name[0]
        $('.text-avatar').html(first).show()
    }


}