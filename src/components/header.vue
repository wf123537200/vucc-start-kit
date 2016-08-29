<template>
    <div class="gui-layout-mheader">
        <div class="fl">
            <a href="javascript:;" class="mheader-link sidebar-trigger"><i class="gui-fi-line"></i></a>
            <span class="gui-line" v-if="showPro">|</span>
            <div class="tbd-dropdown-wrap project-trigger" id="headerProjectList" v-show="showPro"
                 v-bind:class="{'tbd-dropdown-wrap-open' : openPro}">
                <!-- 要打开下拉菜单加上 tbd-dropdown-wrap-open -->
                <a href="javascript:;" class="tbd-dropdown-link" @click.stop="openList" title="{{currentProName}}">
                    <span>{{currentProName}}</span>
                    <i class="tbdi tbdi-down"></i>
                </a>
                <!-- select 下拉选项 -->
                <div class="tbd-dropdown" v-if="proData.length > 0">
                    <ul class="tbd-dropdown-menu">
                        <li class="tbd-dropdown-menu-item" v-for="item in proData"
                            @click.stop="selectPro(item.id, item.projectName)" title="{{item.projectName}}">
                            {{item.projectName}}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="fr">
            <div class="user-info" @mouseover="showUserInfo = true" @mouseleave="showUserInfo = false" v-bind:class="{'open' : showUserInfo}">
                <a href="javascript:;">{{userName}}<i class="trigger gui-fi-angle-down"></i></a>
                <ul class="gui-dropdown-menu">
                    <li><a href="/#usercenter">个人中心</a></li>
                    <li id="modpwd">修改密码</li>
                    <li id="logout" v-on:click="logout">登出</li>
                </ul>
            </div>
            <span class="gui-line">|</span>
            <a href="/#usercenter" class="mheader-link">
                <i class="gui-fi-mail"></i>
            </a>
            <a href="/help/开始/开始.html" class="mheader-link" target="_blank"><i class="gui-fi-help"></i></a>
        </div>
        <div class="gui-notice">
        </div>
    </div>
</template>

<script>
    import resource from 'service/resource';
    import {GE, INTERFACE} from '../config';
    import {getCookie, setCookie} from 'service/cookies';

    export default {
        data() {
            return {
                //登陆用户名字
                userName : '',
                //人员信息框
                showUserInfo : false,
                //是否显示项目切换
                showPro : false,
                //打开下拉列表
                openPro : false,
                //当前项目名称
                currentProName : '',
                //当前项目id
                currentProId : '',
                proData : []
            }
        },
        methods : {

            //获取当前用户
            getPro : function() {
                let self = this;
                resource.getData(INTERFACE.QUERY_CURRENT_PROJECTS, {}, function(result) {
                    const hash = window.location.hash;
                    self.proData = result;
                    for(var i = 0; i < result.length; i++) {
                        if(result[i].selected) {
                            self.currentProName = result[i].projectName;
                            self.currentProId = result[i].id;
                            setCookie('currentProId', result[i].id, 3600);
                            break;
                        }
                    }

                    if (self.currentProId === '' && result.length > 0) {
                        self.currentProName = result[0].projectName;
                        self.currentProId = result[0].id;
                        setCookie('currentProId', result[0].id, 3600);
                        resource.postData(GE.API_PATH + "ui/setCurrentProject?projectId=" + self.currentProId, {}, function(result){

                        });
                        return;
                    }

                    if (self.showPro == true && self.currentProId == '') {
                        self.showPro = false;
                        if(hash == '' || hash == '#' || hash.indexOf('#dashboard') !== -1) {
                            //_this.callback();
                        } else {
                            self.showNoProject('请联系管理员加入项目中');
                        }

                    } else {
                        //_this.callback();
                    }
                });
            },
            //操作下拉列表
            openList : function() {
                this.openPro = ! this.openPro;
                return false;
            },
            //切换项目
            selectPro : function(id, name) {
                let self = this;
                if (id !== '0') {
                    _this.model.setCurrentProject(id, function(result){
                        const hash = location.hash;
                        if(/^#taskManage/.test(hash)) {
                            location.hash = '#taskManage';
                        }
                        Backbone.history.loadUrl(location.hash);
                        self.openPro = false;
                        self.currentProName = name;
                        setCookie('currentProId', id, 3600);
                    });
                } else {
                    var hash = location.hash;
                    if(/^#taskManage/.test(hash)) {
                        location.hash = '#taskManage';
                    }
                    Backbone.history.loadUrl(location.hash);
                    self.openPro = false;
                    self.currentProName = name;
                    self.setCookie('currentProId', id, 3600);
                }
            },


            /**
             * 注销
             */
            logout : function() {
                window.vModal['confirm']({
                    title: '提示',
                    content: '确认注销吗？',
                    onCancel: function() {
                    },
                    onOk: function() {
                        _this.model.getData(GE.stepApiPath + "logOutUrl", function(data) {
                            document.cookie = 'JSESSIONID=; loginUser=; userid=; path=/';
                            window.location.href='https://'+window.location.hostname+':8081/cas/logout?service='+encodeURIComponent(location.protocol + '//' +window.location.hostname+':80/index.html');
                        });
                    }
                });

                return false;
            }
        },
        ready : function() {
            let self = this;
            const hash = window.location.hash;
            this.userName = getCookie('loginUser');
            if(
                hash == ''
                || hash == '#'
                || hash.indexOf('#dashboard') !== -1
                || hash.indexOf('#workflow') !== -1
                || hash.indexOf('#ide') !== -1
                || hash.indexOf('#ml') !== -1
                || hash.indexOf('#olap') !== -1
                || hash.indexOf('#taskManage') !== -1
            ) {
                this.showPro = true;
            } else {
                this.showPro = false;
            }
            this.getPro();
            document.addEventListener("click", function(){
                self.openPro = false;
            });
        }
    }
</script>
