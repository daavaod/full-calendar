<template>
  <v-app>
    <v-main>
        <FullCalendarComponent />
    </v-main>
  </v-app>
</template>

<script>
import FullCalendarComponent from './components/FullCalendarComponent';

export default {
  name: 'App',

  components: {
    FullCalendarComponent
  },

  data: () => ({
    //
  }),
};
</script>
