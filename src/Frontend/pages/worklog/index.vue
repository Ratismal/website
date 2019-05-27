<template>
  <main>
    <section v-if="loading">
      <h1 class="center">Loading...</h1>
    </section>
    <section v-else>
      <h1>Worklog</h1>
      <div v-if="state === 'login'">
        <h2 class="center">Please log in</h2>
        <input v-model="login.password" class="full" type="text">
        <button class="button full" @click.prevent="checkLogin">Log In</button>
        <span class="center full red-text lighten-2-text">{{ login.error }}</span>
      </div>
      <div v-else-if="state === 'main'">
        <div class="calendar">
          <span class="month">{{ calendar.month }}</span>
          <div class="button-group">
            <button class="button full" @click.prevent="changeMonth(false)">Previous</button>
            <button class="button full" @click.prevent="changeMonth(true)">Next</button>
          </div>
          <div class="days">
            <div
              v-for="day in calendar.days"
              :key="day.formatted"
              :class="day.class"
              @click.prevent="selectDay(day)"
            >{{ day.day }}</div>
          </div>
        </div>
        <div v-if="dayView.date" class="entry">
          <button
            class="button full"
            @click.prevent="toggleEdit"
          >{{ dayView.editing ? 'Enter View Mode' : 'Enter Edit Mode' }}</button>
          <template v-if="dayView.editing">
            <div ref="entry" class="catflex vertical">
              <div v-for="(v, k) in dayView.data" :key="k" class="catflex vertical segment">
                <label>{{ k }}</label>
                <textarea
                  v-model="dayView.data[k]"
                  oninput="this.style.height = '';this.style.height = this.scrollHeight + 3 + 'px'"
                />
              </div>
            </div>
            <button
              class="button full"
              @click.prevent="setDay(dayView.date.formatted, dayView.data)"
            >Save</button>
            <span
              v-if="dayView.error"
              class="center full red-text lighten-2=text"
            >{{ dayView.error }}</span>
          </template>
          <template v-else>
            <div ref="entry" class="catflex vertical">
              <div v-for="(v, k) in dayView.data" :key="k" class="catflex vertical segment">
                <label>{{ k }}</label>
                <pre v-html="formatPreview(dayView.data[k])"/>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import moment from "moment";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      loading: true,
      state: "login",
      login: {
        password: "",
        error: ""
      },
      calendar: {
        date: moment(),
        month: "",
        days: []
      },
      dayView: {
        date: null,
        data: this.defaultDay(),
        error: "",
        editing: false
      },
      allLogs: {}
    };
  },
  async mounted() {
    if (process.client) {
      await this.changeState("startup");
    }
  },
  methods: {
    async changeState(state) {
      this.loading = true;

      this.state = state;
      switch (state) {
        case "startup": {
          if (localStorage.wlpass && (await this.check(localStorage.wlpass))) {
            return await this.changeState("main");
          } else {
            return await this.changeState("login");
          }
        }
        case "main": {
          const logs = await this.$axios.$get("/worklog/all", {
            headers: {
              wlpass: localStorage.wlpass
            }
          });

          for (const log of logs) {
            console.log(log);
            const key = moment(log.date).format("YYYY-MM-DD");
            this.allLogs[key] = true;
          }

          this.populateCalendar();
          break;
        }
      }

      this.loading = false;
    },
    async checkLogin() {
      if (await this.check(this.login.password)) {
        localStorage.setItem("wlpass", this.login.password);
        this.state = "main";
      } else {
        this.login.error = "Incorrect password, please try again.";
      }
    },
    async check(password) {
      try {
        await this.$axios.$get("/worklog/check", {
          headers: {
            wlpass: password
          }
        });
        return true;
      } catch (err) {
        return false;
      }
    },
    populateCalendar() {
      let day = this.calendar.date.clone();
      this.calendar.days = [];
      let month = day.month();
      this.calendar.month = day.format("MMMM, YYYY");
      let startDay = day.startOf("month");
      let endDay = startDay.clone().endOf("month");
      while (startDay.day() > 0) startDay.subtract(1, "day");

      do {
        let obj = {
          day: startDay.date(),
          month: startDay.month(),
          year: startDay.year(),
          formatted: startDay.format("YYYY-MM-DD"),
          class: {
            weekend: startDay.day() === 0 || startDay.day() === 6,
            otherMonth: startDay.month() !== month,
            day: true,
            selected: false
          },
          moment: startDay.clone()
        };
        obj.class.hasValue = !!this.allLogs[obj.formatted];
        this.calendar.days.push(obj);
        startDay.add(1, "day");
      } while (startDay.isSameOrBefore(endDay) || startDay.day() > 0);
    },
    changeMonth(forward) {
      this.calendar.date[forward ? "add" : "subtract"](1, "month");
      this.populateCalendar();
    },
    fixHeights() {
      setTimeout(() => {
        for (const el of this.$refs.entry.querySelectorAll("textarea")) {
          el.style.height = "";
          el.style.height = el.scrollHeight + 3 + "px";
        }
      }, 0);
    },
    async selectDay(day) {
      if (this.dayView.date) {
        this.dayView.date.class.selected = false;
        try {
          await this.setDay();
        } catch (err) { }
      }
      this.dayView.date = day;
      day.class.selected = true;

      this.dayView.data = await this.getDay(day.formatted);

      this.fixHeights();
    },

    defaultDay() {
      return {
        completed: "",
        todo: "",
        issues: "",
        blocking: "",
        extra: ""
      };
    },
    async getDay(day) {
      try {
        let res = await this.$axios.$get("/worklog/day/" + day, {
          headers: {
            wlpass: localStorage.wlpass
          }
        });
        return {
          completed: res.completed,
          todo: res.todo,
          issues: res.issues,
          blocking: res.blocking,
          extra: res.extra
        };
      } catch (err) {
        return this.defaultDay();
      }
    },
    async deleteDay() {
      this.dayView.error = "";
      try {
        await this.$axios.$delete(
          "/worklog/day/" + this.dayView.date.formatted,
          {
            headers: {
              wlpass: localStorage.wlpass
            }
          }
        );
        this.dayView.date.class.hasValue = false;
      } catch (err) {
        console.error(err, err.response);
        this.dayView.error = err.response.data.message;
      }
    },
    async setDay() {
      if (!this.dayView.data.completed
        && !this.dayView.data.todo
        && !this.dayView.data.issues
        && !this.dayView.data.blocking
        && !this.dayView.data.extra) {
        return await this.deleteDay();
      }
      this.dayView.error = "";
      try {
        await this.$axios.$post(
          "/worklog/day/" + this.dayView.date.formatted,
          this.dayView.data,
          {
            headers: {
              wlpass: localStorage.wlpass
            }
          }
        );
        this.dayView.date.class.hasValue = true;
      } catch (err) {
        console.error(err, err.response);
        this.dayView.error = err.response.data.message;
      }
    },

    toggleEdit() {
      this.dayView.editing = !this.dayView.editing;
      this.fixHeights();
    },
    formatPreview(text) {
      return text
        .replace(
          /\!([A-Z]+-\d+)/g,
          '<a href="https://granify.atlassian.net/browse/$1" class="icon-link"><img class="icon" src="/img/worklog/jira.png">$1</a>'
        )
        .replace(
          /!([A-z\-]+)\#(\d+)/g,
          '<a href="https://github.com/granify/$1/issues/$2" class="icon-link"><img class="icon" src="/img/worklog/github.png">$1#$2</a>'
        );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~/assets/scss/worklog.scss";
</style>