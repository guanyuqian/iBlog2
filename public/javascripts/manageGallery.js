/**
 * Created by the_s on 2017/9/20.
 */
$(function () {
    refreshGallery();
});
function refreshGallery() {
    $.ajax({
        url: "/getGallery",
        type: "get",
        success: function (data) {
            console.log(data);
            data.forEach(function (item) {
                addGallerySingle(item);
            });
        }
    });
}


function addGallerySingle(gallery) {
        var newHtml = ['<figure class="effect-oscar  wowload fadeInUp " id="figure' + gallery._id + '">',
            '                        <img src="' + gallery.inputCrop + '" name=' + gallery._id + ' class="photo" alt="img01" id="img' + gallery._id + '"/>',
            '                        <figcaption >',
            '                            <h2>',
            gallery.galleryName,
            '</h2>',
            '                            <p>',
            gallery.galleryDes,
            '<br>',
            '<button class="figcaptionBtn" type="button" title="'+ gallery._id+'" onclick=addGallery("'+gallery._id+'")>',
            '<i class="fa  fa-pencil-square-o"></i>EDIT</button>',
            '<button class="figcaptionBtn" type="button" title="'+ gallery._id+'" onclick=deleteGallery("'+gallery._id+'")>',
            '<i class="fa  fa-trash-o"></i>DELETE </button>',
            '                            </p>',
            '                        </figcaption>',
            '                    </figure>'].join("");
        $('#newArea').append(newHtml);
        $('#img' + gallery._id).error(function () {
            $('#img' + gallery._id).attr('src', '/images/system/error.png');
        });

    }
function addGallery(id) {
    window.location.href = '/admin/addOrEditGalleryDetail/' + id;
}

function deleteGallery(id) {
    swal({
            title: "确定要删除这篇相册吗？",
            html: true,
            type: "warning",
            allowOutsideClick: true,
            showCancelButton: true,
            cancelButtonText: "取消",
            confirmButtonColor: "#d9534f",
            confirmButtonText: "确认删除",
            closeOnConfirm: false
        },
        function () {
            $(".sweet-alert .confirm").text("提交中...");
            $(".sweet-alert .confirm").attr("disabled", "disabled");
            var figureId='#figure' + id ;
            $.ajax({
                url: "/admin/deleteGallery",
                type: "post",
                data: "id=" + id,
                success: function () {
                    $(figureId).remove();
                    swal({
                        title: "删除成功！",
                        type: "success",
                        showConfirmButton: false,
                        timer: 1000
                    });
                },
                error: function( msg ) {
                    swal({
                        title: "删除失败！",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
            });
        });


}


