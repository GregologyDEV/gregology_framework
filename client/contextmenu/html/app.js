Vue.config.devtools = true;
Vue.prototype.window = window;

const app = new Vue({
    el: "#app",
    data() {
        return {
            x: 25,
            y: 25,
            show: false,
            menu: { 
                // title: "Pojazd",
                // eventsGroup: "",
                // options: [{name: "Otwórz pojazd", eventName: "unlockVehicle"}, {name: "Otwórz drzwi", eventName: "openClosestVehicleDoor"}, {name: "[POLICJA] Przeszukaj pojazd", eventName: "policeSearchVehicle"}]
            }
        };
    },
    computed: {
        getPosition() {
            return {position: `fixed !important`, left: `${this.x}px`, top: `${this.y}px`}
        }
    },
    methods: {
        setReady() {
            this.show = true
        },

        mount(menu, x, y) {
            this.x = x;
            this.y = y;
            this.menu = menu;
            this.show = true;
        },

        dismount() {
            this.show = false;
            this.menu = {};
        },

        select(data) {
            if ("alt" in window) {
                alt.emit("contextMenu:Selected", this.menu.eventsGroup, data)
            }
        },

        clickedOutside() {
            if ("alt" in window) {
                alt.emit("contextMenu:nothingSelected", this.menu.eventsGroup)
            }
        }
    },
    mounted() {
        if ("alt" in window) {
            alt.on("contextMenu:mount", this.mount);
            alt.on("contextMenu:dismount", this.dismount)
        }
    },
    directives: {
      'click-outside': {
        bind: function(el, binding, vNode) {
          // Provided expression must evaluate to a function.
          if (typeof binding.value !== 'function') {
              const compName = vNode.context.name
            let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
            if (compName) { warn += `Found in component '${compName}'` }
            
            console.warn(warn)
          }
          // Define Handler and cache it on the element
          const bubble = binding.modifiers.bubble
          const handler = (e) => {
            if (bubble || (!el.contains(e.target) && el !== e.target)) {
                binding.value(e)
            }
          }
          el.__vueClickOutside__ = handler
  
          // add Event Listeners
          document.addEventListener('click', handler)
              },
        
        unbind: function(el, binding) {
          // Remove Event Listeners
          document.removeEventListener('click', el.__vueClickOutside__)
          el.__vueClickOutside__ = null
  
        }
      }
    }
})

