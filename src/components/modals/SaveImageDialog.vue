<template>
  <div>
    <h3>请下载后打印申请单</h3>
    <div v-viewer="viewerOption">
<!--      <img :src="blobUrl" alt="课程表图片" />-->
    </div>
    <template>
      <pdf :src="setPdfUrl()"></pdf>
    </template>
    <div class="input-wrapper">
      <a-input v-model="fileName" addon-before="保存文件名：" addon-after=".pdf" :placeholder="defaultFileName" />
    </div>
    <a-button type="primary" icon="download" @click="download">下载</a-button>
  </div>
</template>

<script>
  import saveAs from 'file-saver';
  import pdf from 'vue-pdf';
  import apiConfig from "@/apiConfig";

  export default {
    name: 'SaveImageDialog',
    components: {
      pdf
    },
    props: {
      blob: {
        type: Blob,
      },
      ticketId: {
        type:Number,
      }
    },
    data() {
      return {
        blobUrl: null,
        defaultFileName: null,
        fileName: null,
      };
    },
    computed: {
      viewerOption() {
        return {
          inline: false,
          button: true,
          navbar: false,
          title: false,
          toolbar: false,
          tooltip: true,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false,
          transition: true,
          fullscreen: false,
          keyboard: false,
          url: this.blobUrl,
        };
      },
    },
    mounted() {
      this.defaultFileName = `教室申请单`;
      this.fileName = this.defaultFileName;
    },
    beforeDestroy() {
      URL.revokeObjectURL(this.blobUrl);
    },
    methods: {
      download() {
        saveAs(this.setPdfUrl(), `${this.fileName || this.defaultFileName}.pdf`);
        this.$emit('ok');
      },
      setPdfUrl() {
        if (this.ticketId) {
          return apiConfig.getTicketApi(this.ticketId);
        }
        return apiConfig.getTicketApi('10000');
      },
    },
  };
</script>

<style scoped>
  div {
    text-align: center;
  }

  h3 {
    text-align: left;
  }

  img {
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    text-align: center;
    max-height: 240px;
    max-width: 100%;
    cursor: pointer;
  }

  .input-wrapper {
    margin: 20px 0;
  }
</style>
