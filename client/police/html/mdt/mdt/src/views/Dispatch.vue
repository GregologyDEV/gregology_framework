<template>
    <div class="dispatch">
        <v-row>
            <v-col>
                <v-card class="mx-auto mr-5 ml-5 mt-10" max-width="350">
                    <v-card-title>Autopilot</v-card-title>
                    <v-card-subtitle>Autopilot sam przydziela najbliższe jednostki do zgłoszenia oraz rozdysponowuje jednostkami patrolowymi.</v-card-subtitle>
                    <v-card-text>
                        <v-switch v-model="dispatchState" @change="dispachStateChanged" class="justify-center" color="blue darken-3"></v-switch>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: "dispatch",
    data: () => ({
        dispatchState: false
    }),

    methods: {
       dispachStateChanged() {
           this.$root.$emit("changeDispatchState", this.dispatchState)
       } 
    },
    
    watch: {
        dispatchState(val) {
            //this.$root.$emit("changeDispatchState", val)
        }
    }
}
</script>

<style scoped>

</style>