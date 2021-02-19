<template>
    <!-- Should implement Vuetify component -->
    <div class="busy-indicator-container active">
        <div class="busy-indicator-wrapper">
            <div class="busy-indicator"></div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'busyindicator',
    props: {
        
    },
    data() {
        return {
            
        }
    },
    components: {
        
    },
    
}
</script>

<style>
.busy-indicator-container {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: rgba(36, 44, 55, 0.35);
}
.busy-indicator-container.active {
  display: block;
}
.busy-indicator-wrapper {
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
}
.busy-indicator {
  width: 100px;
  height: 100px;
  background-image: url(../assets/double-ring.gif);
  background-size: 60px 60px;
  background-repeat: no-repeat;
  background-position: center center;
}
.busy-indicator-container.relative .busy-indicator-wrapper {
    position: relative;
    top: auto;
    left: auto;
    transform: translate(0%, 0%);
    margin: 0 auto;
}

.busy-indicator-container {
  position: absolute;
}
</style>
