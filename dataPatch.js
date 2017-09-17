/**
 * Created by the_s on 2017/9/11.
 */
var category = require('./proxy/category');
var travels = {
    "uniqueid": "Travels",
    "alias": "Travels",
    "catename": "Travels",
    "img": "/images/travels.png",
    "link": ''
};

/**
 * 初始插入travels分類
 */
category.getAll(false, false, function (err, data) {
    if (err) {
        console.log('getAll err');
    } else {
        var haveTravels = false;
        data.forEach(function (item) {
            if (item.Alias == 'Travels') {
                haveTravels = true;
                console.log('have travels category');
                return;
            }
        });
        if (haveTravels == false) {
            console.log('insert travels category');
            data.push(travels);
            category.save(data, function (err) {
                if (err) {
                    console.log('err')
                } else {
                    console.log('travels patched')
                }
            });
        }
    }
});
