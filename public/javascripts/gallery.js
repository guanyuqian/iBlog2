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

            '<button class="figcaptionBtn" type="button" title="'+ gallery._id+'" onclick=viewGalleryDetail("'+gallery._id+'")>',
            '<i class="fa  fa-th-large"></i> MORE </button>',
            '                            </p>',
            '                        </figcaption>',
            '                    </figure>'].join("");
        $('#newArea').append(newHtml);
        $('#img' + gallery._id).error(function () {
            $('#img' + gallery._id).attr('src', '/images/system/error.png');
        });

    }
function viewGalleryDetail(id) {
    window.location.href = '/viewGalleryDetail/' + id;
}




