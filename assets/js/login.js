$(function () {
    // 跳转至注册页面
    $('#link_reg').on('click', function () {
        $('.login').hide();
        $('.reg').show();
    })
    // 跳转至登录页面
    $('#link_login').on('click', function () {
        $('.login').show();
        $('.reg').hide();
    })
    // 从layui中获取验证
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码验证
        repwd: function (value) {
            var psw = $('#password-reg').val()
            if (value !== psw) {
                return '俩次密码不太一致'
            }

        }
    })
    // 监听注册表单事件
    $('#form-reg').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault()
        // 发起post请求、
        var data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=repassword]').val()
        }
        $.post('/api/reguser', data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg('注册成功', { icon: 6 });
                $('#link_login').click();
            }
        )
    })
    // 监听登录表单
    $('#form-login').submit(function (e) {
        // 阻止表单的默认提交
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $('#form-login').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                console.log(res.token);
                // 将获取的权限存储在后台
                localStorage.setItem('token', res.token);
                // 跳转至后台
                location.href = '/index.html'
            }
        })
    })
})
