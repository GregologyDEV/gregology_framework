<template>
    <div class="taryfikator">
        <v-data-table v-model="table" :headers="tableHeaders" :items="wykroczenia" items-per-page="9999" hide-default-footer item-key="label">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Taryfikator przewinień</v-toolbar-title>
                </v-toolbar>
            </template>
        </v-data-table>
    </div>
</template>
<script>
import wykroczeniaArray from "@/wykroczenia.js"

export default {
    data: () => ({
        tableHeaders: [
            { text: "Czyn zabroniony", align: "start", sortable: false, value: "label" },
            { text: "Grzywna", sortable: false, value: "grzywna" },
            { text: "Areszt", sortable: false, value: "areszt" },
            { text: "Uwagi", sortable: false, value: "uwagi" },
        ],
        wykroczenia: wykroczeniaArray,
    }),
}
</script>

<style scoped>

</style>