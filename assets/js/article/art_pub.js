$(function () {
    var layer = layui.layer
    var form = layui.form
    initPub();
    initEditor();//初始化文本编辑器
    function initPub() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发送失败了哦')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器 
    var $image = $('#image')
    // 2. 裁剪选项 
    var options = { aspectRatio: 400 / 280, preview: '.img-preview' }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为绑定封面选择按钮
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 创建一个change的监听事件
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image.cropper('destroy') // 销毁旧的裁剪区域 
            .attr('src', newImgURL) // 重新设置图片路径 
            .cropper(options) // 重新初始化裁剪区域
    })
    // 定义一个发布前的状态
    var art_state = '已发布'
    $('#btSave2').on('click', function () {
        art_state = '草稿'
    })
    // 为表单绑定一个submit事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止表单的默认提交
        e.preventDefault()
        // 2.基于form表单，快速创建一个FormData
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        // 4. 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400, height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                //    发起ajax请求
                publishArticle(fd)
            })
        // 定义一个发布文章的方法
        function publishArticle(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败！')
                    }
                    layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                    location.href = '/article/art_list.html'
                }
            })
        }


    })
})