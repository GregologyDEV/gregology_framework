  Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: '#app',
    data() {
        return {
            
        };
    },
    mounted() {
        window.history.replaceState(null, null, window.location.pathname);
    },
});