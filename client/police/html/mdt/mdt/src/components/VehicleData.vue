<template>
    <v-row>
        <v-dialog v-model="dialog" persistent max-width="1200">
            <v-card height="600">
                <v-card-title>Dane pojazdu
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <p style="font-size: 13pt;">Marka i model: <b>{{ vehicleData.manufacturerLabel }} - {{ vehicleData.modelLabel }}</b></p>
                            <p style="font-size: 13pt;">Nr. rejestracyjny: <b>{{ vehicleData.plate }}</b></p>
                        </v-col>
                        <v-col>
                            <p style="font-size: 13pt;">Imię i nazwisko właściciela: <b>{{ ownerFullname }}</b><v-btn class="ml-5" small icon @click="searchCitizenData(ownerUID)"><v-icon>mdi-magnify</v-icon></v-btn></p>
                            <p style="font-size: 13pt;">Identyfikator właściciela: <b>{{ ownerUID }}</b></p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="4">
                            <!-- <v-img aspect-ratio="487/274" src="https://s.rsg.sc/sc/images/games/GTAV/vehicles/screens/mp/main/revolter.jpg"></v-img> -->
                            <v-card>
                                <v-img :src="'https://s.rsg.sc/sc/images/games/GTAV/vehicles/screens/mp/main/' + vehicleData.model + '.jpg'">
                                    <template v-slot:placeholder>
                                        
                                    </template>
                                </v-img>
                                <v-card-title>Zdjęcie podglądowe pojazdu</v-card-title>
                                <v-card-subtitle><b>UWAGA:</b> Zdęcie może nie oddawać aktualnego wyglądu pojazdu.</v-card-subtitle>
                                <v-card-text>Nazwa kodowa pojazdu: {{ vehicleData.model }}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card>
                                <v-card-title>Notatki</v-card-title>
                                <v-card-subtitle class="red--text" v-if="notesEditMode">TRYB EDYCJI WŁĄCZONY - ZMIANY NIEZAPISANE</v-card-subtitle>
                                <v-card-text>
                                    <v-textarea no-resize outlined :value="vehicleData.notes" :readonly="!notesEditMode" v-model="notesTextarea"></v-textarea>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-tooltip left>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn icon v-bind="attrs" v-on="on" @click="toggleNotesEdit()"><v-icon>mdi-pencil</v-icon></v-btn>
                                        </template>
                                        <span>Przełącz tryb edycji</span>
                                    </v-tooltip>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card>       
                                <v-card-title>Flagi</v-card-title>
                                <v-card-subtitle class="red--text" v-if="flagsEditMode">TRYB EDYCJI WŁĄCZONY - ZMIANY NIEZAPISANE</v-card-subtitle>
                                <v-card-text>
                                    <v-row>
                                        <v-col>
                                            <p style="font-size: 13pt; margin-bottom: 8px !important">Kradziony: <b v-if="!vehicleData.isStolen">NIE</b><b v-if="vehicleData.isStolen" class="red--text">TAK</b>
                                                <v-btn class="ml-3" icon :disabled="!flagsEditMode" @click="vehicleData.isStolen = !vehicleData.isStolen">
                                                    <v-icon>mdi-sync</v-icon>
                                                </v-btn>
                                            </p>
                                            <v-divider></v-divider>
                                            <p style="font-size: 13pt; margin-top: 8px; margin-bottom: 8px">Poszukiwany: <b v-if="vehicleData.isWanted" class="red--text">TAK</b><b v-if="!vehicleData.isWanted">NIE</b>
                                                <v-btn class="ml-3" icon :disabled="!flagsEditMode" @click="vehicleData.isWanted = !vehicleData.isWanted">
                                                    <v-icon>mdi-sync</v-icon>
                                                </v-btn>
                                            </p>
                                            <v-divider></v-divider>
                                            <p style="font-size: 13pt; margin-top: 8px; margin-bottom: 8px">Dopuszczony do ruchu: <b v-if="!vehicleData.isAllowedInTraffic" class="red--text">NIE</b><b v-if="vehicleData.isAllowedInTraffic">TAK</b>
                                                <v-btn class="ml-3" icon :disabled="!flagsEditMode" @click="vehicleData.isAllowedInTraffic = !vehicleData.isAllowedInTraffic">
                                                    <v-icon>mdi-sync</v-icon>
                                                </v-btn>
                                            </p>
                                            <v-divider></v-divider>
                                            <p style="font-size: 13pt; margin-top: 8px; margin-bottom: 8px">Ubezpieczony: <b v-if="!vehicleData.isInsurenceValid" class="red--text">NIE</b><b v-if="vehicleData.isInsurenceValid">TAK</b>
                                                <v-btn class="ml-3" icon :disabled="!flagsEditMode" @click="vehicleData.isInsurenceValid = !vehicleData.isInsurenceValid">
                                                    <v-icon>mdi-sync</v-icon>
                                                </v-btn>
                                            </p>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-tooltip left>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn icon v-bind="attrs" v-on="on" @click="editVehicleFlags()"><v-icon>mdi-pencil</v-icon></v-btn>
                                        </template>
                                        <span>Przełącz tryb edycji</span>
                                    </v-tooltip>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                        <!-- <v-col>
                            <p style="font-size: 13pt;">Kolor podstawowy: <b>Czarny</b></p>
                            <p style="font-size: 13pt;">Kolor dodatkowy: <b>Czarny</b></p>
                            <p style="font-size: 13pt;">Kolor felg: <b>Chromowane</b></p>
                        </v-col> -->
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import alt from "@/main.js"

export default {
    data: () => ({
        dialog: false,
        ownerFullname: "Michael Monder",
        ownerUID: 7,
        vehicleData: {
            model: "revolter",
            modelLabel: "Revolter",
            manufacturerLabel: "Ubermacht",
            plate: "GRL 1259",
            isStolen: false,
            isAllowedInTraffic: true,
            isInsurenceValid: true,
            isWanted: false,
            notes: "Pojazd widywany często w pobliżu IAA, kierowca zawsze ma słuchawkę w uchu, możliwa własność IAA"
        },
        notesEditMode: false,
        flagsEditMode: false,
    }),

    methods: {
        editVehicleFlags() {
            if (this.flagsEditMode) {
                this.flagsEditMode = false
                alt.emit("mdt:vehicleDataUpdate", this.vehicleData)
            } else {
                this.flagsEditMode = true
            }
        },

        searchCitizenData(citizenID) {
            alt.emit("mdt:requestCitizenData", citizenID)
        },

        toggleNotesEdit() {
            this.notesEditMode = !this.notesEditMode;
            if (!this.notesEditMode) {
                this.vehicleData.notes = this.notesTextarea
                //alert(this.notesTextarea)
            }
        }
    },

    mounted() {
        this.$root.$on("showVehiclenDataDialog", (data) => {
            this.dialog = true
            this.notesTextarea = vehicleData.vehicleData.notes
        }),
        this.$root.$on("closeVehicleDataDialog", () => {
            //this.closeDialog()
            this.dialog = false
        })
    },

    beforeMount() {
        if ("alt" in window) {
            window.alt.on("mdt:vehicleDataCallback", (result) => {
                this.vehicleData = result;
                this.notesTextarea = result.notes;
            });
        }
    },

    watch: {

    },

    created: function() {
        this.notesTextarea = this.vehicleData.notes;
    },
}
</script>