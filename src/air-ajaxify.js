/**
 * @name: air-ajaxify
 * @version: 1.0.95
 * @author: A.I.Roland
 * @description：A.I.R light-weight SPA framework, based on AJAX, with loadingbar and custom options.
 * @作者：张英磊
 * @site: https://github.com/airoland/air-ajaxify
 * @org: https://github.com/air-js
 * @github: https://github.com/airoland
 * @blog: https://airoland.github.io/
 * @license: MIT
 * Please do not delete the copyright information
 * 请勿删除版权信息
 */

;
! function($, window, document, undefined) {
    "use strict";

    var tags = ['aa-url', 'aa-target', 'aa-loadingbar-show', 'aa-body', 'aa-replace', 'aa-title', 'aa-body-required', 'aa-loadingbar-direction', 'aa-loadingbar-opacity', 'aa-loadingbar-class', 'aa-loadingbar-color', 'aa-loadingbar-height', 'aa-loadingbar-width', 'aa-loadingbar-shadow', 'aa-loadingcontent-html', 'aa-loadingcontent-class', 'aa-loadingcontent-show'];

    var win, dom, ready = {
        getPath: function() {
            var js = document.scripts,
                script = js[js.length - 1],
                jsPath = script.src;
            if (script.getAttribute('merge')) return;
            return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
        }()
    };

    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };

    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    var air = $.extend({
        project: 'air.js',
        author: 'A.I.Roland',
        author_cn: '张英磊',
        org_site: 'https://github.com/air-js',
        personal_site: 'https://github.com/airoland',

        isEmpty: function(arg) {
            if (typeof(arg) == "undefined" || null == arg || "" === arg)
                return true;
            else if (typeof(arg) == "object") {
                var flag = true;
                $.each(arg, function(index, el) {
                    flag = false;
                    return false;
                });
                return flag;
            }
            else
                return false;
        },

        rmspStr: function(str) {
            for (var i = 0; i < str.length; i++)
                str = str.replace(' ', '');
            return str;
        },

        getParam: function(key) {
            var reg_url = /^[^\?]+\?([\w\W]+)$/,
                reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
                url = location.href,
                arr_url = reg_url.exec(url),
                ret = {};
            if (arr_url && arr_url[1]) {
                var str_para = arr_url[1],
                    result;
                while ((result = reg_para.exec(str_para)) != null) {
                    ret[result[1]] = result[2];
                }
            }
            if (!key)
                return ret;
            else
                return ret[key];
        },

        isMobile: function() {
            if (window.screen.width < 768 || document.body.clientWidth < 768)
                return true;
            else
                return false;
        },

        setRem: function() {
            $("body").prepend("<script>document.documentElement.style.fontSize = 20 * (document.body.clientWidth / 320) + 'px';</script>");
        }
    }, window.air);

    var sharp_flag = false;

    if (!air.ajaxify_param)
        air.ajaxify_param = {};
    if (!air.ajaxify_data)
        air.ajaxify_data = {};
    if (!air.ajaxify_data_temp)
        air.ajaxify_data_temp = {};
    if (!air.ajaxify_history)
        air.ajaxify_history = {};
    if (!air.ajaxify_history_options)
        air.ajaxify_history_options = {};
    if (!air.ajaxify_refresh)
        air.ajaxify_refresh = {};
    if (!air.ajaxify_user_options)
        air.ajaxify_user_options = {};
    if (!air.ajaxify_isForward)
        air.ajaxify_isForward = {};
    if (!air.ajaxify_title)
        air.ajaxify_title = {};

    if (!air.ajaxify_history_on_back)
        air.ajaxify_history_on_back = {
            stacks: {},
            options: {},
            bodynamestack: []
        };
    if (!air.ajaxify_onfresh_action)
        air.ajaxify_onfresh_action = {};
    // 浏览器的操作状态记录
    if (!air.ajaxify_browser)
        air.ajaxify_browser = {
            refresh: {},
            back: {
                action: {},
                runflag: {},
                runaction: {},
                block: false,
                blockaction: undefined
            }
        };
    air.ajaxify_browser.refresh.runaction = true;

    air.ajaxify_global_options = $.extend(true, {
        elem: undefined,
        url: undefined,
        target: undefined,
        replace: false,
        title: undefined,
        loadingBar: {
            color: undefined,
            height: undefined,
            width: undefined,
            opacity: undefined,
            direction: 'right',
            shadow: true,
            cssClass: undefined,
            show: true
        },
        loadingContent: {
            html: undefined,
            cssClass: undefined,
            show: true
        },
        loadingFunction: {
            pre: undefined,
            after: undefined,
            show: true
        },
        prepare: undefined,
        before: undefined,
        sucess: undefined,
        render: undefined,
        afterRender: undefined,
        error: undefined,
        time: 15000,
        timeout: undefined,
        complete: undefined,
        param: undefined,
        data: undefined,
        bodyRequired: false
    }, air.ajaxify_global_options);

    air.ajaxify = function(user_options) {
        var user_flag = !user_options ? false : true;
        var elem_flag = !$.extend({}, air.ajaxify_global_options, user_options).elem ? false : true;
        if (!elem_flag) {
            air.ajaxify_global_options = $.extend(true, {}, air.ajaxify_global_options, user_options);
            air.ajaxify_global_options.loadingBar.show = (air.ajaxify_global_options.loadingBar.show) ? true : false;
            air.ajaxify_global_options.loadingBar.shadow = (air.ajaxify_global_options.loadingBar.shadow) ? true : false;
            air.ajaxify_global_options.loadingBar.direction = {
                'right': 'right',
                'left': 'left',
                'down': 'down',
                'up': 'up'
            }[air.ajaxify_global_options.loadingBar.direction] || 'right';
            air.ajaxify_global_options.loadingContent.show = (air.ajaxify_global_options.loadingContent.show) ? true : false;
        } else {
            air.ajaxify_user_options[user_options.elem] = $.extend(true, {}, air.ajaxify_user_options[user_options.elem], user_options);
            user_options = air.ajaxify_user_options[user_options.elem];
        }

        $("head style#aa-css").remove();
        $("head").prepend("<style type='text/css' id='aa-css'>" + "#loadingbar{position:fixed;z-index:2147483647;top:0;left:-6px;width:1%;height:2px;background:#b91f1f;-moz-border-radius:1px;-webkit-border-radius:1px;border-radius:1px;-moz-transition:all 500ms ease-in-out;-ms-transition:all 500ms ease-in-out;-o-transition:all 500ms ease-in-out;-webkit-transition:all 500ms ease-in-out;transition:all 500ms ease-in-out}#loadingbar.left{left:100%;right:0;width:100%}#loadingbar.up{left:0;top:100%;width:5px;bottom:0;height:100%}#loadingbar.down{left:0;width:5px;height:0}#loadingbar.waiting dd,#loadingbar.waiting dt{-moz-animation:pulse 2s ease-out 0s infinite;-ms-animation:pulse 2s ease-out 0s infinite;-o-animation:pulse 2s ease-out 0s infinite;-webkit-animation:pulse 2s ease-out 0s infinite;animation:pulse 2s ease-out 0s infinite}#loadingbar dt{opacity:.6;width:180px;right:-80px;clip:rect(-6px,90px,14px,-6px)}#loadingbar dd{opacity:.6;width:20px;right:0;clip:rect(-6px,22px,14px,10px)}#loadingbar dd,#loadingbar dt{position:absolute;top:0;height:2px;-moz-box-shadow:#b91f1f 1px 0 6px 1px;-ms-box-shadow:#b91f1f 1px 0 6px 1px;-webkit-box-shadow:#b91f1f 1px 0 6px 1px;box-shadow:#b91f1f 1px 0 6px 1px;-moz-border-radius:100%;-webkit-border-radius:100%;border-radius:100%}#loadingbar.left dt{opacity:.6;width:180px;left:-4px;clip:rect(-6px,185px,14px,25px)}#loadingbar.left dd{opacity:.6;width:20px;left:0;margin:0;clip:rect(-6px,22px,14px,0px)}#loadingbar.left dd,#loadingbar.left dt{top:0;height:2px}#loadingbar.down dt{opacity:.6;height:180px;top:auto;bottom:-47px;clip:rect(-6px,20px,130px,-6px)}#loadingbar.down dd{opacity:.6;height:20px;top:auto;bottom:0;clip:rect(-6px,22px,20px,10px);margin:0}#loadingbar.down dd,#loadingbar.down dt{left:-5px;right:auto;width:10px}#loadingbar.up dt{opacity:.6;height:180px;bottom:auto;top:-10px;clip:rect(13px,20px,190px,-6px)}#loadingbar.up dd{opacity:.6;height:20px;bottom:auto;top:0;clip:rect(-6px,22px,25px,10px);margin:0}#loadingbar.up dd,#loadingbar.up dt{left:-5px;right:auto;width:10px}@keyframes pulse{30%{opacity:.6}60%{opacity:0}100%{opacity:.6}}@-moz-keyframes pulse{30%{opacity:.6}60%{opacity:0}100%{opacity:.6}}@-ms-keyframes pulse{30%{opacity:.6}60%{opacity:0}100%{opacity:.6}}@-webkit-keyframes pulse{30%{opacity:.6}60%{opacity:0}100%{opacity:.6}}" + "</style>");

        var fn = air.ajaxify;
        fn.param = function(body_name, key) {
            if(!air.isEmpty(air.ajaxify_param[body_name])){
                if (key)
                    return air.ajaxify_param[body_name][air.ajaxify_param[body_name].length-1][key];
                return air.ajaxify_param[body_name][air.ajaxify_param[body_name].length-1];
            }
        };
        fn.setData = function(body_name, content) {
            air.ajaxify_data_temp[body_name] = content;
        };
        fn.getData = function(body_name) {
            if(!air.isEmpty(air.ajaxify_data[body_name]))
                return air.ajaxify_data[body_name][air.ajaxify_data[body_name].length-1];
        };
        fn.go = function(elem) {
            $(elem).trigger('click.air.ajaxify');
        };
        fn.back = function(body_name, is_new_request, browser_options) {
            if (air.ajaxify_browser.back.block) {
                if(!air.isEmpty(air.ajaxify_browser.back.blockaction) && typeof air.ajaxify_browser.back.blockaction == 'function')
                    air.ajaxify_browser.back.blockaction();
                if(location.href.indexOf("/#") < 0 && air.ajaxify_history_on_back.flag)
                    window.history.pushState({url: "#"}, "", "#");
            }
            else {
                var back_flag = true;
                if(air.isEmpty(browser_options) && !air.isEmpty(air.ajaxify_history_on_back.options[body_name])){
                    browser_options = air.ajaxify_history_on_back.options[body_name][air.ajaxify_history_on_back.options[body_name].length-1];
                }
                if (!air.isEmpty(air.ajaxify_history[body_name])){
                    air.ajaxify_data[body_name].pop();
                    air.ajaxify_history_options[body_name].pop();
                    air.ajaxify_refresh[body_name].pop();
                    air.ajaxify_param[body_name].pop();
                    $("title").html(air.ajaxify_title[body_name].pop());

                    if(!air.isEmpty(browser_options)){
                        if(browser_options.global || browser_options.browser){
                            var back_action_flag = true;
                            if(!air.isEmpty(browser_options.action) && (air.ajaxify_history_on_back.stacks[body_name].length === air.ajaxify_history_on_back.options[body_name][air.ajaxify_history_on_back.options[body_name].length-1].startIndex || browser_options.propagate)){
                                back_action_flag = browser_options.action();
                            }
                            back_flag = back_action_flag;
                        }
                    }

                    if(air.isEmpty(back_flag) || eval(back_flag)){
                        if(is_new_request === true && !air.isEmpty(air.ajaxify_history_options[body_name])){
                            air.ajaxify_history[body_name].pop();
                            var back_options = air.ajaxify_history_options[body_name][air.ajaxify_history_options[body_name].length-1];
                            back_options.backNewRequest = true;
                            sendRequest(back_options);
                        }
                        else {
                            $("[aa-body=" + body_name + "]").html(air.ajaxify_history[body_name].pop());
                            air.ajaxify();
                            if(!air.isEmpty(air.ajaxify_history_on_back.stacks[body_name]) && air.ajaxify_history_on_back.stacks[body_name].length <= air.ajaxify_history_on_back.options[body_name][air.ajaxify_history_on_back.options[body_name].length-1].startIndex){
                                air.ajaxify_history_on_back.options[body_name].pop();
                                fn.on(air.ajaxify_history_on_back.options[body_name][air.ajaxify_history_on_back.options[body_name].length-1]);
                            }
                        }
                    }
                }
                if(back_flag && air.ajaxify_history_on_back.flag){
                    air.ajaxify_back_flag = true;
                    if(!air.isEmpty(air.ajaxify_history_on_back.stacks[body_name])){
                        air.ajaxify_history_on_back.stacks[body_name].pop();
                        var stacks_length = air.ajaxify_history_on_back.stacks[body_name].length;
                        if(browser_options.waitOthers && getJsonLength(air.ajaxify_history_on_back.options)>1){
                            if(stacks_length == 0){
                                // air.ajaxify_history_on_back.bodynamestack.remove(body_name);
                                // delete air.ajaxify_history_on_back.options[body_name];
                                var other_bodyname = air.ajaxify_history_on_back.bodynamestack[air.ajaxify_history_on_back.bodynamestack.length-1];
                                // air.ajaxify.back(other_bodyname, browser_options.newRequest, browser_options);
                                if(!air.isEmpty(air.ajaxify_history_on_back.options[other_bodyname]))
                                    fn.on(air.ajaxify_history_on_back.options[other_bodyname][air.ajaxify_history_on_back.options[other_bodyname].length-1]);
                            }
                            var stacks_length_array = new Array();
                            $.each(air.ajaxify_history_on_back.stacks, function(index, el) {
                                stacks_length_array.push(el.length);
                            });
                            stacks_length = Math.max.apply(null, stacks_length_array);
                            if (stacks_length === 1 && !air.ajaxify_browser.back.flag) {
                                history.back();
                            }
                            else if(stacks_length === 0 && !air.isEmpty(browser_options.action) && location.href.indexOf("/#") > -1){
                                history.back();
                                history.back();
                            }
                        }
                        else if(stacks_length === 0 || (stacks_length === 1 && !air.ajaxify_browser.back.flag)){
                            history.back();
                        }
                        if(stacks_length > 1 || (stacks_length == 1 && !air.isEmpty(browser_options.action))){
                            if(location.href.indexOf("/#") < 0)
                                window.history.pushState({url: "#"}, "", "#");
                        }
                    }
                }
                else {
                    if(location.href.indexOf("/#") < 0)
                        window.history.pushState({url: "#"}, "", "#");
                }
            }
        };
        fn.refresh = function(body_name) {
            if (!air.isEmpty(air.ajaxify_refresh[body_name])) {
                var refresh_flag = false;
                if(!air.isEmpty(air.ajaxify_browser.refresh.options) && air.ajaxify_browser.refresh.options.global){
                    var browser_refresh_options = air.ajaxify_browser.refresh.options;
                    var refresh_action_flag = true;
                    if(!air.isEmpty(browser_refresh_options.action) && air.ajaxify_browser.refresh.runaction){
                        refresh_action_flag = browser_refresh_options.action();
                        if(air.ajaxify_browser.refresh.runflag)
                            air.ajaxify_browser.refresh.runaction = false;
                    }
                    if(air.isEmpty(refresh_action_flag) || eval(refresh_action_flag)){
                        refresh_flag = true;
                    }
                }
                else {
                    refresh_flag = true;
                }

                if(refresh_flag){
                    $("[aa-body=" + body_name + "]").html("");
                    var refresh_options = air.ajaxify_refresh[body_name][air.ajaxify_refresh[body_name].length-1];
                    refresh_options.isRefresh = true;
                    sendRequest(refresh_options);
                }
            }
        };
        fn.send = function(send_options) {
            var send_elem_flag = !$.extend({}, air.ajaxify_global_options, send_options).elem ? false : true;
            if (send_elem_flag) {
                send_options = $.extend(true, {}, air.ajaxify_user_options[send_options.elem], send_options);
                readyRequest($(send_options.elem), air.ajaxify_global_options, send_options, true);
            } else {
                sendRequest($.extend(true, {}, air.ajaxify_global_options, send_options));
            }
        };

        fn.on = function(options) {
            options = $.extend(true, {
                type: undefined,
                body: undefined,
                browser: true,
                global: true,
                action: undefined,
                propagate: false,
                newRequest: false,
                waitOthers: true
            }, options);
            var body_name = options.body;
            if(options.type === "back"){
                // 统一按数组处理body
                air.ajaxify_onback_body = [];
                if(typeof body_name == "string" && !air.isEmpty(body_name)){
                    air.ajaxify_onback_body.push(body_name);
                }
                else if(typeof body_name == "object"){
                    $.each(body_name, function(index, el) {
                        air.ajaxify_onback_body.push(el);
                    });
                }
                else if(air.isEmpty(body_name)){
                    $("*[aa-body]").each(function(index, el) {
                        air.ajaxify_onback_body.push($(this).attr("aa-body"));
                    });
                }

                if(!air.isEmpty(options.action) && location.href.indexOf("/#") < 0 && !sharp_flag){
                    window.history.pushState({url: "#"}, "", "#");
                    sharp_flag = true;
                }

                if(options.browser){
                    $(window).off("popstate.air.ajaxify");
                    $(window).on('popstate.air.ajaxify', function(event) {
                        air.ajaxify_browser.back.flag = true;
                        $.each(air.ajaxify_onback_body, function(index, body_name) {
                            air.ajaxify.back(body_name, options.newRequest, options);
                            if(air.ajaxify_browser.back.block)
                                return false;
                        });
                        air.ajaxify_browser.back.flag = false;
                    });
                }
                air.ajaxify_history_on_back.flag = true;
                // 初始栈
                $.each(air.ajaxify_onback_body, function(index, body_name) {
                    if(!air.ajaxify_history_on_back.stacks[body_name]){
                        air.ajaxify_history_on_back.stacks[body_name] = new Array();
                        air.ajaxify_history_on_back.stacks[body_name].push(1);
                    }
                    if(!air.ajaxify_history_on_back.options[body_name])
                        air.ajaxify_history_on_back.options[body_name] = new Array();
                    if(air.isEmpty(options.startIndex) && (air.isEmpty(air.ajaxify_isForward[body_name]) || air.ajaxify_isForward[body_name]) && !air.ajaxify_browser.refresh.flag && !air.ajaxify_back_flag){
                        options.startIndex = air.ajaxify_history_on_back.stacks[body_name].length;
                        air.ajaxify_history_on_back.options[body_name].push(options);
                        air.ajaxify_history_on_back.bodynamestack.push(body_name);
                        options.startIndex = undefined;
                    }
                });
            }
            if(options.type === "refresh"){
                air.ajaxify_onfresh_body = [];
                if(typeof body_name == "string" && !air.isEmpty(body_name))
                    air.ajaxify_onfresh_body.push(body_name);
                else if(typeof body_name == "object"){
                    $.each(body_name, function(index, el) {
                        air.ajaxify_onfresh_body.push(el);
                    });
                }
                else if(air.isEmpty(body_name)){
                    $("*[aa-body]").each(function(index, el) {
                        air.ajaxify_onfresh_body.push($(this).attr("aa-body"));
                    });
                }
                $.each(air.ajaxify_onfresh_body, function(index, el) {
                    air.ajaxify_onfresh_action[el] = options.action;
                });
                air.ajaxify_browser.refresh.options = options;
                $(window).off('beforeunload.air.ajaxify');
                $(window).on('beforeunload.air.ajaxify', function(event) {
                    if(options.browser && air.ajaxify_onfresh_body.length>0){
                        air.ajaxify_browser.refresh.flag = true;
                        air.ajaxify_browser.refresh.runflag = true;
                        localStorage.setItem("_air_ajaxify_refresh_storage_", JSON.stringify(air));
                    }
                });
            }
        };

        fn.off = function(type){
            if(type == "back"){
                $(window).off("popstate.air.ajaxify");
                air.ajaxify_history_on_back.flag = false;
            }
            if(type == "refresh")
                $(window).off("beforeunload.air.ajaxify");
            if(type == "block")
                air.ajaxify_browser.back.block = false;
        }

        fn.block = function(type, action){
            if(type == "back"){
                if(location.href.indexOf("/#") < 0 && !sharp_flag && air.ajaxify_history_on_back.flag){
                    window.history.pushState({url: "#"}, "", "#");
                    sharp_flag = true;
                }
                air.ajaxify_browser.back.block = true;
                air.ajaxify_browser.back.blockaction = action;
            }
        }

        fn.continue = function(type, body_name){
            if(type == "back"){
                air.ajaxify_browser.back.block = false;
                air.ajaxify_browser.back.blockaction = undefined;
                if(air.ajaxify_history_on_back.flag)
                    history.back();
                else
                    air.ajaxify.back(body_name);
                // 如果是初始页面则离开
                setTimeout(function(){
                    if (location.href.indexOf("/#") < 0)
                        history.back();
                },0);
            }
        }

        if (elem_flag) {
            $(user_options.elem).each(function() {
                $(this).off('click.air.ajaxify');
                $(this).on('click.air.ajaxify', function() {
                    readyRequest($(this), air.ajaxify_global_options, user_options, elem_flag);
                });
            });
        } else {
            $("*[aa-url]").each(function() {
                var events = $._data($(this)[0], "events"),
                    add_events = true;
                if (!events || !events['click']) {
                    $(this).on('click.air.ajaxify', function() {
                        readyRequest($(this), air.ajaxify_global_options, user_options, elem_flag);
                    });
                } else {
                    // 如果已有click事件，则只重置air.ajaxify的click事件
                    for (var i = 0; i < events['click'].length; i++) {
                        if (events['click'][i].namespace == "air.ajaxify") {
                            add_events = false;
                            break;
                        }
                    }
                    if (add_events) {
                        $(this).on('click.air.ajaxify', function() {
                            readyRequest($(this), air.ajaxify_global_options, user_options, elem_flag);
                        });
                    }
                }
            });
        }
    };

    function readyRequest(dom, global_options, user_options, elem_flag) {
        var temp_options = {};
        temp_options.loadingBar = {};
        temp_options.loadingContent = {};
        temp_options.url = !dom.attr("aa-url") ? undefined : dom.attr("aa-url");
        temp_options.target = !dom.attr("aa-target") ? undefined : dom.attr("aa-target");
        temp_options.replace = typeof dom.attr('aa-replace') == "undefined" ? global_options.replace : (dom.attr("aa-replace") == "false" ? false : true);
        temp_options.title = !dom.attr("aa-title") ? undefined : dom.attr("aa-title");
        temp_options.loadingBar.show = (dom.attr("aa-loadingbar-show") == "false" || dom.attr("aa-loadingbar-show") == "true") ? eval(dom.attr("aa-loadingbar-show")) : global_options.loadingBar.show;
        temp_options.loadingBar.color = !dom.attr("aa-loadingbar-color") ? undefined : dom.attr("aa-loadingbar-color");
        temp_options.loadingBar.height = !dom.attr("aa-loadingbar-height") ? undefined : dom.attr("aa-loadingbar-height");
        temp_options.loadingBar.width = !dom.attr("aa-loadingbar-width") ? undefined : dom.attr("aa-loadingbar-width");
        temp_options.loadingBar.opacity = !dom.attr("aa-loadingbar-opacity") ? undefined : dom.attr("aa-loadingbar-opacity");
        temp_options.loadingBar.cssClass = !dom.attr("aa-loadingbar-class") ? undefined : dom.attr("aa-loadingbar-class");
        temp_options.loadingBar.shadow = (dom.attr("aa-loadingbar-shadow") == "false" || dom.attr("aa-loadingbar-shadow") == "true") ? eval(dom.attr("aa-loadingbar-shadow")) : global_options.loadingBar.shadow;
        temp_options.loadingBar.direction = {
            'right': 'right',
            'left': 'left',
            'down': 'down',
            'up': 'up'
        }[dom.attr("aa-loading-direction")] || global_options.loadingBar.direction;
        temp_options.loadingContent.html = !dom.attr("aa-loadingcontent-html") ? undefined : dom.attr("aa-loadingcontent-html");
        temp_options.loadingContent.cssClass = !dom.attr("aa-loadingcontent-class") ? undefined : dom.attr("aa-loadingcontent-class");
        temp_options.loadingContent.show = (dom.attr("aa-loadingcontent-show") == "false" || dom.attr("aa-loadingcontent-show") == "true") ? eval(dom.attr("aa-loadingcontent-show")) : global_options.loadingContent.show;
        temp_options.bodyRequired = (dom.attr("aa-body-required") == "false" || dom.attr("aa-body-required") == "true") ? eval(dom.attr("aa-body-required")) : global_options.bodyRequired;

        temp_options = $.extend(true, {}, global_options, temp_options);

        if (elem_flag) {
            temp_options = $.extend(true, {}, temp_options, user_options);
        }
        temp_options.self = dom;
        var eval_prepare = true;
        if (temp_options.prepare)
            eval_prepare = temp_options.prepare(temp_options);
        if (air.isEmpty(eval_prepare) || eval(eval_prepare)){
            if(typeof eval_prepare == "object")
                temp_options = $.extend(true, {}, temp_options, eval_prepare);
            sendRequest(temp_options);
        }
    }

    function sendRequest(op) {
        var body_name = op.target;
        var isForward = !op.backNewRequest && !op.isRefresh;
        air.ajaxify_isForward[body_name] = isForward;
        if (op.bodyRequired) {
            if (!$("[aa-body=" + body_name + "]").get(0)) {
                console.warn("[Air warn]: Can not find aa-body named: " + body_name);
                return false;
            }
        }
        op.loadingBar.shadow = (op.loadingBar.shadow) ? "" : "none";
        $("head style#aa-loadingbar-class").remove();
        $("head").append("<style type='text/css' id='aa-loadingbar-class'>" + "#loadingbar{background:" + op.loadingBar.color + ";height:" + op.loadingBar.height + ";width:" + op.loadingBar.width + ";}" + "#loadingbar dd,#loadingbar dt{height:" + op.loadingBar.height + ";width:" + op.loadingBar.width + ";display:" + op.loadingBar.shadow + ";-moz-box-shadow:" + op.loadingBar.color + " 1px 0 6px 1px;-ms-box-shadow:" + op.loadingBar.color + " 1px 0 6px 1px;-webkit-box-shadow:" + op.loadingBar.color + " 1px 0 6px 1px;box-shadow:" + op.loadingBar.color + " 1px 0 6px 1px;}" + "</style>");

        var loadingcontent_tempid = "loadingcontent_tempid_" + Date.parse(new Date());

        $.ajax({
            type: "GET",
            cache: false,
            url: op.url,
            dataType: "html",
            timeout: op.time,
            headers: {
                "If-Modified-Since": "Thu, 01 Jun 1970 00:00:00 GMT"
            },
            beforeSend: function() {
                if (op.before)
                    op.before(op);
                if (op.loadingFunction.show && op.loadingFunction.pre)
                    op.loadingFunction.pre(op);
                if (op.loadingContent.show && op.loadingContent.html)
                    $('body').append("<div id=" + loadingcontent_tempid + " class=" + op.loadingContent.cssClass + ">" + op.loadingContent.html + "</div>");
                if (op.loadingBar.show) {
                    if ($("#loadingbar").length === 0) {
                        $("body").append("<div id='loadingbar' class=" + op.loadingBar.cssClass + "></div>")
                        $("#loadingbar").addClass("waiting").append($("<dt/><dd/>"));

                        switch (op.loadingBar.direction) {
                            case 'right':
                                $("#loadingbar").width((50 + Math.random() * 30) + "%");
                                break;
                            case 'left':
                                $("#loadingbar").addClass("left").animate({
                                    right: 0,
                                    left: 100 - (50 + Math.random() * 30) + "%"
                                }, 200);
                                break;
                            case 'down':
                                $("#loadingbar").addClass("down").animate({
                                    left: 0,
                                    height: (50 + Math.random() * 30) + "%"
                                }, 200);
                                break;
                            case 'up':
                                $("#loadingbar").addClass("up").animate({
                                    left: 0,
                                    top: 100 - (50 + Math.random() * 30) + "%"
                                }, 200);
                                break;
                        }
                    }
                }
            },
            success: function(data) {
                if (op.success)
                    op.success(op, data);
                var eval_render = true;
                if (op.render)
                    eval_render = op.render(op, data);
                if (air.isEmpty(eval_render) || eval(eval_render)) {
                    if(location.href.indexOf("/#") < 0 && air.ajaxify_history_on_back.flag){
                        window.history.pushState({url: "#"}, "", "#");
                        sharp_flag = true;
                    }
                    if(air.ajaxify_browser.back.block){
                        air.ajaxify_browser.back.block = false;
                        air.ajaxify_browser.back.blockaction = undefined;
                    }
                    if(!air.ajaxify_title[body_name])
                        air.ajaxify_title[body_name] = new Array();
                    if (!air.ajaxify_history[body_name])
                        air.ajaxify_history[body_name] = new Array();
                    if (!air.ajaxify_history_options[body_name])
                        air.ajaxify_history_options[body_name] = new Array();
                    if(!air.ajaxify_refresh[body_name])
                        air.ajaxify_refresh[body_name] = new Array();
                    if(!air.ajaxify_param[body_name])
                        air.ajaxify_param[body_name] = new Array();
                    // 保存历史记录
                    if(isForward){
                        air.ajaxify_history[body_name].push($("[aa-body=" + body_name + "]").html());
                        air.ajaxify_history_options[body_name].push(op);
                        air.ajaxify_refresh[body_name].push(op);
                        air.ajaxify_param[body_name].push(getParamToJson(op.url));
                        air.ajaxify_title[body_name].push($("title").html());
                        if(!air.isEmpty(op.title))
                            $("title").html(op.title);
                        if(op.replace){
                            air.ajaxify_history[body_name].pop();
                            air.ajaxify_history_options[body_name].pop();
                            air.ajaxify_refresh[body_name].pop();
                            air.ajaxify_param[body_name].pop();
                            air.ajaxify_title[body_name].pop();
                        }
                        air.ajaxify_browser.refresh.flag = false;
                        air.ajaxify_back_flag = false;
                    }
                    // 保存data
                    if(!air.ajaxify_data[body_name])
                        air.ajaxify_data[body_name] = new Array();
                    if(isForward && !air.isEmpty(air.ajaxify_data_temp[body_name]))
                        air.ajaxify_data[body_name].push(air.ajaxify_data_temp[body_name]);

                    if(isForward && !air.isEmpty(air.ajaxify_history_on_back.stacks[body_name]) && air.ajaxify_history_on_back.stacks[body_name].length > 0){
                        air.ajaxify_history_on_back.stacks[body_name].push(1);
                    }
                    // 渲染页面
                    $("[aa-body=" + body_name + "]").html(data);

                    if (op.afterRender)
                        op.afterRender(op, data);
                    air.ajaxify();
                }
            },
            error: function(data) {
                console.warn("[Air warn]: AJAX request error. The information is:");
                console.log(data);
                if (op.error)
                    op.error(op, data);
                else
                    $("[aa-body=" + body_name + "]").html('<h4>无法加载请求的内容 -- Could not load the requested content.</h4>');
            },
            complete: function(XMLHttpRequest, status) {
                if (op.loadingContent.show && op.loadingContent.html)
                    $('#' + loadingcontent_tempid).remove();
                if (op.loadingBar.show) {
                    switch (op.loadingBar.direction) {
                        case 'right':
                            $("#loadingbar").width("101%").delay(200).fadeOut(400, function() {
                                $(this).remove();
                            });
                            break;
                        case 'left':
                            $("#loadingbar").animate({
                                left: 0
                            }).delay(200).fadeOut(400, function() {
                                $(this).remove();
                            });
                            break;
                        case 'down':
                            $("#loadingbar").animate({
                                height: "101%"
                            }).delay(200).fadeOut(400, function() {
                                $(this).remove();
                            });
                            break;
                        case 'up':
                            $("#loadingbar").animate({
                                top: 0
                            }).delay(200).fadeOut(400, function() {
                                $(this).remove();
                            });
                            break;
                    }
                }
                if (op.loadingFunction.show && op.loadingFunction.after)
                    op.loadingFunction.after(op, XMLHttpRequest, status);
                if (status == 'timeout') {
                    if (op.timeout)
                        op.timeout(op, XMLHttpRequest, status);
                    else
                        $("[aa-body=" + body_name + "]").html('<h4>请求超时 -- Request timeout.</h4>');
                }
                if (op.complete)
                    op.complete(op, XMLHttpRequest, status);
            }
        });
    }

    function getParam(url, paras) {
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {};
        for (var i = 0, j; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof(returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    };

    function getParamToJson(url) {
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
            reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
            arr_url = reg_url.exec(url),
            ret = {};
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1],
                result;
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2];
            }
        }
        return ret;
    }

    function getJsonLength(jsonData){
        var jsonLength = 0;
        for(var item in jsonData){
            jsonLength++;
        }
        return jsonLength;
    }

    window.air = air;

    //主入口
    ready.run = function() {
        win = $(window);
        air.ajaxify();
    };

    'function' === typeof define ? define(function() {
        ready.run();
        return air;
    }) : function() {
        ready.run();
    }();

    var air_storage = localStorage.getItem("_air_ajaxify_refresh_storage_");
    if(!air.isEmpty(air_storage)){
        air = $.extend(true, window.air, JSON.parse(air_storage));
        setTimeout(function(){
            $.each(air.ajaxify_onfresh_body, function(index, el) {
                air.ajaxify.refresh(el);
            });
            air.ajaxify_browser.refresh.runaction = true;
            air.ajaxify_browser.refresh.runflag = false;
        },50);
        localStorage.removeItem("_air_ajaxify_refresh_storage_");
    }

}(jQuery, window, document);
