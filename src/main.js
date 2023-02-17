import Vue from 'vue'
import App from './App.vue'
import axios from "axios";

axios.defaults.baseURL =""
axios.defaults.headers.common["Authorization"] = "ShippoToken shippo_test_43ebf3d81002e69cd6284e3531302ed4f42f0c9f"
axios.defaults.headers.get["Accepts"] = "application/json"

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
