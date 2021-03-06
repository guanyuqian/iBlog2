/**
 * Created by the_s on 2017/9/6.
 */


$(function () {
    //地图初始化
    myMap.noChooseMark();
    myMap.enableClickAddChooseMark = false;//不可点选新点

});

function checkTimelineByUniqueId(index, val, UniqueId) {
    var radio = $('input[name=tl-group]').get(index);
    radio.checked = val;
    if (val) {
        var container = $('#timeline');
        var inner = $('#' + UniqueId);
        console.log(inner);
        console.log(inner.offset());
        // Or you can animate the scrolling:
        container.animate({
            scrollTop: inner.offset().top - container.offset().top + container.scrollTop()-80
        });
    }
}

//加载时间轴
function loadTimeline(travelList) {
    $('#timeline-container').html("");
    var firstCheck = 'checked';
    for (var i in travelList) {
        if (i != 0) firstCheck = '';
        var linkSpan;
        if(travelList[i].Url=="") {
            travelList[i].Url = '/blog/loveTravel/' + travelList[i].Alias;

        }else{
            linkSpan='<i class="fa fa-link"></i>';
        }
        var src=travelList[i].imageCropSrc;
        var timelineLi = ['<li class="event" id="' + travelList[i].UniqueId + '">',
            '    <input type="radio" name="tl-group" id="' + travelList[i].UniqueId + '"' + firstCheck + '/>',
            '    <label>',
            '    </label>',
            '    <div class="thumb" style="background-size:100%; background-image: url('+src+')">',
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
            linkSpan,
            travelList[i].Title,
            '                </h3>',
            '                <p>',
            '                  <a href=\"'+travelList[i].Url+'\" target=\"_blank\">',
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

