<template>
    <v-row>
        <v-dialog v-model="dialog" max-width="500" persistent>
            <v-card>
                <v-card-title>Wypłata pieniedzy z budżetu departamentu</v-card-title>
                <v-card-subtitle>Wypłata pieniędzy jest możliwa tylko w gabinecie Szefa Policji</v-card-subtitle>
                <v-card-text>
                    <v-row>
                        <v-col>
                             <v-text-field 
                                label="Kwota wypłaty"
                                outlined
                                required
                                clearable
                                :rules="[rules.isNaN, rules.isPositive]"
                                v-model="withdrawAmount"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="closeDialog">Anuluj</v-btn>
                    <v-btn text @click="submitTransfer">Zatwierdź</v-btn>
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
        rules: {
            isNaN: value => !isNaN(value) || "Wartość musi być wyrażona liczbą",
            isPositive: value => value >= 0 || "Wartość nie może być mniejsza od zera"
        },
    }),

    methods: {
        closeDialog() {
            this.withdrawAmount = ""
            this.dialog = false
        },

        submitTransfer() {
            if(!isNaN(this.withdrawAmount) && this.withdrawAmount > 0) {
                alt.emit('mdt:requestDepartmentMoneyWithdraw', this.withdrawAmount)
            }
        },
    },

    mounted() {
        this.$root.$on("showDepartmentAmountWithdrawDialog", () => {
            this.dialog = true
        })
    },
}
</script>