/**
 * Created by the_s on 2017/9/6.
 */


$(function () {
    //地图初始化
    myMap.noChooseMark();
    myMap.enableClickAddChooseMark = false;//不可点选新点

});


//加载时间轴
function loadTimeline(travelList) {
    $('#timeline-container').html("");
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

