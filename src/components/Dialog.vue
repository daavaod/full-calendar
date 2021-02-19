<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="800px">
            <slot name="body">
                body
            </slot>
        </v-dialog>
    </v-row>
</template>

<script>

import {bus} from'../main.js';

export default {
    name: 'Dialog',

    components: {

    },
    props: {
        
    },
    data() {
        return {
            dialog: false,
        }
    },
    created() {
        bus.$on('toggleDialog', dialog => {
            this.dialog = !this.dialog;
        });
    }
}
</script>
