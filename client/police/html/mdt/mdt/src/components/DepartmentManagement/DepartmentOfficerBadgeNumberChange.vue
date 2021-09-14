<template>
    <v-row>
        <v-snackbar
            v-model="badgeNumberUnavaibleAlert" 
            timeout="3000"
            top
            right
            absolute
            color="error"
            transition="slide-x-transition"
         >Nowy numer odznaki jest niedostępny</v-snackbar>

         <v-snackbar
            v-model="badgeNumberSuccessAlert" 
            timeout="3000"
            top
            right
            absolute
            color="success"
            transition="slide-x-transition"
         >Pomyślnie zmieniono numer odznaki</v-snackbar>
        <v-dialog v-model="dialog" max-width="450" persistent>
            <v-card>
                <v-card-title>Zmiana numeru odznaki funkcjonariusza</v-card-title>
                <!-- <v-card-subtitle></v-card-subtitle> -->
                <v-card-text>
                    <v-row>
                        <v-col>
                             <v-text-field 
                                label="Nowy numer odznaki"
                                outlined
                                required
                                clearable
                                :rules="[rules.isNaN, rules.isPositive]"
                                v-model="badgeNumber"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="closeDialog">Anuluj</v-btn>
                    <v-btn text @click="submitChange">Zatwierdź</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import alt from "@/main.js"

export default {
    data: () => ({
        dialog: false,
        badgeNumberUnavaibleAlert: false,
        badgeNumberSuccessAlert: false,
        rules: {
            isNaN: value => !isNaN(value) || "Wartość musi być wyrażona liczbą",
            isPositive: value => value >= 0 || "Wartość nie może być mniejsza od zera"
        },
    }),

    methods: {
        closeDialog() {
            this.badgeNumber = ""
            this.dialog = false
        },

        submitChange() {
            if(!isNaN(this.badgeNumber) && this.badgeNumber > 0) {
                alt.emit('mdt:requestDepartmentOfficerBadgeNumberChange', this.badgeNumber)
            }
        },
    },

    mounted() {
        this.$root.$on("showDepartmentOfficerBadgeNumberChangeDialog", (item) => {
            this.dialog = true
            this.badgeNumber = item.police_odznaka
        })
    },

    beforeMount() {
        if ("alt" in window) {
            window.alt.on("mdt:departmentOfficerBadgeNumberUnavaible", (result) => {
                this.badgeNumberUnavaibleAlert = true
            });

            window.alt.on("mdt:departmentOfficerBadgeNumberChangedSuccess", (result) => {
                this.badgeNumberSuccessAlert = true
            });
        }
    }
}
</script>