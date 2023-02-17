<template>
  <div id="app">
    <cargoCalculate/>
  </div>
</template>

<script>
import cargoCalculate from './components/cargoCalculate.vue'

export default {
  name: 'App',
  components: {
    cargoCalculate
  }
}
</script>
<style>
.list-fade {
  animation: fadeIn 0.3s linear normal;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>