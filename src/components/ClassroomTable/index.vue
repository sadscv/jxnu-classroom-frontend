<template>
  <div ref="wrapper" :class="{'schedule-table-wrapper': true, 'schedule-table-wrapper-capturing': capturing}">
<!--    How to remove space between 2 chinese characters? Use ConfigProvider to set autoInsertSpaceInButton as false.-->
    <a-config-provider :get-popup-container="() => $refs.setting" :auto-insert-space-in-button="false">
      <table class="schedule-table">
        <thead>
<!--        <tr>-->
<!--          <th class="header-capacity">星期</th>-->
<!--          <th class="header-week" v-for="week in ['11', '12','13','14','15','16','17','21','22','23','24','25','26','27','31','32','33','34','35','36','37', '41','42','43','44','45','46','47','51','52','53','54','55','56','57','61','62','63','64','65','66','67','71','72','73','74','75','76','77']" :key="week">{{ week }}</th>-->
<!--        </tr>-->
        <tr>
          <td class="header-setting" >
          </td>
          <th class="header-capacity">星期</th>
          <th class="header-week" colspan="7" v-for="week in ['一', '二','三','四','五','六','日']" :key="week">星期{{ week }}</th>
        </tr>
        <tr>
          <td class="header-setting" rowspan="2">
            <div ref="setting" :class="{ setting: true, 'setting-show': venueMode }">
              <a-dropdown v-if="!venueMode">
                <a-button shape="circle" size="small" icon="setting" />
                <a-menu slot="overlay">
                  <a-menu-divider />
                </a-menu>
              </a-dropdown>
              <a-button v-else type="danger" size="small" shape="round" @click="venueMode = false">复原</a-button>
            </div>
            <div v-show="capturing" class="brand">
              <img src="../../assets/logo.png" alt="Logo" />
            </div>
          </td>
          <th class="header-capacity" >定员</th>
          <th class="header-week" v-for="week in ['12', '3','4','5','67','89','晚','12', '3','4','5','67','89','晚','12', '3','4','5','67','89','晚','12', '3','4','5','67','89','晚','12', '3','4','5','67','89','晚','12', '3','4','5','67','89','晚','12', '3','4','5','67','89','晚']" :key="week">{{ week }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, index) in rows" :key="index">
<!--          <th>{{ ['第12节', '第3节', '第4节', '第5节', '第67节', '第89节', '晚上'][index] }}</th>-->
          <th> {{ index }}</th>
          <td> {{ row['capacity']}} </td>
          <template v-for="(value, key) in row['usage']">
            <td :key="key" v-if="!key.includes('8')">
              <ClassCard :course="value" v-if="value != null && !value.qr" :venue="venueMode"
                         @click.native="handleClassCardClick()" />
            </td>
          </template>
        </tr>
        </tbody>
      </table>

    </a-config-provider>
  </div>
</template>

<script>
  import ClassCard from './ClassCard';
  import {ClassroomTableMixin} from '../../mixins/ClassroomTable';

  export default {
    name: 'ClassroomTable',
    components: {
      ClassCard,
    },
    mixins: [ClassroomTableMixin],
  };
</script>

<style scoped>
  /*noinspection CssUnusedSymbol*/
  .schedule-table-wrapper {
    padding: 8px;
  }

  .schedule-table {
    margin: 0;
    padding: 0;
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
    text-align: center;
    font-size: 13px;
  }

  .schedule-table thead{
    position: sticky;
    top: 0;
    z-index: 10;
    background: white;
    opacity: 1;
  }

  .schedule-table thead tr {
    height: 32px;
  }

  .schedule-table tbody tr {
    height: 10px;
  }

  .schedule-table tbody th {
    width: 130px;
    text-overflow: clip;
    overflow: hidden;
  }

  .schedule-table tbody tr:nth-child(odd) {
    background: rgba(0, 0, 0, 0.025);
  }

  .schedule-table th {
    user-select: none;
  }

  .schedule-table td {
    position: relative;
  }

  .class-period p {
    margin: 0;
  }

  .class-period p:first-child {
    padding-right: 1em;
    color: rgba(0, 0, 0, 0.65);
  }

  .class-period p:last-child {
    padding-left: 1em;
    color: rgba(0, 0, 0, 0.35);
  }

  .header-setting {
    position: relative;
    width: 60px;
  }

  .header-capacity {
    width: 40px;
  }

  .header-week {
    width: 40%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-width: 1px 0 1px 0 ;
    /*padding: 4px 3px 3px;*/
    /*transition: all 0.2s;*/
    /*border-radius: 2px;*/
    /*position: absolute;*/
    /*user-select: none;*/
    line-height: 1.35;
    /*text-align: left;*/
    overflow: hidden;
    /*cursor: pointer;*/
    /*bottom: 1px;*/
    /*right: 1px;*/
    /*left: 1px;*/
    /*top: 1px;*/

  }

  /*noinspection CssUnusedSymbol*/
  .setting {
    transition: all 0.2s;
    white-space: nowrap;
    position: absolute;
    text-align: left;
    opacity: 0;
    left: 2px;
    top: 2px;
  }

  /*noinspection CssUnusedSymbol*/
  .setting-show {
    opacity: 1;
  }

  /*noinspection CssUnusedSymbol*/
  .schedule-table-wrapper:hover .setting {
    opacity: 1;
  }

  /*noinspection CssUnusedSymbol*/
  .schedule-table-wrapper-capturing {
    position: absolute;
    overflow: visible;
    width: 640px;
  }

  /*noinspection CssUnusedSymbol*/
  .schedule-table-wrapper-capturing .setting {
    display: none;
  }

  .brand {
    color: rgba(0, 0, 0, 0.45);
    white-space: nowrap;
    position: absolute;
    line-height: 18px;
    font-size: 12px;
    display: block;
    width: 100%;
    top: 3px;
    left: 0;
  }

  .brand img {
    height: 18px;
    width: 18px;
  }
</style>
