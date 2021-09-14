<template>
    <v-row>
        <v-dialog v-model="dialog" max-width="1000">
            <v-card>
                <v-card-title>Notatnik służbowy
                    <v-spacer></v-spacer>
                    <v-btn icon @click="closeNotepad"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-textarea v-model="notepadTextarea" outlined label="Notatki"></v-textarea>
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
    }),

    methods: {
        closeNotepad() {
            alt.emit("mdt:saveNotepad", this.notepadTextarea);
            this.dialog = false
        }
    },

    mounted() {
        this.$root.$on("showNotepad", () => {
            this.dialog = true
        }),

        this.$root.$on("loadNotepad", (data) => {
            this.notepadTextarea = data
        })
        
    },
}
</script>