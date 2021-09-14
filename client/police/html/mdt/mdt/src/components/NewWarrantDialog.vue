<template>
    <v-row>
        <v-dialog v-model="dialog" persistent max-width="1000px">
            <v-card>
                <v-card-title>Nowa poszukiwana osoba
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false"><v-icon>mdi-window-minimize</v-icon></v-btn>
                </v-card-title>
                <v-card-subtitle>Wystaw nowy nakaz poszukiwania za obywatelem.</v-card-subtitle>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="playerName" label="Imię i nazwisko" outlined></v-text-field>
                            <v-text-field v-model="playerCharID" label="Identyfikator obywatela" outlined></v-text-field>
                        </v-col>
                        <v-col>
                            <v-textarea v-model="warrantReason" label="Powód poszukiwań" outlined></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-textarea v-model="playerApperance" label="Wygląd poszukiwanego" outlined></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-textarea v-model="additionalInfo" label="Dodatkowe uwagi / informacje" outlined></v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="closeDialog">Anuluj</v-btn>
                    <v-btn text @click="sendNewWarrant">Zatwierdź</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import alt from "@/main.js"

export default {
    data: () => ({
        dialog: false
    }),

    methods: {
        closeDialog() {
            this.dialog = false
            this.playerName = null
            this.playerCharID = null
            this.warrantReason = null
            this.playerApperance = null
            this.additionalInfo = null
        },

        sendNewWarrant(){
            let data = {playerName: this.playerName, playerCharID: this.playerCharID, warrantReason: this.warrantReason, playerApperance: this.playerApperance, additionalInfo: this.additionalInfo}
            let stringData = JSON.stringify(data)
            if (stringData !== "{}") {
                alert(stringData)
                alt.emit("mdt:createNewWarrant", {playerName: this.playerName, playerCharID: this.playerCharID, warrantReason: this.warrantReason, playerApperance: this.playerApperance, additionalInfo: this.additionalInfo})
                this.closeDialog()
            }
        }
    },

    mounted() {
        this.$root.$on("showNewWarrantDialogEvent", () => {
            this.dialog = true
        }),

        this.$root.$on("editWarrant", (item) => {
            this.dialog = true,
            this.playerName = item.poszukiwany_char_fullname
            this.playerCharID = item.poszukiwany_char_id
            this.warrantReason = item.powod
            this.playerApperance = item.poszukiwany_wyglad
            this.additionalInfo = item.dodatkowe_info
        })
    }
}
</script>