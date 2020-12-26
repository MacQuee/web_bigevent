$(function () {
    var form = layui.form;
    // 昵称的验证功能
    form.verify({
        nickname: [
            /^[\S]{1,6}$/
            , '昵称字节长度必须大于6个，且不能出现空格'
        ]
    });
    initUserInform();
    // 获取修改用户数据函数
    function initUserInform() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.msg('获取用户信息失败')
                }
                console.log(res);
                form.val('formUserInfo', res.data)

            }

        })
    }

    // 重置表单数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单自动重置
        e.preventDefault();
        initUserInform();
    })


    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUseInfo()
            }
        })
    })
})
