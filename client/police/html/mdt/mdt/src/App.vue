<template>
  <v-app class="grey lighten-4 app" v-if="mdt">
    <Navbar />
    <v-content>
      <router-view />
      <TicketDialog />
      <NewWarrantDialog />
      <CitizenData />
      <CitizenSearchResultDialog />
      <Notepad />
      <ActiveWarrants />
      <VehicleData />
    </v-content>
    <template>
      <v-footer padless> 
        <v-row justify="center" no-gutters>
          <v-col class="subtitle-2 primary lighten-2 py-3 text-center white--text" cols="12">
            {{ new Date().getFullYear() }} — <strong>Powered by Gregology</strong>
          </v-col>
        </v-row>
      </v-footer>
    </template>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar"
import TicketDialog from "@/components/TicketDialog"
import NewWarrantDialog from "@/components/NewWarrantDialog"
import CitizenData from "@/components/CitizenData"
import CitizenSearchResultDialog from "@/components/CitizenSearchResultDialog"
import Notepad from "@/components/Notepad"
import ActiveWarrants from "@/components/ActiveWarrants"
import VehicleData from "@/components/VehicleData"


export default {
  name: 'App',
  components: {
    Navbar,
    TicketDialog,
    NewWarrantDialog,
    CitizenData,
    Notepad,
    ActiveWarrants,
    VehicleData,
    CitizenSearchResultDialog,
  },

  data: () => ({
    mdt: true,
  }),

  mounted() {
      this.$root.$on("showMDT", (data) => {
          this.dialog = true
      }),
      this.$root.$on("hideMDT", () => {
          this.mdt = false
      })
  },

  beforeMount() {
      if ("alt" in window) {
          window.alt.on("mdt:showMDT", (result) => {
              this.mdt = true
          });
      }
  },
};
</script>


<style>
.app{
  overflow: hidden;
  overflow-y: hidden;
}

::-webkit-scrollbar {
  display: none;
}
</style>