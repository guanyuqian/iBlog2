/**
 * Created by the_s on 2017/9/20.
 */
function addGallerySingle(gallery) {
    if (gallery == null) gallery = {
        photoDes: "",
        photoSrc: "",
        PhotoName: ""
    };
    var newHtml = ['    <figure class="effect-oscar  wowload fadeInUp">',
        '        <img src="' + gallery.photoSrc + '" alt=" '+ gallery.PhotoName + '"/>',
        '        <figcaption>',
        '            <h2>' + gallery.PhotoName + '</h2>',
        '            <p>' + gallery.photoDes + '<br>',
        '                <a href="' + gallery.photoSrc + '" title="' + gallery.PhotoName + '" data-gallery><i class="fa  fa-search-plus"></i>DETAIL</a></p>',
        '        </figcaption>',
        '    </figure>'].join("");
    $('#newArea').append(newHtml);
}
