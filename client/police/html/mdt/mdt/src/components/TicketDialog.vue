<template>
    <v-row>
        <v-dialog v-model="dialog" persistent max-width="1600px">
            <v-card>
                <v-card-title>Nowy wpis
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on"><v-icon>mdi-help-circle-outline</v-icon></v-btn>
                        </template>
                        <span>Aby dodać nowy wpis, należy najpierw załadować dane obywatela</span>
                    </v-tooltip>
                    <v-btn icon @click="dialog = false"><v-icon>mdi-window-minimize</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-alert v-model="noCitizenDataAlert" type="error" dismissible>
                        Nie znaleziono obywatela z podanym indentyfikatorem
                    </v-alert>
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="playerUID" label="Identyfikator obywatela" outlined :rules="[rules.isNaN, rules.isPositive]" :error-messages="citizenIDErrorMsg"></v-text-field>
                            <v-btn color="primary" @click="loadCitizenData" block>Załaduj dane obywatela</v-btn>
                        </v-col>
                        <v-col cols="12" md="3">
                            <p style="font-size: 14pt">Imię i nazwisko obywatela: <b>{{ daneObywatela.char_fullname }}</b></p>
                            <p style="font-size: 14pt">Data urodzenia: <b>{{ daneObywatela.char_birthdate }}</b></p>
                        </v-col>
                        <v-col cols="12" md="3">
                            <span style="color: red; font-size: 15pt">{{ wanted }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-autocomplete
                                v-model="wykroczeniaAutocomplete"
                                :items="wykroczenia"
                                item-text="label"
                                label="Zarzuty"
                                return-object
                            >
                                <template v-slot:append-outer>
                                    <v-btn icon @click="addWykroczenie()">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-data-table v-model="wykroczeniaTable" :headers="wykroczeniaTableHeaders" :items="wykroczeniaDodane" hide-default-footer show-expand :expanded.sync="expanded" item-key="label">
                                <template v-slot:expanded-item="{ wykroczeniaTableHeaders, item }">
                                    <td colspan="5"><b>Uwagi:</b> {{ item.uwagi }}</td>
                                </template>
                                <template v-slot:item.amount="{ item }">
                                    <v-icon small @click="decreaseAmount(item)">mdi-minus</v-icon>
                                    {{ item.amount }}
                                    <v-icon small @click="increaseAmount(item)">mdi-plus</v-icon>
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="12">
                            <span style="font-size: 12pt;">Zarzuty:</span>
                            <v-card outlined tile min-height="50px"><v-card-text style="font-size: 14px; font-weight: 450">{{ wykroczeniaDodaneText }}</v-card-text></v-card>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea v-model="uwagiOsobiste" outlined label="Dodatkowe osobiste uwagi"></v-textarea>
                        </v-col>
                        <v-row>
                            <v-col cols="12" md="3" class="ml-3">
                                <span class="sugerowana_grzywna">Sugerowana grzywna: <b>${{ grzywna_s }}</b></span>
                                <v-icon right class="ml-10" @click="copyGrzywna">mdi-content-copy</v-icon>
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field v-model="grzywna" label="Grzywna" height="20px" :rules="[rules.isNaN, rules.isPositive]"></v-text-field>
                            </v-col>        
                            <v-col cols="12" md="1"></v-col>  
                            <v-col cols="12" md="3">
                                <span class="sugerowana_grzywna">Sugerowany areszt: <b>{{ areszt_s }} miesięcy</b></span>
                                <v-icon right class="ml-10" @click="copyAreszt">mdi-content-copy</v-icon>
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field v-model="areszt" label="Areszt" height="20px" :rules="[rules.isNaN, rules.isPositive]"></v-text-field>
                            </v-col>
                        </v-row>      
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="closeDialog">Anuluj</v-btn>
                    <v-btn text @click="sendNewTicket">Zatwierdź</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import wykroczeniaArray from "@/wykroczenia.js"
import alt from "@/main.js"

export default {
    data: () => ({
        dialog: false,
        wykroczenia: wykroczeniaArray,
        wykroczeniaDodane: [],
        wykroczeniaDodaneText: "",
        daneObywatela: {char_fullname: "Michael Monder", char_birthdate: "15.01.1983"},
        grzywna_s: 0,
        grzywna: null,
        areszt: null,
        areszt_s: 0,
        isWanted: false,
        noCitizenDataAlert: false,
        citizenIDErrorMsg: "",
        wanted: null,
        wykroczeniaTableHeaders: [
            { text: "Zarzuty", align: "start", sortable: false, value: "label" },
            { text: "Grzywna", sortable: false, value: "grzywna", width: 8 },
            { text: "Areszt", sortable: false, value: "areszt", width: 7 },
            { text: "Ilość", sortable: false, value: "amount" },
            { text: "", sortable: false, value: "data-table-expand" }
        ],
        expanded: [],
        rules: {
            isNaN: value => !isNaN(value) || "Wartość musi być wyrażona liczbą",
            isPositive: value => value >= 0 || "Wartośc nie może być mniejsza od zera"
        },
    }),
        
    methods: {
        closeDialog() {
            this.dialog = false
            this.wykroczeniaDodane = []
            this.grzywna_s = 0,
            this.areszt_s = 0,
            this.grzywna = null,
            this.areszt = null,
            this.citizenIDErrorMsg = ""
        },

        sendNewTicket() {
            if (this.citizenID === undefined) {
                this.citizenIDErrorMsg = "To pole jest wymagane"
            }
            //var data = {citizenID: this.playerUID, grzywna: this.grzywna, areszt: this.areszt, wykroczenia: this.wykroczeniaDodaneText, uwagi: this.uwagiOsobiste}
        },

        copyGrzywna() {
            this.grzywna = this.grzywna_s
        },

        copyAreszt() {
            this.areszt = this.areszt_s
        },

        loadCitizenData() {
            let citizenID = this.playerUID
            if (citizenID === undefined) {
                this.citizenIDErrorMsg = "To pole jest wymagane"
            } else {
                alt.emit("mdt:requestCitizenData", citizenID)
            }
        },

        decreaseAmount(item) {
            if (item.amount != 1) {
                item.amount = item.amount - 1
            } else {
                const index = this.wykroczeniaDodane.indexOf(item)
                this.wykroczeniaDodane.splice(index, 1)
            }
            this.refreshTable()
        },

        increaseAmount(item) {
            if (item.amount < 50) {
                item.amount = item.amount + 1
            } else if (item.amount === 50) return
            this.refreshTable()
        },

        addWykroczenie() {
            var itemToAdd = this.wykroczeniaAutocomplete
            itemToAdd.amount = 1
            const index = this.wykroczeniaDodane.indexOf(itemToAdd)
            if (index > -1) {
                this.wykroczeniaDodane[index].amount++ 
            } else {
                this.wykroczeniaDodane.push(itemToAdd)
            }
        },

        refreshTable() {
            this.wykroczeniaDodaneText = ""
            this.grzywna_s = 0
            this.areszt_s = 0
            let wykroczeniaText = ""
            let sugerowana_grzywna = 0
            let sugerowany_areszt = 0
            for (let i = 0; i < this.wykroczeniaDodane.length; i++) {
                sugerowana_grzywna = sugerowana_grzywna + (this.wykroczeniaDodane[i].grzywna * this.wykroczeniaDodane[i].amount)
                sugerowany_areszt = sugerowany_areszt + (this.wykroczeniaDodane[i].areszt * this.wykroczeniaDodane[i].amount)
                wykroczeniaText = wykroczeniaText + `${this.wykroczeniaDodane[i].label} x ${this.wykroczeniaDodane[i].amount} | `
            }
            let wykroczeniaText2 = wykroczeniaText.substring(0, wykroczeniaText.length - 2)
            this.wykroczeniaDodaneText = wykroczeniaText2
            this.grzywna_s = sugerowana_grzywna
            this.areszt_s = sugerowany_areszt
        }
    },
     
    mounted() {
        this.$root.$on("showNewTicketDialogEvent", () => {
            this.dialog = true
        }),
        this.$root.$on("closeNewTicketDialogEvent", () => {
            this.closeDialog()
            //this.dialog = false
        })
    },

    watch: {
        wykroczeniaDodane: function() {
            this.wykroczeniaDodaneText = ""
            this.grzywna_s = 0
            this.areszt_s = 0
            let wykroczeniaText = ""
            let sugerowana_grzywna = 0
            let sugerowany_areszt = 0
            for (let i = 0; i < this.wykroczeniaDodane.length; i++) {
                sugerowana_grzywna = sugerowana_grzywna + (this.wykroczeniaDodane[i].grzywna * this.wykroczeniaDodane[i].amount)
                sugerowany_areszt = sugerowany_areszt + (this.wykroczeniaDodane[i].areszt * this.wykroczeniaDodane[i].amount)
                wykroczeniaText = wykroczeniaText + `${this.wykroczeniaDodane[i].label} x ${this.wykroczeniaDodane[i].amount} | `
            }
            let wykroczeniaText2 = wykroczeniaText.substring(0, wykroczeniaText.length - 2)
            this.wykroczeniaDodaneText = wykroczeniaText2
            this.grzywna_s = sugerowana_grzywna
            this.areszt_s = sugerowany_areszt
        }
    },
    
    beforeMount() {
        if ("alt" in window) {
            window.alt.on("mdt:citizenDataCallback", (result) => {
                this.daneObywatela = result
            });
        }
    }

}
</script>

<style scoped>
.sugerowana_grzywna {
    margin-top: 10px;
    font-size: 15pt;
}
::-webkit-scrollbar {
    display: none;
}
</style>