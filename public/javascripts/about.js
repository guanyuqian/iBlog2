$(function () {
    $(".my-nav-pills li:eq(3)").addClass("active").siblings().removeClass("active");

    $("#job-title").cycleText();

    $(".fa-qrcode").mouseenter(function () {
        $(".profile-img").hide();
        $(".wechat-img").show();
    });

    $(".fa-qrcode").mouseleave(function () {
        $(".wechat-img").hide();
        $(".profile-img").show();
    });
});