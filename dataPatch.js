
/**
 * Created by the_s on 2017/9/11.
 */
var category = require('./proxy/category');
var travels={
    "uniqueid": "Travels",
    "alias": "Travels",
    "catename": "Travels",
    "img": "/images/travel planning.png",
    "link":''
};
category.save([travels], function (err) {
    if (err) {
        console.log('err')
    } else {
        console.log('travels patched')
    }
});