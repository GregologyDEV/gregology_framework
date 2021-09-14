<template>
    <v-row>
        <v-dialog v-model="dialog" persistent max-width="1200">
            <v-card>
                <v-card-title>Wyniki wyszukiwania w bazie NCIC obywateli
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-data-table class="ml-6 mr-6" :headers="tableHeaders" :items="citizens" items-per-page="5" :page.sync="wpisyPagination" @page-count="page = $event" hide-default-footer :search="search" @click:row="clickHandle">
                </v-data-table>
                <div class="text-center pt-2">
                    <v-pagination v-model="paginations" :length="page"></v-pagination>
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
        citizens: [/*
            {
                id: 8,
                char_fullname: "Michael Monder",
                char_sex: "male",
                char_birthdate: "1989-01-15",
            },
            {
                id: 46,
                char_fullname: "Michael Hoffman",
                char_sex: "male",
                char_birthdate: "1991-06-12",
            }*/
        ],
        tableHeaders: [
            { text: "ID", align: "start", sortable: false, value: "id"},
            { text: "Imię i nazwisko", sortable: false, value: "char_fullname"},
            { text: "Płeć", sortable: false, value: "char_sex"},
            { text: "Data urodzenia", sortable: false, value: "char_birthdate"},
        ],
        page: 0,
        paginations: 1,
    }),

    methods: {
        clickHandle(value) {
            alt.emit("mdt:requestCitizenDatabaseByCitizenUID", value.id);
            this.dialog = false;
        },
        
    },

    mounted() {
        this.$root.$on("showCitizenSearchResultDialog", (data) => {
            this.dialog = true
        }),
        this.$root.$on("closeCitizenSearchResultDialog", () => {
            //this.closeDialog()
            this.dialog = false
        })
    },

    beforeMount() {
        if ("alt" in window) {
            window.alt.on("mdt:citizensArrayCallback", (result) => {
                this.dialog = true
                this.citizens = result
            });
        }
    },

    watch: {
        //
    },

    created: function() {
        //
    },
}
</script>