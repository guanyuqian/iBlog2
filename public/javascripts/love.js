/**
 * Created by the_s on 2017/9/6.
 */
var travelList = [];
$(function () {

    $.ajax({
        url: 'timeline', //这里是静态页的地址
        type: "GET", //静态页用get方法，否则服务器会抛出405错误
        success: function (data) {
            $("#timeline").html(data);
            //获取旅游列表
            $.ajax({
                url: 'getTravels', //这里是静态页的地址
                type: "GET", //静态页用get方法，否则服务器会抛出405错误
                success: function (data) {
                    travelList = data.travels;
                    try {
                        PretreatmentTravels(travelList);
                    } catch (e) {
                    }
                    loadTimeline();
                    $("input[name='tl-group']").change(function (e) {
                        for (var i in travelList) {
                            var travel= travelList[i];
                            if (e.target.id == travel.UniqueId) {
                                myMap.setAnimationToTravelListByTravel(travel,true);
                            }else{
                                myMap.setAnimationToTravelListByTravel(travel,false);
                            }
                        }
                    });
                }
            });
        }
    });

    //地图初始化
    myMap.noChooseMark();
    myMap.enableClickAddChooseMark = false;//不可点选新点
    myMap.enableClickSetMarkListAnimation = true;

    //预处理游记
    function PretreatmentTravels(travels) {
        for (var i in travels) {

            if (typeof travels[i].scenicList == "undefined" || travels[i].scenicList.length == 0) {
                travels[i].beginTime = 'XXXX';
                travels[i].endTime = 'XXXX';
            } else {
                travels[i].scenicList = JSON.parse(travels[i].scenicList);
                travels[i].beginTime = getMaxOrMinPlayTime('max', travels[i].scenicList);
                travels[i].endTime = getMaxOrMinPlayTime('min', travels[i].scenicList);
                loadScenicList2Map(travels[i]);
            }
        }
    }

    //获取最大或者最小时间
    getMaxOrMinPlayTime = function (maxOrMin, scenicList) {
        var result = scenicList[0];
        scenicList.forEach(function (ele, index, arr) {
            if (maxOrMin == 'max' && ele.playTime < result.playTime) {
                result = ele;
            }
            else if (maxOrMin == 'min' && ele.playTime > result.playTime) {
                result = ele;
            }
        });
        return result.playTime;
    };
    loadTimeline();
});


function loadTimeline() {
    $('#timeline-container').html("");
    console.log(travelList);
    for (var i in travelList) {
        var timelineLi = ['<li class="event">',
            '    <input type="radio" name="tl-group" id="' + travelList[i].UniqueId + '"checked/>',
            '    <label>',
            '    </label>',
            '    <div class="thumb user-4">',
            '   <span> <i class="fa fa-hourglass-start"></i>',
            travelList[i].beginTime,
            '</span>',
            '   <span class="below"> <i class="fa fa-hourglass-end"></i>',
            travelList[i].endTime,
            '</span>',
            '    </div>',
            '    <div class="content-perspective">',
            '        <div class="content">',
            '            <div class="content-inner">',
            '                <h3>',
            travelList[i].Title,
            '                </h3>',
            '                <p>',
            '                  <a href=\"/blog/loveTravel/' + travelList[i].Alias + '\" target=\"_blank\">',
            travelList[i].Summary,
            '                   </a>',
            '                </p>',
            '            </div>',
            '        </div>',
            '    </div>',
            '</li>'].join("");
        $('#timeline-container').append(timelineLi);
    }

}