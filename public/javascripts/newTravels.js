$(function () {


    $("#Title").focus();

    refreshCate();

    var editor = UE.getEditor("editor", {
        allowDivTransToP: false,
        initialFrameHeight: 300,
        initialContent: "请输入文章正文",
        autoClearinitialContent: true,
        textarea: "Content"
    });

    editor.ready(function () {
        $("[data-toggle=tooltip]").tooltip({
            container: "body"
        });
    });

    $(".btn-alias").on("click", function () {
        var appid,
            key,
            salt,
            query = $("#Title").val(),
            from,
            to,
            str1,
            sign;
        if (query) {
            var that = this;
            $(that).addClass("disabled");
            appid = '20151219000008011';
            key = translateKey;
            salt = (new Date).getTime();
            from = 'zh';
            to = 'en';
            str1 = appid + query + salt + key;
            sign = md5(str1);
            $.ajax({
                url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
                type: 'get',
                dataType: 'jsonp',
                data: {
                    q: query,
                    appid: appid,
                    salt: salt,
                    from: from,
                    to: to,
                    sign: sign
                },
                success: function (data) {
                    var en = data.trans_result[0].dst;
                    var result = en.trim().toLowerCase().split(' ').join('-');
                    $("#Alias").val(result).focus();
                    $('#postForm').formValidation('revalidateField', 'Alias');
                },
                complete: function () {
                    $(that).removeClass("disabled");
                }
            });
        }
    });

    $("#postForm").on('init.field.fv', function (e, data) {
        var $parent = data.element.parents('.form-group'),
            $icon = $parent.find('.form-control-feedback[data-fv-icon-for="' + data.field + '"]');
        $icon.on('click.clearing', function () {
            if ($icon.hasClass('fa-remove')) {
                data.fv.resetField(data.element);
            }
        });
    }).formValidation({
        framework: 'bootstrap',
        icon: {
            valid: 'fa fa-check',
            invalid: 'fa fa-remove',
            validating: 'fa fa-refresh'
        },
        err: {
            container: 'tooltip'
        },
        fields: {
            Title: {
                validators: {
                    notEmpty: {
                        message: '标题不能为空'
                    }
                }
            },
            Alias: {
                validators: {
                    notEmpty: {
                        message: 'Alias不能为空'
                    },
                    remote: {
                        url: '/admin/checkArticleAlias',
                        type: 'POST',
                        data: '{"uid":"' + $('#UniqueId').val() + '"}',
                        delay: 1000,
                        message: 'Alias不唯一'
                    }
                }
            },
            Summary: {
                validators: {
                    notEmpty: {
                        message: '摘要不能为空'
                    }
                }
            },
            Url: {
                validators: {
                    notEmpty: {
                        message: 'Url不能为空'
                    },
                    uri: {
                        message: 'Url地址不正确'
                    }
                }
            }
        }
    })
        .on('err.field.fv', function (e, data) {
            data.fv.disableSubmitButtons(false);
        })
        .on('success.field.fv', function (e, data) {
            data.fv.disableSubmitButtons(false);
        })
        .on('success.form.fv', function (e) {
            e.preventDefault();
            $("#Labels").val(JSON.stringify($("#myPillbox").pillbox("items")));
            $('#IsDraft').val('False');
            swal({
                    title: "确定要发布该文章吗？",
                    text: $("#CategoryId").val() === "other" ? "<span style='color:#d9534f;'>注意：当前选择的文章分类为\"未分类\"</span>" : null,
                    html: true,
                    type: "warning",
                    allowOutsideClick: true,
                    showCancelButton: true,
                    cancelButtonText: "取消",
                    confirmButtonColor: "#d9534f",
                    confirmButtonText: "确定发布",
                    closeOnConfirm: false
                },
                function () {
                    $(".sweet-alert .confirm").text("发布中...");
                    $(".sweet-alert .confirm").attr("disabled", "disabled");
                    $.ajax({
                        url: $("#postForm")[0].action,
                        type: $("#postForm")[0].method,
                        data: $("#postForm").serialize(),
                        success: function () {
                            swal({
                                title: "发布成功！",
                                type: "success",
                                showConfirmButton: false,
                                timer: 2000
                            }, function () {
                                window.location.href = "/admin/articlemanage";
                            });
                        },
                        error: function () {
                            swal({
                                title: "发布失败！",
                                type: "error",
                                showConfirmButton: false,
                                timer: 2000
                            });
                        },
                        complete: function () {
                            $(".sweet-alert .confirm").removeAttr("disabled");
                        }
                    });
                });
        });

    $('#btnSave').on('click', function () {
        var $this = $(this);
        $("#Labels").val(JSON.stringify($("#myPillbox").pillbox("items")));
        $('#IsDraft').val('True');
        $this.attr('disabled', 'disabled');
        $.ajax({
            url: $("#postForm")[0].action,
            type: $("#postForm")[0].method,
            data: $("#postForm").serialize(),
            success: function () {
                swal({
                    title: '草稿保存成功！',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 2000
                }, function () {
                    window.location.href = '/admin/editarticle/' + $('#UniqueId').val();
                });
            },
            error: function () {
                swal({
                    title: "草稿保存失败！",
                    type: "error",
                    showConfirmButton: false,
                    timer: 2000
                });
            },
            complete: function () {
                $this.removeAttr("disabled");
            }
        });
    });

    /**
     * tab初始化
     */
    var scenicList = [];
    $(".selectlist").on("changed.fu.selectlist", function (e, data) {
        $(this).find("li").removeClass("active");
        $(this).find("li[data-value=" + data.value + "]").addClass("active");
    });
    //添加删除回调函数 tab
    deleteScenicCallback=deleteScenicList;
    $.ajax({
        url: 'scenicInf?action=addScenic', //这里是静态页的地址
        type: "GET", //静态页用get方法，否则服务器会抛出405错误
        success: function (data) {
            $("#bTabs_navTabsMainPage").html(data);
            $('#mainFrameTabs').bTabs();
            $("#bTabs_navTabsMainPage>div>div>div>#addScenicTabBtn").show();
            $("#bTabs_navTabsMainPage>div>div>div>#updateScenicTabBtn").hide();
            $("#bTabs_navTabsMainPage>div>div>div>#cancelScenicTabBtn").hide();
            //添加tab事件
            $("#addScenicTabBtn").on('click', addScenic);

        }
    });
    /**
     * scenicList 的push操作,如果存在uuid相同的话就更新，带重名判断
     * @param scenic 新增的scenic
     */
    function scenicListAddOrUpdate(scenic) {
        for (i in scenicList) {
            //再判断是否是更新
            if (scenic.uuid == scenicList[i].uuid) {
                scenicList[i] = scenic;
                alert('更新成功');//in english
                return 'update';
            }
        }
        //不是更新就新增
        scenicList.push(scenic);
        return 'add';
    }

    /**
     * 增加景点
     */
    function addScenic() {
        var title = $(".tab-pane.active>div>div>.addScenicsName").first().val();
        var url = 'scenicInf';
        var playTime = $(".tab-pane.active>div>div>div>.addScenicsDate").first().val();
        var type = $(".tab-pane.active>div>div>.addScenicsType").first().val();
        var menuId = generateUUID();
        var result = scenicListAddOrUpdate({
            uuid: menuId,
            title: title,
            playTime: playTime,
            type: type,
            pointLon: 100,//经度
            pointLat: 100//纬度
        });
        if (result == 'add') $('#mainFrameTabs').bTabsAdd(menuId, title, url, refreshScenic);
    }



    /**
     * 保存编辑景点
     */
    function updateScenic() {
        var title = $(".tab-pane.active>div>div>.addScenicsName").first().val();
        var playTime = $(".tab-pane.active>div>div>div>.addScenicsDate").first().val();
        var type = $(".tab-pane.active>div>div>.addScenicsType").first().val();
        var menuId = $(".tab-pane.active").first().attr("id");
        var action = scenicListAddOrUpdate({
            uuid: menuId,
            title: title,
            playTime: playTime,
            type: type,
            pointLon: 100,//经度
            pointLat: 100//纬度
        });
        if (action == 'update') $("[href$=" + menuId + "]").first().html(title+'<button type="button" class="navTabsCloseBtn" title="关闭" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>');
    }


    /**
     * 删除景点
     */
    function deleteScenicList(id) {
        for (i in scenicList) {
            //再判断是否是更新
            if (id == scenicList[i].uuid) {
                scenicList.splice(i, 1);
            }
        }
    }

    /**
     * 重新填充Scenic数据
     */
    function refreshScenic() {
        $("#bTabs_navTabsMainPage>div>div>.addScenicsName").val('');
        $(".updateScenicTabBtn").on('click', updateScenic);
        $(".cancelScenicTabBtn").on('click', refreshScenic);
        for (var i in scenicList) {
            var uuid = scenicList[i].uuid;
            var title = scenicList[i].title;
            var playTime = scenicList[i].playTime;
            var type = scenicList[i].type;
            var selector = '#'+uuid + '>div>div>';
            $(selector + '.addScenicsName').val(title);
            $(selector + 'div>.addScenicsDate').val(playTime);
            $(selector + '.addScenicsType').val(type);
        }
    }

    function refreshCate() {
        $.ajax({
            url: "/admin/getCategories",
            type: "Post",
            success: function (data) {
                $("#Categorylist ul").html("");
                $.each(data, function (key, value) {
                    if (!value.Link) {
                        $("#Categorylist ul").append("<li data-value=\"" + value._id + "\">"
                            + "<a href=\"#\">" + value.CateName + "</a>"
                            + "</li>");
                    }
                });
                $("#Categorylist ul").append("<li data-value=\"other\"><a href=\"#\">未分类</a></li>");
                $("#Categorylist").selectlist("enable");
                $("#Categorylist").selectlist("selectByValue", "other");
                $("#Categorylist li[data-value=other]").addClass("active");
            }
        });
    }


    /**
     *地图初始化
     */
        // 百度地图API功能
    var map = new BMap.Map("allmap");  // 创建Map实例
    map.centerAndZoom("上海", 15);      // 初始化地图,用城市名设置地图中心点


});
