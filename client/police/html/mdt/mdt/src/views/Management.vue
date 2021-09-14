<template>
    <div class="management">
        <DepartmentBudgetMoneyTransferDialog />
        <DepartmentAmountWithdrawDialog />
        <DepartmentAmountDepositDialog />
        <DepartmentOfficerBadgeNumberChange />
        <v-card tile>
            <v-card-title>Zarządzanie departamentem</v-card-title>
            <v-tabs vertical>
                <v-tab>Ogólne</v-tab>
                <v-tab>Zasoby ludzkie</v-tab>
                <v-tab>Finanse</v-tab>
                <v-tab disabled>Pojazdy</v-tab>
                <v-tab disabled>Broń</v-tab>

                <v-tab-item>
                    <!-- Ogólne -->
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-card>
                                <v-card-title>Drzwi komendy</v-card-title>
                                <v-card-subtitle>Zarządzanie stanem zamków drzwi dowolnej jednostki organizacyjnej. Zamknięcie drzwi spowoduje natychmiastowe zablokowanie <u>wszystkich</u> drzwi.</v-card-subtitle>
                                <v-card-text>
                                    <v-select v-model="stationSelect" :items="stationsArr" item-text="label" item-value="script" return-object label="Miejsce"></v-select>
                                    <v-row>
                                        <v-col>
                                            <v-switch v-model="stationDoorsSwitch" inset></v-switch>
                                        </v-col> 
                                        <v-col>
                                            <p style="margin-top: 16px;" class="subtitle-1">Status drzwi:<br> <b v-if="stationDoorsSwitch" class="green--text lighten-2">OTWARTE</b><b v-if="!stationDoorsSwitch" class="red--text lighten-2">ZAMKNIĘTE</b></p>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tab-item>
                <v-tab-item>
                    <!-- Zasoby ludzkie -->
                    <v-data-table :headers="officersTableHeaders" :items="officers" :search="searchOfficers" items-per-page="9999" hide-default-footer>
                        <template v-slot:top>
                            <v-text-field style="width: 500px" v-model="searchOfficers" append-icon="mdi-magnify" label="Wyszukaj"></v-text-field>
                        </template>
                        <template v-slot:item.police_odznaka="{ item }">
                            {{ item.police_odznaka }}
                            <v-btn icon @click="$root.$emit('showDepartmentOfficerBadgeNumberChangeDialog', item)"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                        </template>
                        <template v-slot:item.char_jobgrade="{ item }">
                            {{ item.char_jobgrade }}
                            <v-menu offset-y>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="item.char_jobgrade = 'Szef Policji'">
                                            <v-list-item-title>Szef Policji</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="item.char_jobgrade = 'Zastępca szefa Policji'">
                                            <v-list-item-title>Zastępca szefa Policji</v-list-item-title>
                                        </v-list-item>
                                        <v-divider></v-divider>
                                        <v-list-item @click="item.char_jobgrade = 'Porucznik st. 2'">
                                            <v-list-item-title>Porucznik st. 2</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="item.char_jobgrade = 'Porucznik st. 1'">
                                            <v-list-item-title>Porucznik st. 1</v-list-item-title>
                                        </v-list-item>
                                        <v-divider></v-divider>
                                        <v-list-item @click="item.char_jobgrade = 'Sierżant st. 3'">
                                            <v-list-item-title>Sierżant st. 3</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="item.char_jobgrade = 'Sierżant st. 2'">
                                            <v-list-item-title>Sierżant st. 2</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="item.char_jobgrade = 'Sierżant st. 1'">
                                            <v-list-item-title>Sierżant st. 1</v-list-item-title>
                                        </v-list-item>
                                        <v-divider></v-divider>
                                        <v-list-item @click="item.char_jobgrade = 'Oficer st. 4'">
                                            <v-list-item-title>Oficer st. 4</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="item.char_jobgrade = 'Oficer st. 3'">
                                            <v-list-item-title>Oficer st. 3</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="item.char_jobgrade = 'Oficer st. 2'">
                                            <v-list-item-title>Oficer st. 2</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="item.char_jobgrade = 'Oficer st. 1'">
                                            <v-list-item-title>Oficer st. 1</v-list-item-title>
                                        </v-list-item>
                                        <v-divider></v-divider>
                                        <v-list-item @click="item.char_jobgrade = 'Kadet'">
                                            <v-list-item-title>Kadet</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                        </template>
                        <template v-slot:item.police_training="{ item }">
                            <v-chip-group>
                                <v-chip v-for="trn in item.police_training" :key="trn" label close @click:close="item.police_training.splice(item.police_training.indexOf(trn), 1)">{{ trn }}</v-chip>
                                <v-divider vertical></v-divider>
                                <v-menu offset-y>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on"><v-icon>mdi-plus-circle-outline</v-icon></v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="addTraining('Negocjator', item)">
                                            <v-list-item-title>Negocjator</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="addTraining('S.W.A.T.', item)">
                                            <v-list-item-title>S.W.A.T.</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="addTraining('Pościgowe', item)">
                                            <v-list-item-title>Pościgowe</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="addTraining('Pilot', item)">
                                            <v-list-item-title>Pilot</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="addTraining('Dyspozytor', item)">
                                            <v-list-item-title>Dyspozytor</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="addTraining('Snajper', item)">
                                            <v-list-item-title>Snajper</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="addTraining('FTO', item)">
                                            <v-list-item-title>FTO</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-chip-group>
                        </template>
                        <template v-slot:item.actions="{ item }">
                            <v-btn small color="red lighten-2">Zwolnij</v-btn>
                            <!-- <v-btn small class="ml-3" color="orange lighten-2">Zawieś</v-btn> -->
                        </template>
                    </v-data-table>
                </v-tab-item>
                <v-tab-item>
                    <!-- Finanse -->
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-card>
                                <v-card-title>Budżet departamentu</v-card-title>
                                <v-card-text>
                                    <span class="display-1">${{ numberWithSpaces(departmentBudget) }}</span>
                                </v-card-text>
                            </v-card>
                            <v-row>
                                <v-col>
                                    <v-btn block color="blue lighten-2" @click="$root.$emit('showDepartmentAmountWithdrawDialog')">Wypłać</v-btn>
                                </v-col>
                                <v-col>
                                    <v-btn block color="blue lighten-2" @click="$root.$emit('showDepartmentAmountDepositDialog')">Wpłać</v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-btn block color="blue lighten-2" @click="$root.$emit('showDepartmentBudgetMoneyTransferDialog')">Przelew</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-card>
                                <v-card-title style="word-break: keep-all;">Skonfiskowane pieniądze pochodzące z nielegalnych źródeł</v-card-title>
                                <v-card-text>
                                    <span class="display-1">${{ numberWithSpaces(confiscatedMoney) }}</span>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-card>
                                <v-card-title>Nieopłacone mandaty i grzywny</v-card-title>
                                <v-card-text>
                                    <span class="display-1">Suma: {{ unpaidTickets }}</span>
                                    <br>
                                    <span class="display-1">Łączna kwota: ${{ numberWithSpaces(unpaidTicketsAmount) }}</span>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-tab-item>
            </v-tabs>
        </v-card>
    </div>
</template>

<script>
import DepartmentBudgetMoneyTransferDialog from "@/components/DepartmentManagement/DepartmentBudgetMoneyTransferDialog"
import DepartmentAmountWithdrawDialog from "@/components/DepartmentManagement/DepartmentAmountWithdrawDialog"
import DepartmentAmountDepositDialog from "@/components/DepartmentManagement/DepartmentAmountDepositDialog"
import DepartmentOfficerBadgeNumberChange from "@/components/DepartmentManagement/DepartmentOfficerBadgeNumberChange"

export default {
    components: {
       DepartmentBudgetMoneyTransferDialog,
       DepartmentAmountWithdrawDialog,
       DepartmentAmountDepositDialog,
       DepartmentOfficerBadgeNumberChange
    },

    data: () => ({
        officersTableHeaders: [
            { text: "ID", align: "start", sortable: false, width: 30, value: "char_id"},
            { text: "Nr odznaki", sortable: true, width: 130, value: "police_odznaka" },
            { text: "Imię i nazwisko", sortable: false, width: 200, value: "char_fullname" },
            { text: "Departament", sortable: true, width: 130, value: "police_department" },
            { text: "Stopień", sortable: true, width: 230, value: "char_jobgrade" },
            { text: "Szkolenia", sortable: false, value: "police_training" },
            { text: "Akcje", sortable: false, value: "actions" },
            /*{ text: "", sortable: false, value: "data-table-expand" }*/
        ],
        officers: [
            {
                char_id: 7,
                char_fullname: "Michael Monder",
                police_odznaka: 101,
                police_department: "LSPD",
                char_jobgrade: "Zastępca szefa Policji",
                police_training: ["Negocjator", "S.W.A.T.", "Pościgowe", "Dyspozytor", "Snajper", "FTO", "Pilot"],
                isSuspended: false,
            },
            {
                char_id: 11,
                char_fullname: "Richard Parker",
                police_odznaka: 100,
                police_department: "LSPD",
                char_jobgrade: "Szef Policji",
                police_training: ["Negocjator", "S.W.A.T.", "Pościgowe", "Dyspozytor", "Snajper", "FTO"],
                isSuspended: false,
            },
            {
                char_id: 96,
                char_fullname: "John Clock",
                police_odznaka: 159,
                police_department: "LSPD",
                char_jobgrade: "Officer st. II",
                police_training: [],
                isSuspended: false,
            }
        ],
        searchOfficers: "",
        departmentBudget: 3564891,
        confiscatedMoney: 569456,
        unpaidTickets: 46,
        unpaidTicketsAmount: 443674,
        stationsArr: [
            {label: "Mission Row Police", script: "mrpd", value: true},
            {label: "Vinewood Police", script: "vwpd", value: true},
            {label: "Sandy Shores Sheriff", script: "ssso", value: false},
            {label: "Paleto Bay Sheriff", script: "pbso", value: false},
            {label: "La Mesa Highway", script: "lmhp", value: false},
        ],
        stationSelect: {label: "Mission Row Police", script: "mrpd", value: true},
        stationDoorsSwitch: true
    }),

    methods: {
        addTraining(val, item) {
            var itemIndex = this.officers.indexOf(item)
            if (!this.officers[itemIndex].police_training.includes(val)) {
                this.officers[itemIndex].police_training.push(val)
            } else return
        },

        numberWithSpaces(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
    },

    watch: {
        officers: {
            handler: function(newValue) {
                console.log(newValue)
            },
            deep: true
        },

        stationSelect: {
            handler: function(newVal, oldVal) {
                this.stationDoorsSwitch = newVal.value
                //alert(newVal.value)
            }, 
            deep: true
        }
    }
}
</script>

<style scoped>

</style>