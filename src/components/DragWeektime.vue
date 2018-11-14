<template>
  <v-container 
    fluid 
    class="pa-0">
    <v-layout 
      row 
      wrap>
      <v-autocomplete
        :items="labels.zone"
        v-model="modeZone"
        class="py-0"
        item-text="name"
        item-value="val"
        hide-details
        @change="changeMode"
      />
      <v-btn 
        small 
        icon 
        @click.stop="clearSelect"
      ><v-icon small>refresh</v-icon>
      </v-btn>
      <v-tooltip bottom>
        <v-btn 
          slot="activator" 
          small 
          icon
        ><v-icon 
          small 
          color="grey">help</v-icon></v-btn
          >
        <span>{{ labels.timerange_help }}</span>
      </v-tooltip>
    </v-layout>
    <v-layout 
      row 
      wrap 
      class="mt-2">
      <div class="wt-wrapper">
        <div 
          class="wt-body" 
          @mouseleave="leave();">
          <ul class="wt-week">
            <li 
              v-for="item in labels.week" 
              :key="'W' + item.value">
              {{ item.name }}
            </li>
          </ul>
          <div class="wt-time">
            <ul class="wt-time-list">
              <li 
                v-for="item in times" 
                :key="'T' + item.value">
                {{ item.name }}
              </li>
              <li>00:00</li>
            </ul>
            <ul class="wt-cell-list">
              <li
                v-for="row in times"
                :key="'R' + row.value"
                class="wt-cell-row"
              >
                <span
                  v-for="col in labels.week"
                  :class="{ active: hasSelect(row.value, col.value) }"
                  :key="'C' + col.value"
                  :row="row.value"
                  :col="col.value"
                  class="wt-cell-col"
                  @mouseenter="cellEnter(row.value, col.value);"
                  @mouseleave="cellLeave(row.value, col.value);"
                  @click="cellClick(row.value, col.value);"
                  @mousedown="cellDown(row.value, col.value);"
                  @mouseup="cellUp(row.value, col.value);"
                />
              </li>
            </ul>
          </div>
          <div
            :style="{ left: left + 'px', display: display }"
            class="ver-line"
          />
          <div
            :style="{ top: top + 'px', display: display }"
            class="hor-line"
          />
        </div>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import langZh from './locale/zh-CN';
import langEn from './locale/en-US';

export default {
  name: 'v-drag-weektime',
  props: {
    lang: {
      default: 'en',
      type: String,
    },
    period: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      week: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      left: 0,
      top: 0,
      display: 'none',
      selected: this.setDefault(this.period),
      modeZone: this.period.timeZone || 0,
      i18n: {},
    };
  },
  computed: {
    labels() {
      const langObj = this.lang === 'zh' ? langZh : langEn;
      return {
        ...langObj,
      };
    },
    times() {
      const times = [];
      for (let i = 0; i < 24; i++) {
        times.push({
          value: i,
          name: `${i >= 10 ? i : `0${i}`}:00`,
        });
      }
      return times;
    },
  },
  watch: {
    selected(newValue, oldValue) {
      this.onChange();
    },
  },
  methods: {
    setDefault(obj) {
      const ret = [];
      const weekArry = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      for (let i = 0; i < weekArry.length; i++) {
        const tp = obj[weekArry[i]] ? obj[weekArry[i]] : [];
        tp.forEach(e => {
          const time = Number(e.split(':')[0]);
          ret.push(`${i},${time}`);
        });
      }
      return ret;
    },
    leave() {
      this.mode = 0;
    },
    clearSelect() {
      this.selected = [];
    },
    hasSelect(row, col) {
      return !!(this.selected && this.selected.indexOf(`${col},${row}`) !== -1);
    },
    selectdata(row, col) {
      const hasdata = this.selected.indexOf(`${col},${row}`);
      if (hasdata !== -1) {
        if (this.mode === 0) {
          this.selected = this.selected.filter(
            item => item !== `${col},${row}`
          );
        }
      } else {
        this.selected.push(`${col},${row}`);
      }
    },
    cellEnter(row, col) {
      const ele = document.querySelector(`span[row='${row}'][col='${col}']`);
      if (ele) {
        this.left = ele.offsetLeft + ele.offsetWidth / 2;
        this.top = ele.offsetTop + ele.offsetHeight / 2;
        this.display = 'block';
      }
      if (this.mode === 1) {
        this.selectdata(row, col);
      }
    },
    cellLeave(row, col) {
      this.display = 'none';
    },
    cellClick(row, col) {
      this.selectdata(row, col);
    },
    cellDown(row, col) {
      this.mode = 1;
    },
    cellUp(row, col) {
      this.mode = 0;
    },
    changeMode(val) {
      this.onChange();
    },
    onChange() {
      const retObj = {
        timeZone: this.modeZone,
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: [],
      };
      for (let i = 0; i < this.selected.length; i++) {
        const item = this.selected[i].split(',');
        const key = this.week[Number(item[0])];
        retObj[key].push(Number(item[1]));
      }
      Object.keys(retObj).forEach(i => {
        if (i !== 'timeZone') {
          retObj[i] = retObj[i]
            .sort((a, b) => a > b)
            .map(item => `${item < 10 ? `0${item}` : item}:00`);
        }
      });
      this.$emit('onChange', retObj);
    },
  },
};
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}

.wt-wrapper {
  width: 100%;
  font-size: 14px;
  padding: 6px 0 6px 0;
  border: 1px solid #ddd;
  box-sizing: border-box;
  user-select: none;

  .wt-body {
    position: relative;

    .wt-week {
      box-sizing: border-box;
      display: flex;
      padding-left: 56px;
      justify-content: space-around;

      li {
        box-sizing: border-box;
        float: left;
        padding: 4px 4px;
        width: 14.28%;
        text-align: center;
      }
    }
    .wt-time {
      display: flex;
      .wt-time-list {
        width: 56px;
        margin-top: -10px;
        padding-left: 0;
        li {
          padding: 2px 4px;
          height: 20px;
          box-sizing: border-box;
          text-align: center;
          line-height: 20px;
        }
      }
      .wt-cell-list {
        flex-grow: 1;
        border-top: 1px solid #ddd;
        padding-left: 0;
        .wt-cell-row {
          box-sizing: border-box;
          height: 20px;
          line-height: 20px;
          border-bottom: 1px solid #e0e0e0;
          border-left: 1px solid #ddd;
          span:last-child {
            border-right: 0;
          }
          .wt-cell-col {
            box-sizing: border-box;
            display: inline-block;
            height: 100%;
            width: 14.28%;
            position: relative;
            border-right: 1px solid #e0e0e0;
            transition: all 0.2s;
            cursor: crosshair;
            &:hover {
              background: #6db6e0;
            }
            &.active {
              background: #178acc;
            }
          }
        }
      }
    }
    .ver-line,
    .hor-line {
      position: absolute;
      left: 0;
      transition: all 0.3s;
      overflow: hidden;
      pointer-events: none;
    }

    .ver-line {
      top: 0;
      width: 0;
      height: 100%;
      border-left: 1px dashed #178acc;
      z-index: 100;
    }

    .hor-line {
      top: 0;
      width: 100%;
      height: 0;
      border-top: 1px dashed #178acc;
      z-index: 101;
    }
  }
}
</style>
