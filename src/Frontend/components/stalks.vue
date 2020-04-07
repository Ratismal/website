<template>
  <div>
    <section v-if="$store.state.user">
      <div>Shareable Link: </div>
      <div class="link"><a :href="link"><code>{{ link }}</code></a></div>
    </section>
    <section v-if="stalks && edit" class="edit">
      <div class="input-field">
        <label>Page Name</label>
        <input v-model="stalks.name">
      </div>

      <h2>Weeks</h2>

      <div class="week-selector">
        <div v-for="(week, i) of stalks.weeks" :key="i" class="week-select-wrapper">
          <button class="button" @click.prevent="selectedWeek = i">{{ (i + 1) + '. ' + week.meta.weekName }}</button>
          <button class="button danger" @click.prevent="removeWeek(i)">X</button>
        </div>
      </div>

      <button class="button full" @click.prevent="addWeek">Add Week</button>

      <h2>Selected Week</h2>
      <div class="catgrid">
        <div class="col s12">
          <div class="input-field">
            <label>Week Name</label>
            <input v-model="week.meta.weekName">
          </div>
        </div>
        <div class="col s12 m4 input-field">
          <label>Purchased For</label>
          <input v-model="week.meta.purchasedFor">
        </div>
        <div class="col s12 m4 input-field">
          <label>Purchased Amount (x100)</label>
          <input v-model="week.meta.purchased">
        </div>
        <div class="col s12 m4 input-field">
          <label>Sold For</label>
          <input v-model="week.meta.soldFor">
        </div>
      </div>
      <table class="timetable">
        <thead>
          <tr>
            <th/>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(time, key) of times" :key="key">
            <th>{{ key }}</th>
            <td v-for="i of time" :key="i">
              <input v-model.number="week.times[i]" type="number" step="1">
            </td>
          </tr>
        </tbody>
      </table>

      <button class="button full" @click.prevent="save">Save</button>
      <div>{{ message }}</div>
    </section>
    <section class="graph">
      <template v-if="stalks">
        <h1>{{ stalks.name }}</h1>
        <table class="timetable">
          <thead>
            <tr>
              <th>Week Name</th>
              <th>Purchased For</th>
              <th>Purchased (x100)</th>
              <th>Investment</th>
              <th>Sold For</th>
              <th>Sales Revenue</th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, i) of stalks.weeks" :key="i">
              <td class="center">{{ week.meta.weekName }}</td>
              <td class="center">{{ week.meta.purchasedFor }}</td>
              <td class="center">{{ week.meta.purchased }}</td>
              <td class="center">
                <template v-if="week.meta.purchased">
                  {{ week.meta.purchasedFor * week.meta.purchased * 100 }}
                </template>
              </td>
              <td class="center">{{ week.meta.soldFor }}</td>
              <td class="center">
                <template v-if="week.meta.soldFor">
                  {{ week.meta.soldFor * week.meta.purchased * 100 }}
                </template>
              </td>
              <td class="center">
                <template v-if="week.meta.soldFor">
                  {{ (week.meta.soldFor * week.meta.purchased * 100) - (week.meta.purchasedFor * week.meta.purchased * 100) }}
                </template>
              </td>
              <td class="center">
                <button class="button full" @click.prevent="selectedWeek = i">Select</button>
              </td>
            </tr>
          </tbody>
        </table>
        <h2>{{ week.meta.weekName }}</h2>
        <table class="timetable">
          <thead>
            <tr>
              <th/>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(time, key) of times" :key="key">
              <th>{{ key }}</th>
              <td v-for="i of time" :key="i" class="center">
                {{ week.times[i] }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <div ref="chart" class="chart" />
    </section>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stalks: null,
      selectedWeek: 0,
      times: {
        Morning: [0, 2, 4, 6, 8, 10],
        Afternoon: [1, 3, 5, 7, 9, 11]
      },
      message: '',
      chart: null
    };
  },
  computed: {
    week() {
      if (!this.stalks) return {};
      return this.stalks.weeks[this.selectedWeek];
    },
    link() {
      if (this.$store.state.user) {
        return 'https://stupidcat.me/stalks/' + this.$store.state.user.id;
      }
    }
  },
  watch: {
    week: {
      deep: true,
      handler() {
        if (this.chart)
          this.updateChart();
      }
    }
  },
  async fetch() {
    this.getStalks();
  },
  mounted() {
    this.getStalks();
    console.log(this.stalks);

    if (process.client) {
      this.initChart();
    }
  },
  methods: {
    async getStalks() {
      console.log('Fetching stalks');
      const res = await this.$axios.$get('/stalk/' + this.id);
      const stalks = res.data;
      if (stalks && stalks.version === 1) {
        this.stalks = stalks;
      } else {
        this.setDefault();
      }
      this.selectedWeek = this.stalks.weeks.length - 1;
      this.updateChart();
    },
    setDefault() {
      this.stalks = {
        version: 1,
        name: '',
        weeks: [this.defaultWeek()]
      };
    },
    defaultWeek(name) {
      return {
          meta: {
            weekName: name || 'Untitled Week',
            purchasedFor: null,
            purchased: null,
            soldFor: null
          },
          times: [null, null, null, null, null, null, null, null, null, null, null, null]
        };
    },
    async save() {
      await this.$axios.$post('/stalk', { data: this.stalks });
      this.message = 'Configuration has been saved!';
      setTimeout(() => this.message = '', 5000);
    },

    addWeek() {
      this.stalks.weeks.push(this.defaultWeek());
    },
    removeWeek(i) {
      if (this.stalks.weeks.length > 1) {
        this.stalks.weeks.splice(i, 1);
        if (this.selectedWeek >= this.stalks.weeks.length)
          this.selectedWeek = this.stalks.weeks.length - 1;
      }
    },

    initChart() {
      this.chart = echarts.init(this.$refs.chart);

      this.updateChart();
    },
    updateChart() {
      if (!this.stalks) return;
      const series = this.stalks.weeks.map(week => {
        return {
          name: week.meta.weekName,
          data: week.times,
          type: 'line',
          symbolSize: 12
        };
      });
      console.log('Updating chart', series);
      this.chart.setOption({
        legend: {
          type: 'plain',
          textStyle: {
            color: 'white'
          }
        },
        xAxis: {
          type: 'category',
          data: [
            'Mon. Morning',
            'Mon. Afternoon',
            'Tues. Morning',
            'Tues. Afternoon',
            'Wed. Morning',
            'Wed. Afternoon',
            'Thurs. Morning',
            'Thurs. Afternoon',
            'Fri. Morning',
            'Fri. Afternoon',
            'Sat. Morning',
            'Sat. Evening'
          ],
          axisLabel: {
            color: 'white',
            rotate: 25
          },
          axisLine: {
            lineStyle: {
              color: 'white'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'Price',
          nameTextStyle: {
            color: 'white'
          },
          axisLabel: {
            color: 'white'
          },
          axisLine: {
            lineStyle: {
              color: 'white'
            }
          }
        },
        title: {
          text: "Stalk Market",
          left: "center",
          top: 20,
          textStyle: {
            color: "#ccc"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a}<br>{b} | {c} Bells"
        },
        series
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.timetable {
  width: 100%;

  td {
    height: 50px;
    &.center {
      text-align: center;
    }
    input {
      width: 100px;
      display: block;
      margin: 0 auto;
    }
  }
}

.chart {
  width: 100%;
  height: 500px;
}

.week-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 23px;
}

.week-select-wrapper {
  display: flex !important;
  width: 100%;

  :first-child {
    flex: 1 1 auto;
  }

  button {
    margin: 0;
  }
}

.link {
  margin: 10px 0;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
}
</style>