<template>
    <v-row>
        <v-dialog v-model="dialog" max-width="1300">
            <v-card>
                <v-card-title>Dane obywatela z bazy NCIC
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-subtitle>Wyciąg danych z National Crime Information Center</v-card-subtitle>
                <v-tabs vertical>
                    <v-tab>Ogólne</v-tab>
                    <v-tab>Uprawnienia</v-tab>
                    <v-tab>Posiadane pojazdy</v-tab>
                    <v-tab>Posiadane nieruchomości</v-tab>
                    <v-tab>Notatki</v-tab>
                    
                    <v-tab-item>
                        <!-- Ogólne -->
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" md="2">
                                    <!-- :src="require('@/assets/Portrait_Placeholder.png')" -->
                                    <v-img
                                        src="https://prod.cloud.rockstargames.com/members/sc/1135/113073155/publish/gta5/mpchars/0.png"
                                        height="150"
                                        width="150"
                                    ></v-img>
                                </v-col>
                                <v-col>
                                    <p style="font-size: 12pt;">Imię i nazwisko: <b>{{ daneObywatela.char_fullname }}</b></p>
                                    <p style="font-size: 12pt;">Identyfikator obywatela: <b>{{ daneObywatela.id }}</b></p>
                                    <p style="font-size: 12pt;">Data urodzenia: <b>{{ daneObywatela.char_birthdate.toString() }}</b></p>
                                    <p style="font-size: 12pt;">Wzrost: <b>{{ daneObywatela.char_height }} cm</b></p>
                                </v-col>
                                <!-- <v-col>
                                    <p v-if="isWanted" style="font-size: 14pt; color: rgb(255, 50, 50);" class="text-uppercase"><b>poszukiwany</b></p>
                                </v-col> -->
                                <v-col>
                                    <p style="font-size: 12pt;">Frakcja: <b>{{ daneObywatela.char_faction_label }}</b></p>
                                    <p style="font-size: 12pt;">Stopień : <b>{{ daneObywatela.char_faction_grade_label }}</b></p>
                                    <br>
                                    <p style="font-size: 12pt;">Przedsiębiorstwo: <b>{{ daneObywatela.char_business_label }}</b></p>
                                    <p style="font-size: 12pt;">Stopień : <b>{{ daneObywatela.char_business_grade_label }}</b></p>
                                </v-col>
                                <!-- <v-col>
                                    <v-card>
                                        <v-card-title>Licencje</v-card-title>
                                        <v-card-text>
                                            <v-row>
                                                <v-col>
                                                    <p style="font-size: 12pt;">Prawo jazdy kat. A: <b>Posiada</b></p>
                                                    <p style="font-size: 12pt;">Prawo jazdy kat. B: <b>Posiada</b></p>
                                                    <p style="font-size: 12pt;">Prawo jazdy kat. C: <b>Brak</b></p>
                                                </v-col>
                                                <v-col>
                                                    <p style="font-size: 12pt;">Licencja na broń kl. I: <b>Posiada</b></p>
                                                    <p style="font-size: 12pt;">Licencja na broń kl. II: <b>Posiada</b></p>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-col> -->
                            </v-row>
                            <v-row>
                                <v-col style="padding-top: 0px; padding-bottom: 0px;">
                                    <p v-if="daneObywatela.isWanted"  style="color: rgb(255, 50, 50); margin-bottom: 0px;" class="text-uppercase display-1">
                                        <b v-if="daneObywatela.char_sex === 'male'">poszukiwany</b>
                                        <b v-else-if="daneObywatela.char_sex=== 'female'">poszukiwana</b>
                                    </p>
                                    <p v-if="daneObywatela.isWanted" style="color: rgb(255, 50, 50);" class="subtitle-1"><b>Więcej informacji w wykazie osób poszukiwanych</b></p>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row>
                                <v-col>
                                    <v-data-table v-model="wpisyTable" :headers="tableHeaders" :items="daneObywatela.citizen_database" show-expand :expanded.sync="expanded" item-key="id" :page.sync="wpisyPagination" items-per-page="5" hide-default-footer class="elevation-1" @page-count="wpisyPage = $event">
                                        <template v-slot:expanded-item="{ tableHeaders, item }">
                                            <td class="mx-5" colspan="4"><b>Zarzuty:</b> {{ item.zarzuty }} <br> <b>Uwagi:</b> {{ item.uwagi }} </td>
                                        </template>
                                        <template v-slot:item.grzywna="{ item }">
                                            <span>${{ numberWithSpaces(item.grzywna) }}</span>
                                        </template>
                                        <template v-slot:item.areszt="{ item }">
                                            <span>{{ item.areszt }} miesięcy</span>
                                        </template>
                                        <template v-slot:top>
                                            <v-toolbar flat>
                                                <v-toolbar-title class="title">Wpisy w bazie danych</v-toolbar-title>
                                            </v-toolbar>
                                        </template>
                                        <template v-slot:no-data>
                                            <span class="subtitle-1 green--text text--lighten-1"><i>Brak wpisów w bazie NCIC</i></span>
                                        </template>
                                    </v-data-table>
                                    <div v-if="daneObywatela.citizen_database.length !== 0" class="text-center pt-2">
                                        <v-pagination v-model="wpisyPagination" :length="wpisyPage"></v-pagination>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-tab-item>

                    <v-tab-item>
                        <!-- Uprawnienia -->
                        <v-card-text>
                            <v-row>
                                <v-col>
                                    <v-card>
                                        <v-card-title>Prawo jazdy</v-card-title>
                                        <v-card-subtitle class="red--text" v-if="DLEditMode">TRYB EDYCJI WŁĄCZONY - ZMIANY NIEZAPISANE</v-card-subtitle>
                                        <v-card-text>
                                            <v-row>
                                                <v-col>
                                                    <p style="font-size: 12pt;">kat. A: <b>{{ daneObywatela.char_licenses.dl_catA }}</b>
                                                        <v-menu offset-y>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn :disabled="!DLEditMode" icon v-bind="attrs" v-on="on"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                                                            </template>
                                                            <v-list>
                                                                <v-list-item @click="daneObywatela.char_licenses.dl_catA = 'Posiada'">
                                                                    <v-list-item-title>Posiada</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.dl_catA = 'Zawieszona'">
                                                                    <v-list-item-title>Zawieszona</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.dl_catA = 'Brak'">
                                                                    <v-list-item-title>Brak</v-list-item-title>
                                                                </v-list-item>
                                                            </v-list>
                                                        </v-menu>
                                                    </p>
                                                    <p style="font-size: 12pt;">kat. B: <b>{{ daneObywatela.char_licenses.dl_catB }}</b>
                                                        <v-menu offset-y>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn :disabled="!DLEditMode" icon v-bind="attrs" v-on="on"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                                                            </template>
                                                            <v-list>
                                                                <v-list-item @click="daneObywatela.char_licenses.dl_catB = 'Posiada'">
                                                                    <v-list-item-title>Posiada</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.dl_catB = 'Zawieszona'">
                                                                    <v-list-item-title>Zawieszona</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.dl_catB = 'Brak'">
                                                                    <v-list-item-title>Brak</v-list-item-title>
                                                                </v-list-item>
                                                            </v-list>
                                                        </v-menu>
                                                    </p>
                                                    <p style="font-size: 12pt;">kat. C: <b>{{ daneObywatela.char_licenses.dl_catC }}</b>
                                                        <v-menu offset-y>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn :disabled="!DLEditMode" icon v-bind="attrs" v-on="on"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                                                            </template>
                                                            <v-list>
                                                                <v-list-item @click="daneObywatela.char_licenses.dl_catC = 'Posiada'">
                                                                    <v-list-item-title>Posiada</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.dl_catC = 'Zawieszona'">
                                                                    <v-list-item-title>Zawieszona</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.dl_catC = 'Brak'">
                                                                    <v-list-item-title>Brak</v-list-item-title>
                                                                </v-list-item>
                                                            </v-list>
                                                        </v-menu>
                                                    </p>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-tooltip left>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="toggleDLEdit()"><v-icon>mdi-pencil</v-icon></v-btn>
                                                </template>
                                                <span>Przełącz tryb edycji</span>
                                            </v-tooltip>
                                        </v-card-actions>
                                    </v-card>

                                    <!-- <p style="font-size: 12pt;">Prawo jazdy kat. A: <b>{{ daneObywatela.char_licenses.dl_catA }}</b></p>
                                    <p style="font-size: 12pt;">Prawo jazdy kat. B: <b>{{ daneObywatela.char_licenses.dl_catB }}</b></p>
                                    <p style="font-size: 12pt;">Prawo jazdy kat. C: <b>{{ daneObywatela.char_licenses.dl_catC }}</b></p> -->
                                </v-col>
                                <v-col>
                                    <v-card>
                                        <v-card-title>Licencja na broń</v-card-title>
                                        <v-card-subtitle class="red--text" v-if="WLEditMode">TRYB EDYCJI WŁĄCZONY - ZMIANY NIEZAPISANE</v-card-subtitle>
                                        <v-card-text>
                                            <v-row>
                                                <v-col>
                                                    <p style="font-size: 12pt;">klasy I: <b>{{ daneObywatela.char_licenses.wl_c1 }}</b>
                                                        <v-menu offset-y>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn :disabled="!WLEditMode" icon v-bind="attrs" v-on="on"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                                                            </template>
                                                            <v-list>
                                                                <v-list-item @click="daneObywatela.char_licenses.wl_c1 = 'Posiada'">
                                                                    <v-list-item-title>Posiada</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.wl_c1 = 'Zawieszona'">
                                                                    <v-list-item-title>Zawieszona</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.wl_c1 = 'Brak'">
                                                                    <v-list-item-title>Brak</v-list-item-title>
                                                                </v-list-item>
                                                            </v-list>
                                                        </v-menu>
                                                    </p>
                                                    <p style="font-size: 12pt;">klasy II: <b>{{ daneObywatela.char_licenses.wl_c2 }}</b>
                                                        <v-menu offset-y>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn :disabled="!WLEditMode" icon v-bind="attrs" v-on="on"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                                                            </template>
                                                            <v-list>
                                                                <v-list-item @click="daneObywatela.char_licenses.wl_c2 = 'Posiada'">
                                                                    <v-list-item-title>Posiada</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.wl_c2 = 'Zawieszona'">
                                                                    <v-list-item-title>Zawieszona</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.wl_c2 = 'Brak'">
                                                                    <v-list-item-title>Brak</v-list-item-title>
                                                                </v-list-item>
                                                            </v-list>
                                                        </v-menu>
                                                    </p>
                                                    <p style="font-size: 12pt;">specjalną: <b>{{ daneObywatela.char_licenses.wl_c3 }}</b>
                                                        <v-menu offset-y>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn :disabled="!WLEditMode" icon v-bind="attrs" v-on="on"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                                                            </template>
                                                            <v-list>
                                                                <v-list-item @click="daneObywatela.char_licenses.wl_c3 = 'Posiada'">
                                                                    <v-list-item-title>Posiada</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.wl_c3 = 'Zawieszona'">
                                                                    <v-list-item-title>Zawieszona</v-list-item-title>
                                                                </v-list-item>
                                                                <v-list-item @click="daneObywatela.char_licenses.wl_c3 = 'Brak'">
                                                                    <v-list-item-title>Brak</v-list-item-title>
                                                                </v-list-item>
                                                            </v-list>
                                                        </v-menu>
                                                    </p>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-tooltip left>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="toggleWLEdit()"><v-icon>mdi-pencil</v-icon></v-btn>
                                                </template>
                                                <span>Przełącz tryb edycji</span>
                                            </v-tooltip>
                                        </v-card-actions>
                                    </v-card>
                                    <!-- <p style="font-size: 12pt;">Licencja na broń kl. I: <b>{{ daneObywatela.char_licenses.wl_c1 }}</b></p>
                                    <p style="font-size: 12pt;">Licencja na broń kl. II: <b>{{ daneObywatela.char_licenses.wl_c2 }}</b></p> -->
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-tab-item>

                    <v-tab-item>
                        <!-- Posiadane pojazdy -->
                        <v-card-text>
                            <v-data-table v-model="vehiclesTable" :headers="vehiclesTableHeaders" :items="daneObywatela.citizen_vehicles" show-expand :expanded.sync="expanded_vehicles" item-key="id" :page.sync="wpisyVehiclesPagination" items-per-page="5" hide-default-footer class="elevation-1" @page-count="wpisyVehiclesPage = $event">
                                <template v-slot:expanded-item="{ tableHeaders, item }">
                                    <td class="mx-5" colspan="4"><b>Nazwa kodowa pojazu:</b> {{ item.model }} <br> <b>Notatki:</b> {{ item.notes }} </td>
                                </template>
                                <template v-slot:item.vehName="{ item }">
                                    <span>{{ item.manufacturerLabel }} - {{ item.modelLabel }}
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="mx-1 align-center justify-center text-center" v-bind="attrs" v-on="on" color="red" v-if="item.isWanted">mdi-alert-circle</v-icon>
                                            </template>
                                            <span>Pojazd oznaczony jako poszukiwany</span>
                                        </v-tooltip>
                                    </span>
                                </template>
                                <template v-slot:item.actions="{ item }">
                                    <v-btn class="ml-5" small icon @click="searchVehicleData(item.id)"><v-icon>mdi-magnify</v-icon></v-btn>
                                </template>
                                <!-- <template v-slot:top>
                                    <v-toolbar flat>
                                        <v-toolbar-title class="title">Po</v-toolbar-title>
                                    </v-toolbar>
                                </template> -->
                                <template v-slot:no-data>
                                    <span><i>Brak informacji o posiadanych pojazdach</i></span>
                                </template>
                            </v-data-table>
                            <div v-if="daneObywatela.citizen_vehicles.length !== 0" class="text-center pt-2">
                                <v-pagination v-model="wpisyVehiclesPage" :length="wpisyVehiclesPage"></v-pagination>
                            </div>
                        </v-card-text>
                    </v-tab-item>
                    
                    <v-tab-item>
                        <!-- Posiadane nieruchomości -->
                        <v-card-text>
                            <v-data-table v-model="wpisyPropertiesTable" :headers="propertiesTableHeaders" :items="daneObywatela.citizen_properties" item-key="id" :page.sync="wpisyPropertiesPagination" items-per-page="5" hide-default-footer class="elevation-1" @page-count="wpisyPropertiesPage = $event">
                                <template v-slot:expanded-item="{ tableHeaders, item }">
                                    <td class="mx-5" colspan="4"><b>Zarzuty:</b> {{ item.zarzuty }} <br> <b>Uwagi:</b> {{ item.uwagi }} </td>
                                </template>
                                <template v-slot:item.actions="{ item }">
                                    <v-btn class="ml-5" icon @click="setWaypoint(item.entranceCoords)"><v-icon>mdi-crosshairs-gps</v-icon></v-btn>
                                </template>
                                <template v-slot:no-data>
                                    <span><i>Brak informacji o posiadanych nieruchomościach</i></span>
                                </template>
                            </v-data-table>
                            <div v-if="daneObywatela.citizen_properties.length !== 0" class="text-center pt-2">
                                <v-pagination v-model="wpisyPropertiesPagination" :length="wpisyPropertiesPage"></v-pagination>
                            </div>
                        </v-card-text>
                    </v-tab-item>

                    <v-tab-item>
                        <!-- Notatki -->
                        <v-card-text>
                            <v-row>
                                <v-col>
                                    <v-btn color="primary" block>Dodaj nową notatkę</v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>

                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-tab-item>
                </v-tabs>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import alt from "@/main.js"
import pedHeadshot from "@/assets/pedheadshot.js"

export default {
    data: () => ({
        dialog: true,
        daneObywatela: {
            id: 7,
            char_fullname: "Michael Monder",
            char_faction_label: "International Affairs Agency",
            char_faction_grade_label: "Dyrektor Centrali Wywiadu",
            char_business_label: "La Lumps Vineyard",
            char_business_grade_label: "Brygadier",
            char_birthdate: "1991-01-15",
            char_sex: "male",
            char_height: 181,
            char_licenses: {dl_catA: "Posiada", dl_catB: "Posiada", dl_catC: "Brak", wl_c1: "Posiada", wl_c2: "Zawieszona", wl_c3: "Brak"},
            isWanted: false,
            citizen_database: [
                /*{
                    id: 289,
                    karany_char_id: 7,
                    karany_fullname: "Michael Monder",
                    grzywna: 85000,
                    areszt: 200,
                    zarzuty: "Atak na konwój x 1 | Niezatrzymanie się do kontroli x 1 | Ucieczka przed policją x 3 | Spowodowanie ciężkiego uszczerbeku na zdrowiu x 1 |",
                    uwagi: "Zeznał, że jego pracodawcą jest właściciel winnicy",
                    data: "16.05.2020",
                    funkcjonariusz: "Tony Haris"
                },
                {
                    id: 584,
                    karany_char_id: 7,
                    karany_fullname: "Michael Monder",
                    grzywna: 65000,
                    areszt: 175,
                    zarzuty: "Niezatrzymanie się do kontroli x 1 | Ucieczka przed policją x 1 | Spowodowanie ciężkiego uszczerbeku na zdrowiu x 1 |",
                    uwagi: "Odmówił składania wyjaśnień",
                    data: "16.05.2020",
                    funkcjonariusz: "Eduardo Gonzales"
                },
                {
                    id: 637,
                    karany_char_id: 7,
                    karany_fullname: "Michael Monder",
                    grzywna: 15000,
                    areszt: 0,
                    zarzuty: "Niezatrzymanie się do kontroli x 1 |",
                    uwagi: "Zeznał, że jego pracodawcą jest właściciel winnicy (najprawdopodobniej Bob Black)",
                    data: "16.05.2020",
                    funkcjonariusz: "Michael Hoffman"
                },
                {
                    id: 648,
                    karany_char_id: 7,
                    karany_fullname: "Michael Monder",
                    grzywna: 10000,
                    areszt: 155,
                    zarzuty: "Atak na konwój x 1 |",
                    uwagi: "",
                    data: "16.05.2020",
                    funkcjonariusz: "Richard Parker"
                },
                {
                    id: 694,
                    karany_char_id: 7,
                    karany_fullname: "Michael Monder",
                    grzywna: 50000,
                    areszt: 90,
                    zarzuty: "Ucieczka przed policją x 5 |",
                    uwagi: "Złapany po nałożeniu kodu czarnego do pościgu",
                    data: "16.05.2020",
                    funkcjonariusz: "James Ford"
                },
                {
                    id: 700,
                    karany_char_id: 7,
                    karany_fullname: "Michael Monder",
                    grzywna: 10000,
                    areszt: 10,
                    zarzuty: "Ucieczka przed policją x 1 |",
                    uwagi: "",
                    data: "30.04.2021",
                    funkcjonariusz: "James Boston"
                }*/
            ],
            citizen_vehicles: [
                {
                    id: 4846,
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
                {
                    id: 6548,
                    model: "teslax",
                    modelLabel: "Model X",
                    manufacturerLabel: "Tesla",
                    plate: "GRL 6876",
                    isStolen: false,
                    isAllowedInTraffic: true,
                    isInsurenceValid: true,
                    isWanted: true,
                    notes: ""
                },
            ],
            citizen_properties: [
                {
                    id: 645,
                    entranceCoords: {x: 100.49, y: 67.456, z: 23.5},
                    addressLabel: "The Diamond Casino Master Penthouse",
                    areaLabel: "Vinewood Park Drive",
                },
                {
                    id: 796,
                    entranceCoords: {x: 100.49, y: 67.456, z: 23.5},
                    addressLabel: "Eclipse Tower, Penthouse Suite 3",
                    areaLabel: "Rockford Hills",
                },
            ],
            citizen_notes: [
                {
                    id: 95,
                    note: "",
                    officer: "James Boston",
                    timestamp: "01.05.2021"
                }
            ],
        },
        wantedText: "",
        wpisyPage: 0,
        wpisyPagination: 1,
        tableHeaders: [
            { text: "Data", align: "start", sortable: false, value: "data" },
            { text: "Areszt", sortable: false, value: "areszt" },
            { text: "Grzywna", sortable: false, value: "grzywna" },
            { text: "Funkcjonariusz", sortable: false, value: "funkcjonariusz" },
            { text: "", sortable: false, value: "data-table-expand" }
        ],
        wpisyVehiclesPage: 0,
        wpisyVehiclesPagination: 1,
        vehiclesTableHeaders: [
            { text: "Marka - model", align: "start", sortable: false, value: "vehName" },
            { text: "Nr. rejestracyjny", sortable: false, value: "plate" },
            { text: "Akcje", sortable: false, value: "actions" },
            { text: "", sortable: false, value: "data-table-expand" }
        ],
        wpisyPropertiesPage: 0,
        wpisyPropertiesPagination: 1,
        propertiesTableHeaders: [
            { text: "Adres", align: "start", sortable: false, value: "addressLabel" },
            { text: "Lokalizacja", align: "start", sortable: false, value: "areaLabel" },
            { text: "Akcje", sortable: false, value: "actions" },
        ],
        expanded: [],
        expanded_vehicles: [],
        DLEditMode: false,
        WLEditMode: false,
    }),

    methods: {
        numberWithSpaces(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        },

        toggleDLEdit() {
            this.DLEditMode = !this.DLEditMode;
            if (this.DLEditMode === false) {
                alt.emit("mdt:updateCitizenLicenses", this.daneObywatela.id, this.daneObywatela.char_licenses);
            }
        },

        toggleWLEdit() {
            this.WLEditMode = !this.WLEditMode;
            if (this.WLEditMode === false) {
                alt.emit("mdt:updateCitizenLicenses", this.daneObywatela.id, this.daneObywatela.char_licenses);
            }
        },

        searchVehicleData(id) {
            alert(id)
        },

        vehiclesRowStyle(item) {
            //console.log(`Item: ${item}`)
            if (item) {
                return "vehicleWantedBackground";
            }
        },

        setWaypoint(coords) {
            alt.emit("mdt:setWaypoint", coords)
        }
    },

    mounted() {
        this.$root.$on("showCitizenDataDialog", (data) => {
            this.dialog = true
        }),
        this.$root.$on("closeCitizenDataDialog", () => {
            this.closeDialog()
            //this.dialog = false
        })
    },

    watch: {
        isWanted: function(val) {
            if (val === false) {
                this.wantedText = ""
            } else {
                if (this.daneObywatela.char_sex === "male") {
                    this.wantedText = "poszukiwany"
                } else if (this.daneObywatela.char_sex === "female") {
                    this.wantedText = "poszukiwana"
                }
                
            }
        }
    },

    beforeMount() {
        if ("alt" in window) {
            window.alt.on("mdt:citizenDatabaseCallback", (result) => {
                this.dialog = true;
                this.daneObywatela = result
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.vehicleWantedBackground {
    background-color: rgb(255, 50, 50);
}

.color-corner {
  position: relative;
  &:before {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: 0;
    height: 0;
    border-right: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #ff8230;
    border-top: 10px solid #ff8230;
  }
}
</style>