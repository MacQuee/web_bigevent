$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义时间过滤器
    // template.default.imports.dataFormat = function (data) {
    //     const dt = new Date(date)
    //     var y = dt.getFullYear()
    //     var m = dt.getMonth() + 1
    //     var d = dt.getUTCDay()

    //     var hh = dt.getHours()
    //     var mm = dt.getUTCMinutes()
    //     var ss = dt.getUTCSeconds()
    //     return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ':' + ss

    // }
    // // 定义补零的函数
    // function padZero(n) {
    //     return n > 9 ? n : '0' + n
    // }
    // // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求的参数对象提交到服务器
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''

    }
    initTable();
    initCate();

    // 定义获取文章数据的模版
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message)
                }
                layer.msg(res.message)
                console.log(res);
                // 使用模版引擎渲染数据表格
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                console.log(res);
                // 调用模版引擎渲染分类
                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 重新渲染函数
                form.render()
            }

        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name]=cat_id').val()
        var state = $('[name=state]').val()
        // 为查询参数对像赋值
        q.cate_id = cate_id
        q.state = state
    })
    // 定义渲染分页方法
    function renderPage(total) {
        // 调用laypage.render(方法来渲染分页的结构)
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum,// 默认显示哪一条
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 跳转
            jump: function (obj, first) {
                // 可以通过first的值，来判断是通过哪种方式，触发的回调
                // 如果first的值为true,证明是方士2触发的
                // 否则就是方式1
                console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 根据最新的q的值获取对应的数据列表
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 定义删除类别方法
    $('tbody').on('click', '#del-btn', function () {
        // 获取删除按钮的个数
        var len = $('.layui-btn-danger').length
        var id = $(this).attr('data-id')
        layer.confirm('are you sure? you want to delate it?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg(res.message)
                    // 当完成数据删除以后，判断当前这一页中，看是否还有剩余的数据
                    // // 再调用
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
    // 通过代理方式绑定编辑事件
    var indexEdit = null;
    $('body').on('click', '#edit-btn', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章类别'
            , content: $('#edit_change').html()
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
                    layer.msg('跟新数据成功');
                    layer.closeAll();
                    initCate();

                }

            })

        })
    })

})