$(function () {
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
            var psw = $('[name=newPwd]').val()
            if (value !== psw) {
                return '俩次密码不太一致'
            }
        },
        samePsw: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '不能与原密码相同'
            }
        }
    })
    // 提交重置密码
    $('#pwd_form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('重置密码失败')
                }
                layer.msg(res.message);
                // 重置表单利用JAVA中的函数
                $('#pwd_form')[0].reset();
            }
        })
    })
})