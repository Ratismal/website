<template>
  <main>
    <section v-if="edit">
      <input v-model="data.name">
      <input v-model.number="data.startCount" type="number">
      <input v-model="data.countName">

      <button @click.prevent="edit = false; save()">Save</button>
    </section>
    <section v-else>
      <h1>{{ data.name }}</h1>
      <div class="segment-wrapper">
        <div class="segment">
          <div>Name</div>
          <div>Time</div>
          <div>{{ data.countName || 'Count' }}</div>
        </div>
        <div v-for="(segment, i) of data.segments" :key="i" class="segment">
          <template v-if="segment.edit">
            <div class="name">
              <input v-model="segment.name">
            </div>
            <div class="">
              <input v-model.number="segment.time" type="number">
            </div>
            <div class="count">
              <input v-model.number="segment.count" type="number">
            </div>
            <div class="btn-bar">
              <button class="button" @click.prevent="saveSegment(segment)">Save</button>
              <button class="button danger" @click.prevent="deleteSegment(segment)">Delete</button>
              <button class="button" @click.prevent="segment.finished = !segment.finished">{{ segment.finished ? 'F' : 'U' }}</button>
            </div>
          </template>
          <template v-else>
            <div class="name">{{ segment.name }}</div>
            <div class="time">
              <template v-if="segment.time !== 0">
                {{ segment.displayTime }}
              </template>
            </div>
            <div class="count">{{ calculateCountDisplay(segment) }}</div>
            <div class="btn-bar">
              <button class="button" @click.prevent="editSegment(segment)">Edit</button>
            </div>
          </template>
        </div>
        <div class="segment">
          <div class="name">Total</div>
          <div class="time">{{ totalTimeDisplay }}</div>
          <div class="count">{{ totalCount }}</div>
        </div>
        <button class="button full" @click.prevent="addSegment">Add Segment</button>
      </div>

      <button v-if="!started" class="button full" @click.prevent="start">Start</button>
      <button v-if="started" class="button full" @click.prevent="stop">Stop</button>
      <button v-if="started" class="button full" @click.prevent="next">Next</button>

      <button @click.prevent="edit = true">Edit</button>
    </section>
  </main>
</template>

<script>
export default {
  components: {  },
  data() {
    return {
      started: false,
      interval: null,
      edit: false,
      data: {
        name: 'My cool timer!',
        segments: [],
        startCount: 0,
        countName: 'Count'
      },
      totalTimeDisplay: ''
    };
  },
  computed: {
    currentSegment() {
      for (const segment of this.data.segments) {
        if (segment.finished) continue;
        return segment;
      }
    },
    totalCount() {
      const last = this.data.segments[this.data.segments.length - 1];
      if (last) {
        return last.count - this.data.startCount;
      } else {
        return 0;
      }
    }
  },
  destroyed() {
    clearInterval(this.interval);
  },
  mounted() {
    const raw = localStorage.getItem('sr_timer');
    console.log(raw);
    if (raw) {
      this.data = JSON.parse(raw);
    }

    this.updateDisplay();
  },
  methods: {
    formatTime(segment) {
      let time = segment.time;
      if (segment.startTime) {
        time += Date.now() - segment.startTime;
      }

      let ms = Math.floor((time % 1000));
      let rs = Math.floor(time / 1000);

      let s = rs % 60;
      let rm = Math.floor(rs / 60);

      let m = rm % 60;
      let h = Math.floor(rm / 60);

      return this.padTime`${h}:${m}:${s}.${ms}`;
    },
    padTime(str, h, m, s, ms) {
      let [hh, mm, ss] = [h, m, s].map(n => n.toString().padStart(2, '0'));
      ms = ms.toString().padEnd(3, '0');
      return str[0] + hh + str[1] + mm + str[2] + ss + str[3] + ms + str[4];
    },
    addSegment() {
      this.data.segments.push({
        name: 'Segment #' + (this.data.segments.length + 1),
        time: 0,
        startTime: null,
        count: 0,
        finished: false,
        displayTime: 'N/A',
        edit: false
      });

      this.save();
    },
    start() {
      const current = this.currentSegment;
      if (current) {
        this.started = true;
        this.startSegment(current);

        this.interval = setInterval(this.updateDisplay.bind(this), 10);
      }

      this.save();
    },
    updateDisplay(segment) {
      if (!segment) segment = this.currentSegment;
      if (segment) {
        segment.displayTime = this.formatTime(segment);
      }

      const totalTime = this.data.segments.reduce((acu, cur) => {
        let t = cur.time;
        if (cur.startTime) {
          t += Date.now() - cur.startTime;
        }
        return acu + t;
      }, 0);
      this.totalTimeDisplay = this.formatTime({time: totalTime});
    },
    stop() {
      this.started = false;
      const current = this.currentSegment;
      if (current) {
        this.updateSegment(current);

        clearInterval(this.interval);
        this.interval = null;
      }

      this.save();
    },
    next() {
      const current = this.currentSegment;
      if (current) {
        this.updateSegment(current);
        current.finished = true;

        const newCurrent = this.currentSegment;
        if (newCurrent) {
          this.startSegment(newCurrent);
        } else {
          this.stop();
        }
      }

      this.save();
    },
    startSegment(segment) {
      segment.startTime = Date.now();
    },
    updateSegment(segment) {
      if (segment.startTime) {
        segment.time += Date.now() - segment.startTime;
        segment.startTime = null;
      }
    },
    editSegment(segment) {
      segment.edit = true;
    },
    saveSegment(segment) {
      segment.edit = false;
      this.updateDisplay(segment);

      const index = this.data.segments.indexOf(segment);
      if (index !== -1 && segment.finished) {
        for (let i = 0; i < this.data.segments.length; i++) {
          const s = this.data.segments[i];
          if (i < index) {
            s.finished = true;
          } else if (i > index) {
            s.finished = false;
            s.time = 0;
          }
        }
      }
      this.save();
    },
    deleteSegment(segment) {
      this.data.segments.splice(this.data.segments.indexOf(segment), 1);
      this.save();
    },
    save() {
      let lastCount = this.data.startCount;
      for (const segment of this.data.segments) {
        if (segment.count < lastCount) {
          segment.count = lastCount;
        } else {
          lastCount = segment.count;
        }
      }

      localStorage.setItem('sr_timer', JSON.stringify(this.data));
    },
    calculateCountDisplay(segment) {
      const index = this.data.segments.indexOf(segment);

      let prevCount = 0;
      if (index <= -1) {
        return 0;
      } else if (index === 0) {
        prevCount = this.data.startCount;
      } else {
        prevCount = this.data.segments[index - 1].count;
      }

      return segment.count - prevCount;
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  border-radius: 5px;
}

.segment-wrapper {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  button {
    margin: 0;
  }



  .segment {
    height: 4rem;
    width: 10;
    display: grid;
    align-items: center;;

    /* name, time, count */
    grid-template-columns: 2fr 2fr 1fr 1fr;

    div {
      min-width: 0;
      min-height: 0;
      margin: 0.5rem;

      input {
        width: 100%;
        box-sizing: border-box;
      }
    }

    .time {
      font-family: 'Ubuntu Mono';
      font-size: 1.2em;
    }

    .btn-bar {
      display: flex;
      .button {
        flex: 1 0 50%;
      }
    }
  }
}
</style>