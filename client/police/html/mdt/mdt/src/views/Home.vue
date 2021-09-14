<template>
  <div class="home">
    <v-row class="mx-auto" justify="center">
      <v-col>
        <v-card class="mx-auto mt-10 ml-5" max-width="500">
          <v-card-title>Znajdź obywatela</v-card-title>
          <v-card-subtitle>Wyświetla wszystkie dane obywatela z bazy NCIC</v-card-subtitle>
          <v-card-text>
            <v-row class="ml-5 mr-5">
              <span style="font-size: 12pt; font-weight: 450">Szukaj przy użyciu:</span>
            </v-row>
            <v-row class="ml-5 mr-5">
              <v-radio-group v-model="searchType" row>
                <v-radio label="Imię i nazwisko" value="name"></v-radio>
                <v-radio label="Identyfikator obywatela" value="citizenUID"></v-radio>
              </v-radio-group>
              <v-text-field
                v-model="citizenSearchInput"
                :label="citizenSearchInputLabel"
                outlined
                ref="imieNazwisko"
                required
                clearable
                :error-messages="fieldRequiredName"
              >
              </v-text-field>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="sendCitizenToSearch" color="blue">Zatwierdź</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="mx-auto mt-10 ml-5" max-width="500">
          <v-card-title>Znajdź pojazd</v-card-title>
          <v-card-subtitle>Wyświetla wszystkie dane pojazdu z bazy NCIC</v-card-subtitle>
          <v-card-text>
            <v-row class="ml-5 mr-5">
              <v-text-field
                v-model="licenseNumber"
                label="Numer Rejestracyjny"
                outlined
                ref="licenseNumber"
                required
                clearable
                :error-messages="fieldRequiredVehicle"
              >
              </v-text-field>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="sendVehicleToSearch" color="blue">Zatwierdź</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="mx-auto mt-10 ml-5">
          <v-card-title>Aktualny status: {{ dutyStatusLabel }}</v-card-title>
          <v-card-text>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn class="mt-2" color="blue lighten-3" v-on="on">Zmień status</v-btn>
              </template>
              <v-list>
                <v-list-item @click="changeDutyStatus(1)">
                  <v-list-item-title><b>[1]</b> Na służbie</v-list-item-title>
                </v-list-item>
                <v-list-item @click="changeDutyStatus(2)">
                  <v-list-item-title><b>[2]</b> Przerwa w służbie</v-list-item-title>
                </v-list-item>
                <v-list-item @click="changeDutyStatus(3)">
                  <v-list-item-title><b>[3]</b> Poza służbą</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-text>
        </v-card>
        <v-card class="mx-auto mt-10 ml-5">
          <v-card-title>Poziom zagrożenia terrorystycznego</v-card-title>
          <v-card-text>
            <div v-if="threatLevel === 0">
              <p class="teal--text text--lighten-1 display-1" style="margin-bottom: 0px;">NISKI</p>
              <span class="subtitle-1">Niskie ryzyko ataku terrorystycznego. Brak potrzeby zachowyania dodatkowych środków ostrożności.</span>
            </div>
            <div v-if="threatLevel === 1">
              <!-- OSTRZEŻENIE PRZESTROGA BACZNOŚĆ ? -->
              <p class="blue--text blue--lighten-1 display-1" style="margin-bottom: 0px;">OSTRZEŻENIE</p>
              <span class="subtitle-1">Generalne ryzyko ataku terrorystycznego.</span>
            </div>
            <div v-if="threatLevel === 2">
              <p class="yellow--text text--lighten-1 display-1" style="margin-bottom: 0px;">PODWYŻSZONY</p>
              <span class="subtitle-1">Znaczące ryzyko ataku terrorystycznego.</span>
            </div>
            <div v-if="threatLevel === 3">
              <p class="orange--text text--lighten-1 display-1" style="margin-bottom: 0px;">WYSOKI</p>
              <span class="subtitle-1">Wysokie ryzyko ataku terrorystycznego.</span>
            </div>
            <div v-if="threatLevel === 4">
              <p class="red--text text--lighten-1 display-1" style="margin-bottom: 0px;">POWAŻNE ZAGROŻENIE</p>
              <span class="subtitle-1">Poważne zagrożenie atakiem terrorystycznym.</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="mx-auto mt-10 ml-5 mr-5">
          <v-card-title>Aktualnie na służbie</v-card-title>
          <v-card-text>
            <p class="subtitle-1"><b>{{ officersOnDutyCount.commandBureau }}</b> członków Command Bureau</p>
            <p class="subtitle-1"><b>{{ officersOnDutyCount.LSPD }}</b> funkcjonariuszy Los Santos Police Department</p>
            <p class="subtitle-1"><b>{{ officersOnDutyCount.BCSO }}</b> funkcjonariuszy Blaine County Sheriff Office</p>
            <p class="subtitle-1"><b>{{ officersOnDutyCount.PBSO }}</b> funkcjonariuszy Paleto Bay Sheriff Office</p>
            <p class="subtitle-1"><b>{{ officersOnDutyCount.SAHP }}</b> funkcjonariuszy San Andreas Highway Patrol</p>
            <p class="subtitle-1">Łącznie funkcjonariuszy na służbie: <b>{{ officersOnDutyCount.commandBureau + officersOnDutyCount.LSPD + officersOnDutyCount.BCSO + officersOnDutyCount.PBSO + officersOnDutyCount.SAHP }}</b></p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mx-auto">
      <v-col cols="12" md="6">
        <v-data-table class="mx-auto ml-5 mt-10 elevation-2" :headers="wantedTableHeaders" :items="lastWarrants" items-per-page="5" show-expand :expanded.sync="expanded" hide-default-footer>
          <template v-slot:expanded-item="{ wantedTableHeaders, item }">
              <td class="mx-5" colspan="4"><b>Wygląd:</b> {{ item.poszukiwany_wyglad }} <br> <b>Dodatkowe informacje:</b> {{ item.dodatkowe_info }} </td>
          </template>
          <template v-slot:top>
              <v-toolbar flat>
                  <v-toolbar-title class="title">Ostatnio dodane poszukiwane osoby</v-toolbar-title>
              </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mx-auto ml-5 mt-10 mr-5">
          <v-card-title>Informacje o patrolu<!-- <v-spacer></v-spacer>Automatyczna dyzpozytornia:<b style="color: #EF5350; margin-left: 5px">{{ dispatchState }}</b> --></v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <span style="font-size: 14pt">Funkcjonariusze:</span> 
              </v-col>
              <v-col>
                <span style="font-size: 14pt">Pojazd:</span>                
              </v-col>
              <v-col>
                <span style="font-size: 14pt">Typ jednostki:</span>                
              </v-col>
              <v-col>
                <span style="font-size: 14pt">Obszar patrolu:</span>                
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div v-for="partner in patrolPartnersArray" :key="partner.odznaka">
                    <span style="font-size: 14pt; font-weight: 500">[{{ partner.odznaka }}] {{ partner.fullname }}<br></span>    
                  </div>
              </v-col>
              <v-col>
                <span style="font-size: 14pt; font-weight: 500">{{ patrolInfo.vehicle }}</span>                
              </v-col>
              <v-col>
                <span style="font-size: 14pt; font-weight: 500">{{ patrolInfo.type }}</span>                
              </v-col>
              <v-col>
                <span style="font-size: 14pt; font-weight: 500">{{ patrolInfo.area }}</span>                
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red lighten-3" @click="clearPatrolInfo"><v-icon left>mdi-delete</v-icon>Usuń informacje o patrolu</v-btn>
            <v-btn color="blue lighten-3" @click="patrolInfoEditorDialog = true"><v-icon left>mdi-pencil</v-icon>Edytuj informacje o patrolu</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-dialog v-model="patrolInfoEditorDialog" persistent max-width="1200">
        <v-card>
          <v-card-title>Edytuj informacje o patrolu</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field v-model="addPatrolPartnerTextField" :error-messages="addPatrolPartnerTextFieldErrorMsg" label="Numer odznaki członka patrolu" :rules="[rules.isNaN, rules.isPositive]"></v-text-field>
                <v-btn class="mt-3" color="blue lighten-3" block @click="addPatrolPartnerBtn">Dodaj członka patrolu</v-btn>
                <div class="mt-3">
                  <span class="subtitle">Członkowie patrolu</span>
                  <div v-for="partner in patrolPartnersArray" :key="partner.odznaka">
                    <span style="font-size: 14pt; font-weight: 500">[{{ partner.odznaka }}] {{ partner.fullname }}<br></span>    
                  </div>
                </div>
              </v-col>
              <v-col>
                <v-autocomplete v-model="vehicleAutocomplete" :items="policeVehicles" item-text="name" label="Pojazd"></v-autocomplete>
              </v-col>
              <v-col>
                <v-autocomplete v-model="patrolTypeAutocomplete" :items="patrolTypes" item-text="name" label="Typ jednostki"></v-autocomplete>
              </v-col>
              <v-col>
                <v-autocomplete v-model="patrolAreaAutocomplete" :items="patrolAreas" item-text="name" label="Obszar patrolu"></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="closePatrolInfoEditorDialog">Anuluj</v-btn>
            <v-btn color="light-green darken-1" text @click="updatePatrolInfo">Zatwierdź</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import alt from "@/main.js"

//:rules="[() => !!licenseNumber || 'To pole jest wymagane']"


export default {
  name: 'home',

  data: () => ({
    fieldRequiredName: "",
    fieldRequiredVehicle: "",
    searchType: "name",
    citizenSearchInputLabel: "Imię i nazwisko",
    threatLevel: 0,
    officersOnDutyCount: {commandBureau: 5, LSPD: 25, BCSO: 15, PBSO: 10, SAHP: 10},
    dutyStatus: 3,
    dispatchState: false,
    addPatrolPartnerTextField: "",
    addPatrolPartnerTextFieldErrorMsg: "",
    patrolInfo: {vehicle: null, type: null, area: null},
    patrolInfoEditorDialog: false,
    dutyStatusLabel: "Poza służbą",
    wantedTableHeaders: [
      { text: "Poszukiwany", align: "start", sortable: false, value: "poszukiwany_char_fullname"},
      { text: "Powód poszukiwań", sortable: false, value: "powod" },
      { text: "Funkcjonariusz", sortable: false, value: "funkcjonariusz" },
      { text: "Data", sortable: false, value: "data_wpisu" },
      { text: "", sortable: false, value: "data-table-expand" }
    ],
    lastWarrants: [
      {
        id: 555,
        poszukiwany_char_id: 489,
        poszukiwany_char_fullname: "Walter White",
        powod: "Napad na Bank Rezerw Federalnych",
        poszukiwany_wyglad: "Mężczyzna zawsze ubrany w garnitur, ciemne włosy. Czasami nosi kaburę.",
        dodatkowe_info: "Podsiada broń, niebezpieczny, porusza się czarnym Revolterem o numerach SPL 1689",
        data_wpisu: "12.03.2020",
        aresztowano: false,
        funkcjonariusz: "Michael Hoffman"
      },
      {
        id: 567,
        poszukiwany_char_id: 163,
        poszukiwany_char_fullname: "Bob Black",
        powod: "Nie stawił się na kawę z Eagle One",
        poszukiwany_wyglad: "Ciemne włosy, zakola, rozmyty makijaż pod oczami.",
        dodatkowe_info: "Podsiada broń, niebezpieczny, najczęściej porusza się Canisem Kamacho",
        data_wpisu: "12.03.2020",
        aresztowano: false,
        funkcjonariusz: "Michael Hoffman"
      }
    ],
    policeVehicles: [
      {header: "Patrolowe oznakowane"},
      {name: "Ford Crown Victoria"},
      {name: "Chevrolet Impala"},
      {name: "Chevrolet Tahoe"},
      {name: "Ford Taurus"},
      {name: "Ford Explorer"},
      {name: "Dodge Charger"},
      {name: "Ford F-150 Raptor"},
      {divider: true},
      {header: "Patrolowe nieoznakowane"},
      {name: "Ford Crown Victoria [UC]"},
      {name: "Chevrolet Impala [UC]"},
      {name: "Chevrolet Tahoe [UC]"},
      {name: "Chevrolet Suburban [UC]"},
      {name: "Ford Taurus [UC]"},
      {name: "Ford Explorer [UC]"},
      {name: "Dodge Charger [UC]"},
      {name: "Ford F-150 Raptor [UC]"},
      {divider: true},
      {header: "Pościgowe"},
      {name: "Ford Mustang GT"},
      {divider: true},
      {header: "Transportowe"},
      {name: "Policyjna więźniarka"},
      {name: "Autobus więzienny"},
      {divider: true},
      {header: "Pojazdy specjalne"},
      {name: "Opancerzony Riot S.W.A.T."},
      {name: "Wóz pacyfikacyjny"},
      {name: "Łódź patrolowa Predator"},
    ],
    patrolTypes: [
      {name: "LINCOLN - Patrol radiowozem oznakowanym", value: "LINCOLN"},
      {name: "FRANKLIN - Patrol radiowozem nieoznakowanym", value: "FRANKLIN"},
      {name: "ROBERT - Patrol radiowozem pościgowym", value: "ROBERT"},
      {name: "X-MEN - Patrol szkoleniowy", value: "X-MEN"},
      {name: "EDWARD - Patrol radiowozem terenowym", value: "EDWARD"},
      {name: "MARRY - Patrol na motocyklu", value: "MARRY"},
      {name: "OKO - Patrol śmigłowcem", value: "OKO"},
      {name: "SHARK - Patrol łodzią", value: "SHARK"},
      {name: "HENRY - Patrol pieszy", value: "HENRY"},
    ],
    patrolAreas: [
      {header: "Los Santos"},
      {name: "Vinewood"},
      {name: "Vinewood Hills"},
      {name: "Rockford Hills"},
      {name: "Richman"},
      {name: "Morningwood"},
      {name: "Pacyfic Bluffs"},
      {name: "Downtown"},
      {name: "Little Seoul"},
      {name: "Del Perro"},
      {name: "Vespucci"},
      {name: "Południowe Los Santos"},
      {name: "La Puerta"},
      {name: "Mirror Park"},
      {name: "Wschodnie Los Santos"},
      {name: "Port morski Los Santos"},
      {name: "Terminal"},
      {name: "Lotnisko Międzynarodowe Los Santos"},
      {divider: true},
      {header: "Autostrady"},
      {name: "Los Santos Freeway"},
      {name: "Senora Freeway"},
      {name: "Great Ocean Highway"},
      {name: "Olympic Freeway"},
      {name: "La Puerta Freeway"},
      {name: "Del Perro Freeway"},
      {name: "Palomino Freeway"},
      {divider: true},
      {header: "Blaine County"},
      {name: "Sandy Shores"},
      {name: "Grapeseed"},
      {name: "Paleto Bay"},
      {divider: true},
      {header: "Inne"},
      {name: "Cały stan"},
      {name: "Przestrzeń powietrzna San Andreas"},
      {name: "Wody terytorialne"},
    ],
    officersOnDuty: [
      {fullname: "Richard Parker", odznaka: 100, faction: "LSPD"},
      {fullname: "Michael Monder", odznaka: 101, faction: "LSPD"},
      {fullname: "James Ford", odznaka: 109, faction: "LSPD"},

    ],
    patrolPartnersArray: [],
    expanded: [],
    rules: {
      isNaN: value => !isNaN(value) || "Wartość musi być wyrażona liczbą",
      isPositive: value => value >= 0 || "Wartośc nie może być mniejsza od zera"
    },
  }),

  methods: {
    sendCitizenToSearch () {
      if (this.searchType === "name" && this.citizenSearchInput !== undefined) {
        alt.emit("mdt:requestCitizenDatabaseByName", this.citizenSearchInput)
        this.fieldRequiredName = ""
      } else if (this.searchType === "citizenUID" && this.citizenSearchInput !== undefined) {
        alt.emit("mdt:requestCitizenDatabaseByCitizenUID", this.citizenSearchInput)
        this.fieldRequiredName = ""
      } else {
        this.fieldRequiredName = "To pole jest wymagane"
      }
    },

    sendVehicleToSearch () {
      if (this.licenseNumber === undefined) {
        this.fieldRequiredVehicle = "To pole jest wymagane"
      } else {
        this.fieldRequiredVehicle = ""
        alt.emit("mdt:requestVehicleDatabase", this.licenseNumber)
        //alert(this.licenseNumber)
      }
    },

    changeDutyStatus(val) {
      this.dutyStatus = val
    },

    closePatrolInfoEditorDialog() {
      this.vehicleAutocomplete = "",
      this.addPatrolPartnerTextField = "",
      this.patrolTypeAutocomplete = "",
      this.patrolAreaAutocomplete = "",
      this.patrolPartnersArray = [],
      this.patrolInfoEditorDialog = false
    },

    addPatrolPartnerBtn() {
      if (this.addPatrolPartnerTextField === "") {
        this.addPatrolPartnerTextFieldErrorMsg = "To pole jest wymagane"
      } else if (this.addPatrolPartnerTextField > 0 && !isNaN(this.addPatrolPartnerTextField)) {
        let officerToFound = this.officersOnDuty.find((officer) => officer.odznaka === parseInt(this.addPatrolPartnerTextField))
        let officerToFoundInExistingArray = this.patrolPartnersArray.find((officer) => officer.odznaka === parseInt(this.addPatrolPartnerTextField))
        if (officerToFound !== undefined && officerToFoundInExistingArray === undefined) {
          this.patrolPartnersArray.push(officerToFound)
        } else return;
      }
    },
    
    updatePatrolInfo() {
      this.patrolInfoEditorDialog = false
      this.patrolInfo.vehicle = this.vehicleAutocomplete
      this.patrolInfo.type = this.patrolTypeAutocomplete
      this.patrolInfo.area = this.patrolAreaAutocomplete
      localStorage.patrolInfo = {patrolPartnersArray: this.patrolPartnersArray, vehicle: this.patrolInfo.vehicle, type: this.patrolInfo.type, area: this.patrolInfo.area}
    },
    
    clearPatrolInfo() {
      this.patrolInfo.vehicle = null
      this.patrolInfo.type = null
      this.patrolInfo.area = null
      this.patrolPartnersArray = []
      localStorage.patrolInfo = null
    },
  },

  watch: {
    searchType: function (value) {
      if (value === "name") {
        this.citizenSearchInputLabel = "Imię i nazwisko"
      } else if (value === "citizenUID") {
        this.citizenSearchInputLabel = "Identyfikator obywatela"
      }
    },

    dutyStatus: function (val) {
      switch (val){
        case 1: 
          this.dutyStatusLabel = "Na służbie" 
          break;

        case 2: 
          this.dutyStatusLabel = "Przerwa w służbie" 
          break;

        case 3: 
          this.dutyStatusLabel = "Poza służbą"
          break;
      }
    }
  },

  mounted() {
    this.$root.$on("changeDispatchState", (value) => {
      //alert(value[0])
      this.dispatchState = value
    })
  }
}
</script>
