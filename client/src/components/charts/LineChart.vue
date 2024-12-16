<template>
    <Line
        :data="chartData"
        :options="chartOptions"
    />
</template>
<script lang="ts" setup>
import { ref } from 'vue';

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

const {
    chartData,
    chartOptions: customChartOptions,
} = defineProps<{
    chartData: {
        labels: string[];
        datasets: {
            label: string;
            backgroundColor?: string;
            borderColor?: string;
            data: number[];
            fill?: boolean;
        }[]
    },
    chartOptions?: {
        layout: {
            padding: number;
        };
    }
}>();

const defaultChartOptions = ref({
    layout: { padding: 10 },
    responsive: true,
    plugins: { legend: { display: false } },
});

const chartOptions = ref({
    ...defaultChartOptions.value,
    ...customChartOptions,
});
</script>
