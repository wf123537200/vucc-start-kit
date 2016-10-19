<template>
    <div class="doc-header">
        <div class="inner">
            <ul class="nav">
                <li>
                    <a href="#/demo">demo</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style scoped>
    .doc-header ul,
    .doc-header li {
        list-style: none;
    }

    /*==公用菜单==*/

    .doc-header {
        height: 50px;
    }

    .doc-header .inner {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        background: #41abe1;
        z-index: 102;
    }

    .doc-header .nav {
        margin: 0 auto;
        padding: 0 30px;
    }

    .doc-header .nav li {
        position: relative;
        float: left;
        *display: inline;
        margin-right: 20px;
        *zoom: 1;
    }

    .doc-header .nav a {
        display: block;
        min-width: 80px;
        text-align: center;
        font: 14px/50px 'Microsoft Yahei';
        color: #fff;
        opacity: 0.6;
        filter: alpha(opacity=60);
        text-decoration: none;
    }

    .doc-header .nav a:hover,
    .doc-header .nav .current a {
        opacity: 1;
        filter: alpha(opacity=100);
        text-decoration: none;
    }

    .doc-header .nav .current:after {
        position: absolute;
        left: 50%;
        bottom: 0;
        margin-left: -4px;
        content: '.';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 5px 6px;
        border-color: #fff transparent;
        font-size: 0;
    }
</style>
