/**
 * Created by the_s on 2017/8/25.
 */


/**
 * 时间选择器初始化
 */
$(function () {

    $(function () {
        $('.form_datetime').datetimepicker({

            minView: "month", //  选择时间时，最小可以选择到那层；默认是‘hour’也可用0表示
            language: 'zh-CN', // 语言
            format: 'yyyy-mm-dd', // 文本框时间格式，设置为0,最后时间格式为2017-03-23
            todayBtn: true, // 如果此值为true 或 "linked"，则在日期时间选择器组件的底部显示一个 "Today" 按钮用以选择当前日期。
            todayHighlight: true,
            autoclose: true, //  true:选择时间后窗口自动关闭
            fontAwesome: 'fa'
        });
        if ($('.form_datetime').val() == '')
            $('.form_datetime').val(getCurrentDate());
        //updadtaScenicsPanel();
    });
    function getCurrentDate() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

});




