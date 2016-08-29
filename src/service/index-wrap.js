import Vue from 'vue';
import Sidebar from 'components/sidebar'
import Header from 'components/header'

export default {
    init(vIndex) {
        new Vue({
            el: 'body',
            components: {
                vIndex: vIndex,
                vSidebar: Sidebar,
                vHeader : Header
            }
        })
    }
}
