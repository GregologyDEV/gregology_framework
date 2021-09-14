Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: "#app",
    data() {
        return {
            show: true,
            authBegin: false
        };
    },

    methods: {
        setReady(url) {
            this.show = true
            this.url = url
            //console.log(this.url)
        },

        beginAuth() {
            //console.log("URL: " + this.url)
            if (!this.url) {
                alt.emit("auth:noURL")
                return;
            }

            this.show = false;
            this.authBegin = true
            window.open(this.url);
            //console.log(this.url)
        }
    },

    mounted() {
        if ('alt' in window) {
            alt.on("auth:ready", (url) => {
                this.setReady(url)
                //console.log("EVENT REGISTERED")
            })
            alt.emit("auth:ready")
        } else {
            this.setReady();
        }
    }
})