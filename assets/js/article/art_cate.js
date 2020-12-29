$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 获取文章的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户数据失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    addArtCate();
    // 初始赋值
    var indexAdd = null;
    // 添加文章类别函数
    function addArtCate() {
        $('#btn_add').on('click', function () {
            indexAdd = layer.open({
                type: 1,
                title: '添加文章分类'
                , content: $('#add_tianjia').html()
                , closeBtn: 1,
                area: ['500px', '300px']
            });
        })
        $('body').on('submit', '#add-cate', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $('#add-cate').serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 关闭弹出层
                    layer.close(indexAdd);

                }
            })
        })
    }
    // 通过代理方式绑定编辑事件
    var indexEdit = null;
    $('body').on('click', '#btnEdit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章类别'
            , content: $('#edit_tianjia').html()
            , closeBtn: 1,
            area: ['500px', '300px']
        });
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('edit-cate', res.data)
            }
        })

        $('body').on('submit', '#edit-cate', function (e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $('#edit-cate').serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('请求数据失败')
                    }
                    layer.msg(res.message);
                    layer.closeAll();
                    initArtCateList()
                }

            })

        })
    })

    // 通过绑定body代理删除事件，
    $('body').on('click', '#del-btn', function () {
        var id = $('#del-btn').attr('data-id');
        layer.confirm('are you sure? you want to delate it?', { icon: 3, title: '提示' }, function (index) {
            //   do something
            $.ajax({
                method: 'GET'
                , url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg('删除失败')
                    }
                    layer.msg(res.message);
                    initArtCateList();
                }
            })
            layer.close(index);
        });



    })
})