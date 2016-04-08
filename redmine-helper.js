// ==UserScript==
// @name         redmine helper
// @namespace    http://redmine.gitlab.info
// @version      0.1
// @description  redmine helper
// @author       hys, Wings27
// @match        http://redmine.gitlab.info/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';
    var redmineKey={
        getValue:function(issueId,defaultValue){
            return GM_getValue(this.getKey(issueId),defaultValue);
        },
        setValue:function(issueId,value){
            GM_setValue(this.getKey(issueId),value);
        },
        getKey:function(issueId){
            return "redmineKey_"+issueId;
        }
    };
    var tbObj=$("table.issues");

    var allStatus={
        "新建":"white",
        "完成":"lightgreen",
        "待自测":"lightcoral",
        "待写API":"lightblue",
    };
    function changeColor(obj, colorStr){
        $(obj).css("background", colorStr);
    }

    tbObj.find("thead tr").prepend("<th>我的状态</th>");
    tbObj.find("tbody tr").each(function(i,e){
        var issueIdStr=$(e).attr("id");
        var stateSelect=issueIdStr+"_state";
        var issueId=issueIdStr.split("-")[1];
        var val=redmineKey.getValue(issueId,"新建");
        var optionHtml="";
        $.each(allStatus,function(i,e){
            optionHtml+="<option value='"+i+"' "+(val==i?"selected":"") +' style="background: '+ allStatus[i] +';">'+i+"</option>";
        });
        $(e).prepend("<td><select class='rd_state' issueId='"+issueId+"'>"+optionHtml+"</select></td>");
    });

    $(".rd_state").each(function(){
        changeColor($(this), allStatus[$(this).val()]);
    });
    $(".rd_state").change(function(){
        redmineKey.setValue($(this).attr("issueId"),$(this).val());
        changeColor($(this), allStatus[$(this).val()]);
    });
})();
