<template>
    <nav>
        <v-toolbar src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
            <v-app-bar-nav-icon dark @click="drawer = !drawer"></v-app-bar-nav-icon>  
            <v-toolbar-title class="text-uppercase white--text" v-on:click="router.push('home')">
                <span class="font-weight-light">Los Santos</span>
                <span> Police Departament</span>
            </v-toolbar-title>
            <!-- <v-avatar class="indigo"><v-icon dark>mdi-account-circle</v-icon></v-avatar> -->
        </v-toolbar>
        <v-navigation-drawer app v-model="drawer" temporary width="auto" src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg" class="sidebar">
            <router-link to="/">
                <v-img
                    :src="require('@/assets/Logolspd2.png')"
                    height="250"
                    width="250"
                    class="ma-3"
                >
                </v-img>
            </router-link>
            <!-- @click="router.push('home')" -->
            <v-list nav dense>
                <v-list-item-group dark class="ma-4 nav" v-model="group" active-class="white--text align-center">

                    <!-- <v-list-title v-for="link in links" :key="link.text" router :to="link.route">
                        <v-list-title-action>
                            <v-icon dark>{{ link.icon }}</v-icon>
                        </v-list-title-action>
                        <v-list-title-content>
                            <v-list-item-title class="white--text">{{ link.text }}</v-list-item-title>
                        </v-list-title-content>
                    </v-list-title> -->

                    <v-list-item @click="showNewTicketDialog">
                        <v-list-item-title>Nowy wpis</v-list-item-title>
                    </v-list-item>
                    <!-- <v-list-item>
                        <v-list-item-title>Nowa odsiadka</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-icon dark left>mdi-clipboard-alert</v-icon>
                        <v-list-item-title>Nowe pouczenie</v-list-item-title>
                    </v-list-item> -->
                    <v-list-item  @click="showNewWarrantDialog">
                        <v-icon dark left>mdi-account-plus</v-icon>
                        <v-list-item-title>Dodaj poszukiwaną osobę</v-list-item-title>
                    </v-list-item>
                    <!-- <v-list-item>
                        <v-icon dark left>mdi-car</v-icon>
                        <v-list-item-title>Dodaj poszukiwany pojazd</v-list-item-title>
                    </v-list-item> -->
                    <v-list-item @click="showActiveWarrants">
                        <v-icon dark left>mdi-account-alert</v-icon>
                        <v-list-item-title>Wykaz poszukiwanych osób</v-list-item-title>
                    </v-list-item>
                    <!-- <v-list-item>
                        <v-icon dark left>mdi-car</v-icon>
                        <v-list-item-title>Wykaz poszukiwanych pojazdów</v-list-item-title>
                    </v-list-item> -->
                    <v-list-item @click="showNotepad">
                        <v-icon dark left>mdi-notebook</v-icon>
                        <v-list-item-title>Notatnik służbowy</v-list-item-title>
                    </v-list-item>
                    <!-- <v-list-item disabled>
                        <v-icon dark left>mdi-file-document</v-icon>
                        <v-list-item-title>Dokumenty</v-list-item-title>
                    </v-list-item> -->
                    <v-list-item to="/dispatch">
                        <v-icon dark left>mdi-phone-classic</v-icon>
                        <router-link to="/dispach"></router-link>
                        <v-list-item-title>Dyzpozytornia</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/towedVehicles">
                        <v-icon dark left>mdi-car-key</v-icon>
                        <router-link to="/towedVehicles"></router-link>
                        <v-list-item-title>Odholowane pojazdy</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/informacje">
                        <v-icon dark left>mdi-book-information-variant</v-icon>
                        <router-link to="/informacje"></router-link>
                        <v-list-item-title>Informacje</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/taryfikator">
                        <v-icon dark left>mdi-file-table</v-icon>
                        <router-link to="/taryfikator"></router-link>
                        <v-list-item-title>Taryfikator</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="isInCommandBureau" to="/management">
                        <v-icon dark left>mdi-account-group</v-icon>
                        <router-link to="/management"></router-link>
                        <v-list-item-title>Zarządzanie depatramentem</v-list-item-title>
                    </v-list-item>
                    <!-- <v-list-item disabled>
                        <v-icon dark left>mdi-map</v-icon>
                        <v-list-item-title>Mapa jednostek</v-list-item-title>
                    </v-list-item> -->
                    <v-list-item v-if="isInCommandBureau">
                        <v-icon dark left>mdi-database</v-icon>
                        <v-list-item-title>Baza NCIC osób</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="isInCommandBureau">
                        <v-icon dark left>mdi-database</v-icon>
                        <v-list-item-title>Baza NCIC pojazdów</v-list-item-title>
                    </v-list-item>
                    <v-list-item color="red" @click="closeMDT">
                        <v-icon dark left>mdi-close</v-icon>
                        <v-list-item-title>Zamknij MDT</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
import alt from "@/main.js"

export default {
    data() {
        return {
            drawer: false,
            isInCommandBureau: true,
            links: [
                {icon: "", text: "Nowy mandat", route: "/"},
                {icon: "", text: "Nowa odsiadka", route: "/"},
                {icon: "mdi-clipboard-alert", text: "Nowe pouczenie", route: "/"},
                {icon: "mdi-account-plus", text: "Dodaj poszukiwaną osobę", route: "/"},
                {icon: "mdi-car", text: "Dodaj poszukiwany pojazd", route: "/"},
                {icon: "mdi-account-alert", text: "Wykaz poszukiwanych osób", route: "/"},
                {icon: "mdi-car", text: "Wykaz poszukiwanych pojazdów", route: "/"},
                {icon: "mdi-notebook", text: "Notatnik służbowy", route: "/"},
                {icon: "mdi-file-document", text: "Dokumenty", route: "/"},
                {icon: "mdi-book-information-variant", text: "Informacje", route: "/informacje"},
                {icon: "mdi-account-group", text: "Zarządzanie depatramentem", route: "/"},
                {icon: "mdi-map", text: "Mapa jednostek", route: "/"},
                {icon: "mdi-database", text: "Baza NCIC osób", route: "/"},
                {icon: "mdi-database", text: "Baza NCIC pojazdów", route: "/"},
            ]
        }
    },

    methods: {
        showNewTicketDialog() {
            this.$root.$emit("showNewTicketDialogEvent")
            this.drawer = false
        },

        showNewWarrantDialog() {
            this.$root.$emit("showNewWarrantDialogEvent")
            this.drawer = false
        },
        
        closeMDT() {
            alt.emit("mdt:closeMDT");
            this.$root.$emit("hideMDT")
        },

        showNotepad() {
            this.$root.$emit("showNotepad")
            this.drawer = false
        },

        showActiveWarrants() {
            this.$root.$emit("showActiveWarrants")
            this.drawer = false
        }
    }
}
</script>

<style>
::-webkit-scrollbar {
    display: none;
}
</style>