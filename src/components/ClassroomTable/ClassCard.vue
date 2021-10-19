<template>
  <div :class="_class" :style="style"
       @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <div class="course-name"><strong>{{course.courseName }}</strong></div>
      <div v-if="Object.keys(infos).length > 1">
          <div v-for="(value, key) in infos" :key="key">
              <div class="course-name" v-if="key !== course.courseName">
                  <br>
                  <strong> {{key }} </strong>
              </div>
          </div>
      </div>
      <div v-else>
          <!--<span>test</span>-->
          <div v-if="course.isPreview === false && Object.keys(infos).length > 0">
              <div v-if="!venue">
                  <span class="teacher-name-venue" v-for="(value, key) in infos"
                        :key="key">
                <div v-for="teacherName in value" :key="teacherName">
                    {{ '| ' + teacherName}}
                </div>
              </span>
              </div>
              <div class="venue" v-else>
                  <span class="venue-at">@</span>{{
                  $store.getters.extra(`${course.courseId}-${course.teacherId}`).venue
                  }}
              </div>
          </div>
          <div v-else-if="course.isPreview === true">
              <div class="teacher-name-venue" v-if="!venue">
                  {{course.teacherName}}
              </div>
          </div>
      </div>

      <!--<div v-if="Object.keys(course.conflicted).length === 0">-->


  </div>
</template>

<script>
    import {ClassCardMixin} from '../../mixins/ClassroomTable';

    export default {
    name: 'ClassCard',
    props: {
      course: {
        type: Object,
      },
      courses: {
        type: Array,
      },
      venue: {
        type: Boolean,
      },
    },
    computed: {
      infos() {
        let result = {};
        result[this.course.courseName] = [this.course.teacherName];
        return result;
      }
    },
    mixins: [ClassCardMixin],
  };
</script>

<style scoped>
  /*noinspection CssUnusedSymbol*/
  .class-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-top-style: solid;
    border-top-width: 3px;
    padding: 4px 3px 3px;
    transition: all 0.2s;
    border-radius: 2px;
    position: absolute;
    user-select: none;
    line-height: 1.35;
    text-align: left;
    overflow: hidden;
    cursor: pointer;
    bottom: 1px;
    right: 1px;
    left: 1px;
    top: 1px;
  }

  /*noinspection CssUnusedSymbol*/
  .class-card.class-card-hover {
    opacity: 0.6 !important;
  }

  @media screen and (min-resolution: 2dppx) {
    /*noinspection CssUnusedSymbol*/
    .class-card.class-card-hover {
      transform: scale3d(0.95, 0.95, 1);
    }
  }

  .course-name {
    margin-bottom: 1px;
    line-height: 1;
    font-size: 10px;
    color: rgba(255, 255, 255, 1);
  }

  .teacher-name-venue {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.25;
    font-size: 10px;
  }

  .venue {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.25;
    font-size: 12px;
  }

  .venue-at {
    color: white;
    font-weight: bold;
  }
</style>
