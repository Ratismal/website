<template>
  <main>
    <section>
      <button class="button full" @click.prevent="addCounter">Add</button>
      <div class="counter-wrapper catflex wrap between">
        <div v-for="counter in counters" :key="counter.id" class="counter">
          <div class="catflex vertical">
            <label>Counter</label>
            <input v-model="counter.title" type="text" >
            <span>Count: {{ counter.count }} | {{ percent(counter) }}%</span>
            <div class="catflex full">
              <button class="button grow" @click.prevent="count(counter, 1)">+1</button>
              <button class="button grow" @click.prevent="count(counter, -1)">-1</button>
            </div>
          </div>
        </div>
      </div>
      <div ref="chart" class="chart" />
    </section>
  </main>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      counters: [],
      id: 0,
      chart: null
    };
  },
  computed: {
    total() {
      return this.counters.reduce((acu, cur) => {
        return cur.count + acu;
      }, 0);
    },
    format() {
      const counters = this.counters.map(a => ({
        name: a.title,
        value: a.count
      }));
      counters.sort((a, b) => a.value - b.value);
      return counters;
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);

    this.updateChart();
  },
  methods: {
    percent(counter) {
      if (this.total === 0) return 0;
      return ((counter.count / this.total) * 100).toFixed(2);
    },
    updateChart() {
      this.chart.setOption({
        title: {
          text: "Counter Comparison",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a}<br>{b} | {c} ({d}%)"
        },
        series: [
          {
            name: "Counters",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: this.format,
            roseType: "radius",
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: idx => Math.random() * 200,
            labelLine: {
              normal: {
                lineStyle: {
                  color: "rgba(255, 255, 255, 0.3)"
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: "#c23531",
                shadowBlur: 200,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    count(counter, amount) {
      counter.count += amount;

      this.updateChart();
    },
    addCounter() {
      this.counters.push({
        id: ++this.id,
        title: "New Counter",
        count: 0
      });

      this.updateChart();
    }
  }
};
</script>

<style lang="scss" scoped>
.counter {
  margin: 0.5rem;
  max-width: 200px;
}

.chart {
  width: 100%;
  height: 500px;
}
</style>
