<template>
    <v-row>
        <v-dialog v-model="dialog" max-width="500" persistent>
            <v-card>
                <v-card-title>Wpłata pieniedzy do budżetu departamentu</v-card-title>
                <v-card-subtitle>Wpłata pieniędzy jest możliwa tylko w gabinecie Szefa Policji</v-card-subtitle>
                <v-card-text>
                    <v-row>
                        <v-col>
                             <v-text-field 
                                label="Kwota wpłaty"
                                outlined
                                required
                                clearable
                                :rules="[rules.isNaN, rules.isPositive]"
                                v-model="depositAmount"
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
            this.depositAmount = ""
            this.dialog = false
        },

        submitTransfer() {
            if(!isNaN(this.depositAmount) && this.depositAmount > 0) {
                alt.emit('mdt:requestDepartmentMoneyDeposit', this.depositAmount)
            }
        },
    },

    mounted() {
        this.$root.$on("showDepartmentAmountDepositDialog", () => {
            this.dialog = true
        })
    },
}
</script>