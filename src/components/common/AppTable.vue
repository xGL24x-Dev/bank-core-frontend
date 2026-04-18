<template>
    <div class="app-table-wrapper">
        <table class="app-table">
            <thead>
                <tr>
                    <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="rows.length === 0">
                    <td :colspan="columns.length" class="app-table__empty">{{ emptyText }}</td>
                </tr>
                <tr v-for="(row, i) in rows" :key="i" class="app-table__row">
                    <td v-for="col in columns" :key="col.key">
                        <slot :name="col.key" :row="row" :value="row[col.key]">
                            {{ row[col.key] }}
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    columns: { type: Array, default: () => [] },
    rows: { type: Array, default: () => [] },
    emptyText: { type: String, default: 'No hay datos disponibles' },
})
</script>

<style scoped>
.app-table-wrapper {
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid #e9ecef;
}

.app-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Inter', sans-serif;
}

.app-table thead tr {
    background: #f8faff;
}

.app-table th {
    padding: 0.85rem 1.25rem;
    text-align: left;
    font-size: 0.78rem;
    font-weight: 700;
    color: #6C757D;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e9ecef;
}

.app-table td {
    padding: 0.9rem 1.25rem;
    font-size: 0.875rem;
    color: #374151;
    border-bottom: 1px solid #f0f0f0;
}

.app-table__row:hover td {
    background: #f8faff;
}

.app-table__row:last-child td {
    border-bottom: none;
}

.app-table__empty {
    text-align: center;
    color: #6C757D;
    padding: 2.5rem;
    font-size: 0.9rem;
}
</style>