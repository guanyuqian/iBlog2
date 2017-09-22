/**
 * Created by the_s on 2017/9/20.
 */
$(function () {
    $('#inputCrop').change(function (e) {
        $('#imgCrop').attr('src', e.target.value);
    });
    $('#imgCrop').error(function(){
        $('#imgCrop').attr('src','/images/system/error.png');
    });
});
function addGallerySingle() {
    var uuid = generateUUID();
    var newHtml=['<figure class="effect-oscar  wowload fadeInUp " id="figure'+uuid+'">',
        '                        <img src="/images/system/error.png" name='+uuid+' class="photo" alt="img01" id="img'+uuid+'"/>',
        '                        <figcaption >',
        '                            <h2><input class="figcaption-h2 photoName" placeholder="相片标题"/></h2>',
        '                            <p>',
        '                                <input class="figcaption-h2 figcaption-input photoDes" placeholder="相片描述" value=""/>',
        '                                <input class="figcaption-h2 srcInput figcaption-input photoSrc" placeholder="src" value="" id="'+uuid+'"/>',
        '                                <button class="figcaptionBtn" type="button" id="remove'+uuid+'"><i class="fa  fa-trash-o"></i>',
        '                                    delete',
        '                                </button>',
        '                            </p>',
        '                        </figcaption>',
        '                    </figure>'].join("");
    $('#newArea').append(newHtml);
    $('#'+uuid).change(function (e) {
        $('#img'+e.target.id).attr('src', e.target.value);
    });
    $('#img'+uuid).error(function(){
        $('#img'+uuid).attr('src','/images/system/error.png');
    });
    $('#remove'+uuid).click(function(){
        console.log('123');

        $('#figure'+uuid).remove();
    });
}

$("form").submit(function(e){
    var listPhoto=[];
    e.preventDefault();
    var photoSrc=$('.photoSrc');
    var photoDes=$('.photoDes');
    var photoName=$('.photoName');
    $.each(photoSrc, function( index ) {
        console.log();
        listPhoto.push({
            photoDes:photoDes[index].value,
            photoSrc:photoSrc[index].value,
            PhotoName:photoName[index].value
        });
    });
    $('#photoList').val(JSON.stringify(listPhoto));
    swal({
            title: "确定要发布该相册吗？",
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
            $('#imageCropSrc').val($('#avatar-view').attr('src'));

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
                            window.location.href = "/admin/manageGallery";
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