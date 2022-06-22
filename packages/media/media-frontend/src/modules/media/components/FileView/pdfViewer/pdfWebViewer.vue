<template>
  <div ref='viewer'></div>
</template>

<script>
import WebViewer from '@pdftron/pdfjs-express'
export default {
  name: 'WebViewer',
  props: {
    url: String
  },
  mounted: function () {
        WebViewer({
            licenseKey: 't8aqS5zBEnL0qpxr5pWj',
            path: '/public',
            initialDoc: this.url,
          }, this.$refs.viewer).then((instance) => {
            instance.disableFeatures([instance.Feature.Print, instance.Feature.Copy, instance.Feature.Download]);
          });
    }
}
  document.addEventListener('keyup', (e) => {
    if (e.key == 'PrintScreen') {
      navigator.clipboard.writeText('');
    }
  });
</script>

<style scoped>
div {
  width: 375px; 
  height: 300px;
}
</style>