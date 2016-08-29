<template>
    <div class="gui-layout-sidebar">
        <h2 class="sidebar-title">
            <a href="/" class="logo"><img v-bind:src="logo" alt=""></a>
            <span class="name">{{homeName}}</span>
        </h2>
        <ul class="gui-sidebar-menu" id="siderbarMenu">
        	<ul class="gui-sidebar-menu-second">
        		<li v-bind:class="{'active' : currentHash === '' || currentHash === '#dashboard'}">
        			<a class="jump" href="#dashboard" menuNum="06">
        				<i class="a-icon gui-fi-person gui-fi-person"></i>
        				我的工作台
        			</a>
        		</li>
        	</ul>
            <li v-for="level1 in menuData">
                <a href="javascript:;">{{level1.name}}</a>

                <ul class="gui-sidebar-menu-second">
                    <li class="has-sub level2" v-for="level2 in level1.children"
                    v-bind:class="{'active' : level2.open}" @click.stop="level2.open = !level2.open;console.log(1)">
                        <a href="javascript:;" v-if="level2.children.length > 0">
                            <i class="a-icon gui-fi-chart <%=level2.iconClass %>"></i>
                            {{level2.name}}
                            <i class="arrow"></i>
                        </a>
                        <ul class="gui-sidebar-menu-third" v-if="level2.children.length > 0">
                            <li v-for="level3 in level2.children"
                            v-bind:class="{'active' : level3.path !== '' && level3.path !== '#' && currentHash.indexOf(level3.path) !== -1}">
                                <a class="jump" href="{{level3.path}}" menuNum="{{level3.menuNum}}" @click.stop="goPath(level3.path)">
                                    {{level3.name}}
                                </a>
                            </li>
                        </ul>
                        <a class="jump" href="{{level2.path}}" menuNum="{{level2.menuNum}}" v-if="level2.children.length === 0" @click.stop="goPath(level3.path)">
                            <i class="a-icon gui-fi-person {{level2.iconClass}}"></i>
                            {{level2.name}}
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="gui-sidebar-menu-footer">
          <a href="help/开始/开始.html" target="_blank">
              <i class="tbdi tbdi-question-circle-o"></i>
              <span class="text">帮助指引</span>
          </a>
        </div>
    </div>
</template>

<script>
require('jquery');
let components = require('@tencent/tbd-design-vue');
let Cookies = require('service/cookies');
import {GE, INTERFACE} from '../config';
import resource from 'service/resource';

export default {
    components: components,
    data() {
        return {
            logo : '',
            homeName : '',
            menuData : [],
            currentHash : ''
        }
    },
    computed: {

    },
    methods: {
        clearRequests() {
            let requests = window.REQUESTS || [];
            for (let i = 0, l = requests.length; i < l; i++) {
                requests[i].abort();
            }
            window.REQUESTS = [];
        },
        goPath(path) {
            window.location.reload();
        },
        reload() {
            const hash = location.hash;
            this.clearRequests();
            $('#siderbarMenu').find('.active').removeClass('active');
            //把当前的path状态选中
            $('#siderbarMenu li a').each(function(){
                let obj = $(this);
                let href = $(this).attr('href');
                if(href !== '' && href !== '#' && hash.indexOf(href) == 0) {
                    obj.parent().addClass('active');
                    obj.parent().parent().parent().addClass('active');
                    obj.parent().parent().parent().parent().parent().addClass('active');
                    return false;
                }
            });
        },

        //渲染Sidebar
        render() {
            let self = this;
            const configMenu = GE.menu;
            const userName = Cookies.getCookie('loginUser');
            const hash = location.hash;
            const userid = Cookies.getCookie('userid');
            // TODO 临时,调整底部帮助指引宽度,应该在垂直滚动条宽度统一后,去掉
            //const width = $('#sidebar')[0]).width;
            //$('.gui-sidebar-menu-footer').width(window.getComputedStyle(width);
            this.currentHash = hash;
            if(userid === null || userid === '') {
                window.location.href = './index.html#login';
                return false;
            }

            if (typeof(userid) == 'undefined') {
                return;
            }
            resource.getData(INTERFACE.FIND_FUNCTION_BY_USER + '?userId=' + userid, function(data) {
                let root = "";
                //找出根节点
                for(let i = 0; i < data.length; i++) {
                    if(data[i].parentmenu === null || data[i].parentmenu === '') {
                        root = data[i].menuNum;
                        break;
                    }
                }
                //获取菜单目录树结构
                let menuData = self.getChildrenNodes(data, root);
                for(let i = 0; i < menuData.length; i++) {
                    if(menuData[i].children.length === 0) {
                        continue;
                    }
                    for(let j = 0; j < menuData[i].children.length; j++) {
                        if(menuData[i].children.length === 0) {
                            continue;
                        }
                        let isOpen = false;
                        for(let k = 0; k < menuData[i].children[j].children.length; k++) {
                            if(menuData[i].children[j].children.length === 0) {
                                continue;
                            }
                            if(hash === menuData[i].children[j].children[k].path) {
                                isOpen = true;
                                break;
                            }
                        }
                        if(isOpen) {
                            menuData[i].children[j].open = true;
                        }
                    }
                }
                self.menuData = menuData;
                let userid = Cookies.getCookie('userid');
                //获取业务名称和logo
                resource.getData(GE.API_PATH + 'ui/findSystemInfo', function (result) {
                    self.homeName = result.name;
                    self.logo = result.logo;
                    /*
                    //把当前的path状态选中
                    $('#siderbarMenu li a').each(function(){
                        var obj = $(this);
                        var href = $(this).attr('href');
                        if(href !== '' && href !== '#' && hash.indexOf(href) == 0) {
                            obj.parent().addClass('active');
                            obj.parent().parent().parent().addClass('active');
                            obj.parent().parent().parent().parent().parent().addClass('active');
                            return false;
                        }
                    });
                    //首页选择处理,第一个选中
                    if(hash === '') {
                        $('#siderbarMenu').children('li:eq(0)').addClass('active');
                        $('#siderbarMenu .gui-sidebar-menu-second:eq(0) > li:eq(0)').addClass('active');
                    }
                    //展开选择的菜单
                    $('.layout-sidebar > .trigger').on('click', function(e){
                        e.preventDefault();
                        var $layout = $('.gui-layout');
                        if($layout.hasClass('hide-sidebar')) {
                            $layout.removeClass('hide-sidebar');
                        }else {
                            $layout.addClass('hide-sidebar');
                        }
                    });
                    //菜单展开和关闭
                    $('#siderbarMenu li.level2').unbind('click').bind('click', function(){
                        if($(this).hasClass('active')) {
                            $('#siderbarMenu li').removeClass('active');
                        } else {
                            $('#siderbarMenu li').removeClass('active');
                            $(this).parent().parent().addClass('active');
                            $(this).parent().parent().parent().parent().addClass('active');
                            $(this).addClass('active');
                        }

                        // TODO 宽度变化后,重置帮助栏的宽度
                        if(window.getComputedStyle($('#sidebar')[0]).width !== $('.gui-sidebar-menu-footer').width()) {
                            $('.gui-sidebar-menu-footer').width(window.getComputedStyle($('#sidebar')[0]).width);
                        }

                        return false;
                    });

                    $('#siderbarMenu a.jump').unbind('click').bind('click', function(e) {
                        window.event ? window.event.cancelBubble = true : e.stopPropagation();
                    });
                    //侧边栏隐藏、显示
                    $('.sidebar-trigger').unbind('click').bind('click', function(e){
                        e.preventDefault();
                        var $layout = $('.gui-layout');
                        if($layout.hasClass('mini-sidebar')) {
                            $layout.removeClass('mini-sidebar');
                        }else {
                            $layout.addClass('mini-sidebar');
                        }
                    });

                    $('#siderbarMenu li a').bind('click', function(){
                        var href = $(this).attr('href');
                        var hash = window.location.hash;
                        if(href !== '' && href !== '#' && hash.indexOf(href) == 0) {
                            Backbone.history.loadUrl(hash);
                            //Backbone.history.start();
                        }
                        return true;
                    });
                    */
                });
            });
        },

        //处理左侧菜单指引
        handleGui() {
            var _this =this;
            var html = $('#sidebar').html().replace(/id=\"\w+\"/gi,'');
            $('#guiDiv > div').html(html);
            //工作台的指引
            html = '<i class="outline"></i><div class="gui-guide-tip">' +
                '<a href="" class="close">×</a>' +
                '<h3>我的工作台</h3>' +
                '<p>展示主要指标信息，方便快速定位；展示内容可调整</p>' +
                '<button class="gui-btn success s">继续</button></div>';
            $('#guiDiv > div > ul:eq(0)>li:eq(0)').append(html);
            var index = 1;
            //数据计算的指引
            if($('#siderbarMenu li[name=02]').length > 0) {
                html = '<i class="outline"></i>' +
                    '<div class="gui-guide-tip">' +
                    '<a href="" class="close">×</a>' +
                    '<h3>数据计算</h3>' +
                    '<p>海量数据可在此做离线计算、实时流计算等精加工，提供统一的日志中心， 支持多种数据接入、输出方式</p>' +
                    '<button class="gui-btn success s">继续</button></div>';
                $('#guiDiv > div > ul:eq(0)>li:eq(' +index + ')').append(html);
                index ++;
            }
            //数据应用的指引
            if($('#siderbarMenu li[name=03]').length > 0) {
                html = '<i class="outline"></i>' +
                    '<div class="gui-guide-tip">' +
                    '<a href="" class="close">×</a>' +
                    '<h3>数据应用</h3>' +
                    '<p>提供自助报表、数据提取等数据应用<br>界面友好，无需代码基础亦能玩转大数据</p>' +
                    '<button class="gui-btn success s">继续</button></div>';
                $('#guiDiv > div > ul:eq(0)>li:eq(' +index + ')').append(html);
                index ++;
            }
            //系统管理的指引
            if($('#siderbarMenu li[name=04]').length > 0) {
                html = '<i class="outline"></i>' +
                    '<div class="gui-guide-tip">' +
                    '<a href="" class="close">×</a>' +
                    '<h3>系统管理</h3><p>展示集群状态及配置部署内容<br> 可对成员进行分组明细管理</p>' +
                    '<button class="gui-btn success s">继续</button></div>';
                $('#guiDiv > div > ul:eq(0)>li:eq(' +index + ')').append(html);
            }
            //LOGO、名称的指引
            var userid = _this.getCookie('userid');
            //约定1是管理员
            if(userid === '1') {
                html = '<i class="outline"></i>' +
                    '<div class="gui-guide-tip">' +
                    '<a href="" class="close">×</a>' +
                    '<h3>LOGO、名称</h3>' +
                    '<p>当前产品/业务的名称显示位置，点击可修改</p>' +
                    '<button class="gui-btn success s">好</button>' +
                    '</div>';
                $('#guiDiv > div > h2').append(html);
            } else {
                $('#guiDiv > div > ul:eq(0)>li:eq(' +index + ')').find('button').text('好');
            }
            $('#guiDiv').show();
            $('#index-guide-mask').show();
            //绑定事件
            _this.indexGuide();
        },

        indexGuide() {
            var $indexGuide = $('.gui-index-guide'),
                $menuGuide = $indexGuide.find('.gui-sidebar-menu-new .gui-guide-tip'),
                $logoGuide = $indexGuide.find('.sidebar-title .gui-guide-tip'),
                $mask = $('#index-guide-mask'),
                cls = 'show-guide';
            if ($menuGuide.length < 1 && $logoGuide.length < 1) {
                return;
            }

            $menuGuide.parent().removeClass(cls);
            $logoGuide.parent().removeClass(cls);
            $menuGuide.eq(0).parent().addClass(cls);

            $menuGuide.each(function (idx, ele) {
                var $this = $(this),
                    $parent = $this.parent();

                $this.find('.gui-btn').on('click', function () {
                    $parent.removeClass(cls);

                    if (idx == $menuGuide.length - 1) {
                        if($logoGuide.length > 0) {
                            $logoGuide.parent().addClass(cls);
                        } else {
                            hideGuide();
                        }
                    } else {
                        $parent.next().addClass(cls);
                    }
                });

                $this.find('.close').on('click', function (e) {
                    e.preventDefault();
                    hideGuide();
                });
            });

            $logoGuide.find('.gui-btn').on('click', function () {
                hideGuide();
            });

            $logoGuide.find('.close').on('click', function (e) {
                e.preventDefault();
                hideGuide();
            });

            function hideGuide() {
                $indexGuide.hide();
                $mask.hide();
            }
        },

        /**
         * 递归生成节点树结构
         * @method function
         * @param  {[type]} data   [description]
         * @param  {[type]} nodeId [description]
         * @return {[type]}        [description]
         */
        getChildrenNodes(data, nodeId) {
            const configMenu = GE.menu;
            const iconClass = GE.iconClass;
            let result  = [];
            for(let i = 0; i < data.length; i++) {
                if(data[i].parentmenu === nodeId) {
                    if ( data[i].menuNum == '06') {
                        continue;
                    }
                    result.push({
                        id: data[i].id,
                        name : data[i].name,
                        menuNum : data[i].menuNum,
                        path : configMenu[data[i].menuNum],
                        menuPath : data[i].path,
                        order : data[i].sequence,
                        iconClass : typeof iconClass[data[i].menuNum] == 'undefined' ? '' : iconClass[data[i].menuNum],
                        children : this.getChildrenNodes(data, data[i].menuNum),
                        open : false
                    });
                }
            }
            //按照id升序排序
            result.sort(function(a, b){
                return a.order - b.order;
            });
            return result;
        }
    },
    ready() {
        this.render();
    }
}
</script>

