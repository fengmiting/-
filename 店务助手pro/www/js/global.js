/*Global 全局操作*/

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

// 开启跨域
$( document ).bind('mobileinit', function() {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.ignoreContentEnabled = true;
});
var SERVER = 'http://123.157.149.17:897/index.php/Api/';				// 数据接口
var WEB    = 'http://123.157.149.17:897/index.php/';
var IMGWEB = 'http://123.157.149.17:897/';                              // 图片服务器

// var SERVER = 'http://127.0.0.1:1004/index.php/Api/';                // 数据接口
// var WEB    = 'http://127.0.0.1:1004/index.php/';
// var IMGWEB = 'http://127.0.0.1:1004/';                              // 图片服务器

// 优化UI触摸
var uiOPT = function(){
    $(function(){
        // 优化 input text
        $('.ui-input-text').tap(function(){
            $(this).find('input').focus();
            return false;
        });

        $('input[type=text]').tap(function(){
            $(this).focus();
            return false;
        });

        $('input[type=password]').tap(function(){
            $(this).focus();
            return false;
        });

        $('textarea').tap(function(){
            $(this).focus();
            return false;
        });
    });
}
uiOPT();

// 自动填充数据
var postData = function(el){
    var data = {};
    el.find(".post-data").each(function(){
        data[$(this).attr('id')] = $(this).val();
    });
    return data;
};

(function($){
    $.Request = function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;
    }
})(window.jQuery);