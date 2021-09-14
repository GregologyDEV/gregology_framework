<template>
    <v-row>
        <v-dialog v-model="dialog" max-width="1000">
            <v-card>
                <v-card-title>Wykaz poszukiwanych osób
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Wyszukaj" single-line hide-details clearable></v-text-field>
                </v-card-title>
                    <v-data-table :headers="wantedTableHeaders" :items="lastWarrants" items-per-page="5" show-expand :expanded.sync="expanded" :page.sync="wpisyPagination" @page-count="wpisyPage = $event" hide-default-footer :search="search">
                        <template v-slot:item.poszukiwany_char_fullname="{ item }">
                            {{ item.poszukiwany_char_fullname }}
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon @click="searchCitizenData(item.poszukiwany_char_id)"><v-icon>mdi-magnify</v-icon></v-btn>
                                </template>
                                <span>Identyfikator: {{ item.poszukiwany_char_id }}</span>
                            </v-tooltip>
                            
                            <!-- <v-btn small class="ml-3" color="orange lighten-2">Zawieś</v-btn> -->
                        </template>
                        <!-- <template v-slot:item.powod="{ item }">
                            <span style="">{{ item.powod }}</span> 
                        </template> -->
                        <template v-slot:item.actions="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" @click="editWarrantInfo(item)"><v-icon>mdi-pencil</v-icon></v-btn>
                                </template>
                                <span>Edytuj informacje o osobie poszukiwanej</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon v-on="on" @click="deleteWarrantInfo(item)"><v-icon color="red">mdi-delete</v-icon></v-btn>
                                </template>
                                <span>Usuń nakaz poszukiwania</span>
                            </v-tooltip>
                        </template>
                        <template v-slot:expanded-item="{ wantedTableHeaders, item }">
                            <td class="mx-5" colspan="7"><b>Wygląd:</b> {{ item.poszukiwany_wyglad }} <br> <b>Dodatkowe informacje:</b> {{ item.dodatkowe_info }} </td>
                        </template>
                    </v-data-table>
                    <div class="text-center pt-2">
                        <v-pagination v-model="wpisyPagination" :length="wpisyPage"></v-pagination>
                    </div>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import alt from "@/main.js"

export default {
    data: () => ({
        dialog: false,
        search: "",
        wpisyPage: 0,
        wpisyPagination: 1,
        wantedTableHeaders: [
            { text: "Poszukiwany", align: "start", sortable: false, width: 160, value: "poszukiwany_char_fullname" },
            { text: "Powód poszukiwań", sortable: false, width: 400, value: "powod" },
            { text: "Funkcjonariusz", sortable: false, value: "funkcjonariusz" },
            { text: "Data", sortable: false, value: "data_wpisu" },
            { text: "Akcje", sortable: false, value: "actions" },
            { text: "", sortable: false, value: "data-table-expand" }
        ],
        lastWarrants: [
            {
                id: 555,
                poszukiwany_char_id: 489,
                poszukiwany_char_fullname: "Walter White",
                powod: "Napad na Bank Rezerw Federalnych",
                poszukiwany_wyglad: "Mężczyzna zawsze ubrany w garnitur, ciemne włosy. Czasami nosi kaburę.",
                dodatkowe_info: "Podsiada broń, niebezpieczny, porusza się czarnym Revolterem o numerach SPL 1689. W przypadku zatrzymania, niezwłocznie poinformować funkcjonariuszy FIB",
                data_wpisu: "12.03.2020",
                aresztowano: 0,
                funkcjonariusz: "Michael Hoffman"
            },
            {
                id: 567,
                poszukiwany_char_id: 163,
                poszukiwany_char_fullname: "Bob Black",
                powod: "Nie stawił się na kawę z Eagle One",
                poszukiwany_wyglad: "Ciemne włosy, zakola, rozmyty makijaż pod oczami. Nosi zieloną kurtkę oraz spodnie 'bojówki'.",
                dodatkowe_info: "Podsiada broń, niebezpieczny, najczęściej porusza się Canisem Kamacho",
                data_wpisu: "12.03.2020",
                aresztowano: 0,
                funkcjonariusz: "Michael Hoffman"
            }
        ],
    }),

    methods: {
        searchCitizenData(citizenID) {
            alt.emit("mdt:requestCitizenData", citizenID)
            this.dialog = false
        },

        editWarrantInfo(item) {
            this.$root.$emit("editWarrant", item);
            this.dialog = false
        },

        deleteWarrantInfo() {
            alt.emit("mdt:deleteWarrant", item.id)
        }
    },

    mounted() {
        this.$root.$on("showActiveWarrants", () => {
            this.dialog = true
        }),

        this.$root.$on("closeActiveWarrants", () => {
            //this.closeDialog()
            //this.dialog = false
        })
    },
}
</script>

<style scoped>

</style>