import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

class Alt {

  static handlers = new Map();

  static on = Alt.On()

  static off = Alt.Off()

  static emit = Alt.Emit()

  static On() {
      try {
          return alt.on // eslint-disable-line no-undef
      } catch (e) {
          //console.log("enabled-dummy-handler")
      }
      return Alt.onDummy
  }

  static Off() {
      try {
          return alt.off // eslint-disable-line no-undef
      } catch (e) {
          //console.log("enabled-dummy-handler")
      }
      return Alt.offDummy
  }

  static Emit() {
      try {
          return alt.emit // eslint-disable-line no-undef
      } catch (e) {
          //console.log("enabled-dummy-trigger")
      }
      return Alt.emitDummy
  }

  static onDummy(eventName, callback) {
      let handlers;
      if (Alt.handlers.has(eventName)) {
          handlers = Alt.handlers.get(eventName);
      } else {
          handlers = [];
          Alt.handlers.set(eventName, handlers);
      }
      handlers.push(callback);
  }

  static offDummy(eventName, callback) {
      if (!Alt.handlers.has(eventName)) return;
      Alt.handlers = Alt.handlers.get(eventName);
      Alt.handlers = Alt.handlers.filter((handler) => handler !== callback);
      Alt.handlers.set(eventName, callback);
  }

  static emitDummy(eventName, args) {
      if (!Alt.handlers.has(eventName)) return;
      for (const handler of Alt.handlers.get(eventName)) {
          handler(eventName, ...args);
      }
  }
}

export default Alt