<template>
  <div ref='viewer'></div>
</template>

<script>
    import WebViewer from '@pdftron/pdfjs-express'
    export default {
        name: 'WebViewer',
        props: ['url'],

        mounted: function () {
            WebViewer({
                licenseKey: 't8aqS5zBEnL0qpxr5pWj',
                path: '/public',
                initialDoc: Buffer.from(this.url, 'base64'),
            }, this.$refs.viewer).then((instance) => {
                instance.disableFeatures([instance.Feature.Print, instance.Feature.Copy, instance.Feature.Download]);
            });
        }
    }
</script>

<style scoped>
div {
  width: 100%; 
  height: 100%;
}
</style>