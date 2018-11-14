<template>
  <v-app>
    <v-container fluid>
      <v-layout 
        row 
        wrap>
        <v-flex xs5>
          <v-drag-weektime 
            :period="period" 
            @onChange="onChange" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      period: {},
    };
  },
  methods: {
    onChange(val) {
      // console.log(val);
    },
  },
};
</script>
