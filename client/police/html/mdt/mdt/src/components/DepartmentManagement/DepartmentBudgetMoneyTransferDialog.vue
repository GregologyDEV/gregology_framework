<template>
    <v-row>
        <v-dialog v-model="dialog" max-width="800">
            <v-card>
                <v-card-title>Przelew pieniedzy z budżetu departamentu</v-card-title>
                <v-card-text>
                    <v-tabs v-model="recipientsTabs">
                        <v-tab>Przelew zewnętrzny</v-tab>
                        <v-tab>Przelew do departamentu</v-tab>

                        <v-tab-item>
                            <!-- Przelew zewnętrzny -->
                            <v-row>
                                <v-col style="padding-bottom: 0px;">
                                    <v-text-field 
                                        label="Identyfikator obywatela"
                                        outlined
                                        required
                                        clearable
                                        :rules="[rules.isNaN, rules.isPositive]"
                                        append-icon="mdi-help"
                                        @click:append="checkCitizenByID(transferRecipientCitizenID)"
                                        v-model="transferRecipientCitizenID"
                                    ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field 
                                        label="Kwota"
                                        outlined
                                        required
                                        clearable
                                        :rules="[rules.isNaN, rules.isPositive]"
                                        v-model="transferAmount"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="padding-top: 0px;">
                                    <span class="subtitle-1">Imię i nazwisko obywatela: <b>{{ citizenNameResult }}</b></span>  
                                </v-col> 
                            </v-row>
                        </v-tab-item>
                        <v-tab-item>
                            <!-- Przelew do departamentu -->
                            <v-row class="mx-4">
                                <v-col>
                                    <span style="font-size: 12pt; font-weight: 450">Wybierz odbiorcę przelewu</span>
                                    <v-radio-group v-model="transferRecipientDepartment">
                                        <v-radio label="Emergency Medical Service" value="ems"></v-radio>
                                        <v-radio label="International Affairs Agency" value="iaa"></v-radio>
                                        <v-radio label="Federal Investigation Bureau" value="fib"></v-radio>
                                        <v-radio label="Urząd Miasta Los Santos" value="townhall"></v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col>
                                    <v-text-field 
                                        label="Kwota"
                                        outlined
                                        required
                                        clearable
                                        :rules="[rules.isNaN, rules.isPositive]"
                                        v-model="departmentTransferAmount"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                    </v-tabs>
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
        citizenNameResult: "Michael Monder"
    }),

    methods: {
        closeDialog() {
            this.dialog = false
        },

        submitTransfer() {
            if((this.transferRecipientDepartment && this.departmentTransferAmount > 0) || (this.transferRecipientCitizenID && this.transferAmount > 0)) {
                if(this.recipientsTabs === 0) {
                    alt.emit("mdt:requestDepartmentTransferToCitizen", this.transferRecipientCitizenID, this.transferAmount)
                } else if (this.recipientsTabs === 1) {
                    alt.emit("mdt:requestDepartmentTransferToDepartment", this.transferRecipientDepartment, this.departmentTransferAmount)
                }
            }
        },

        checkCitizenByID(transferRecipientCitizenID) {
            alert(transferRecipientCitizenID)
        }
    },

    mounted() {
        this.$root.$on("showDepartmentBudgetMoneyTransferDialog", () => {
            this.dialog = true
        })
    },
}
</script>