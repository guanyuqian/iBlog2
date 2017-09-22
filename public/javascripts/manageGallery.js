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
        var uuid = generateUUID();
        var newHtml = ['<figure class="effect-oscar  wowload fadeInUp " id="figure' + uuid + '">',
            '                        <img src="' + gallery.inputCrop + '" name=' + uuid + ' class="photo" alt="img01" id="img' + uuid + '"/>',
            '                        <figcaption >',
            '                            <h2>',
            gallery.galleryName,
            '</h2>',
            '                            <p>',
            gallery.galleryDes,
            '<br>',
            '<button class="figcaptionBtn" type="button" title="'+ gallery._id+'" onclick="editGallery()">',
            '<i class="fa  fa-pencil-square-o"></i>EDIT</button>',
            '<button class="figcaptionBtn" type="button" title="'+ gallery._id+'" onclick="deleteGallery()">',
            '<i class="fa  fa-trash-o"></i>DELETE </button>',
            '                            </p>',
            '                        </figcaption>',
            '                    </figure>'].join("");
        $('#newArea').append(newHtml);
        $('#img' + uuid).error(function () {
            $('#img' + uuid).attr('src', '/images/system/error.png');
        });

    }
function addGallery(id) {
    window.location.href = '/admin/galleryDetail/' + id;
}

