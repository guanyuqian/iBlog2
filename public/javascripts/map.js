/**
 * Created by the_s on 2017/8/27.
 */
var myMap = {
    chooseMark: null,
    addOrUpdateMark: 'update',//add 点击可以添加新的点，update 点击换chooseMar
    saveMark: null,//保存当前点进地图，添加新可选择点
    deleteMark: null,//删除景点的时候
    noChooseMark: null,//移除chooseMark
    newChooseMark: null,//移除chooseMark
    panTo: null//移除chooseMark
};


$(function () {
    /**
     * my baidu map API
     */

    const BAIDU_ICON_DEFAULT = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
        offset: new BMap.Size(10, 25), // 指定定位位置
        imageOffset: new BMap.Size(0, 0 - 11 * 25) // 设置图片偏移
    });
    const BAIDU_ICON_FOCUS = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
        offset: new BMap.Size(10, 25), // 指定定位位置
        imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
    });

    /**
     *地图初始化
     */
// 创建地图对象并初始化
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point,4 );
    map.enableInertialDragging();
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
    map.disableDoubleClickZoom();


    /**
     * myAPI 函数初始化
     * @type {BMap.Geolocation}
     */
        //加载mark
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            addchooseMark(r.point);
        }
        else {
            addchooseMark('上海');
        }
    }, {enableHighAccuracy: true});
    myMap.saveMark = function () {//保存当前点，添加新可选择点
        if (myMap.chooseMark != null) {
            myMap.chooseMark.setIcon(BAIDU_ICON_DEFAULT);
            myMap.chooseMark = null;
        }
    };
    myMap.newChooseMark=function(){
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                addchooseMark(r.point);
            }
            else {
                addchooseMark('上海');
            }
        }, {enableHighAccuracy: true});
    };
    myMap.deleteMark = function (mark) {
        map.removeOverlay(mark);
    };

    myMap.noChooseMark = function () {
        map.removeOverlay(myMap.chooseMark);
        myMap.chooseMark = null;
    };
    myMap.panTo = function (mark) {
        map.panTo(mark.point);
    };
    //创建检索控件
    var searchControl = new BMapLib.SearchControl({
        container: "searchBox" //存放控件的容器
        , map: map  //关联地图对象
        , type: LOCAL_SEARCH  //检索类型
    });
    document.getElementById("selectType").onchange = function () {
        searchControl.setType(this.value);
    };

    //地图上选点标记并且设为中心
    function addchooseMark(point) {
        if (myMap.addOrUpdateMark == 'update') map.removeOverlay(myMap.chooseMark);
        myMap.chooseMark = new BMap.Marker(point, {icon: BAIDU_ICON_FOCUS});
        map.addOverlay(myMap.chooseMark);
        map.panTo(point);
        return myMap.chooseMark;
    };

    //地图点击标记选取
    function clickHandler(e) {
        console.log(e.point.lng + ", " + e.point.lat);
        addchooseMark(e.point);
    }

    map.addEventListener('click', clickHandler);

});