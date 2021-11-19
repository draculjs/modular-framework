<template>
    <v-container fill-height>
        <v-row justify="center" align="center">
            <v-col cols="12" class="text-center">
              <h3 class="mb-2">Dracul Media - Documentacion</h3>
              <about-list :items="dataList"/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import AboutList from "../../components/AboutList";
    export default {
        name: 'AboutPage',
      components: {AboutList},
      created() {
        this.dataList.forEach(item => {
          // Si estoy en entorno local, reemplazo el link de Swagger porque el puerto es distinto.
          if (item.title == 'Swagger') {
            if (window.location.host.includes('localhost')) {
              item.link = process.env.VUE_APP_APIHOST + '/api-docs';
            }
          }
        })
      },
      data(){return{
        dataList: [{title: 'Acerca de Dracul Media', subtitle: 'Informacion acerca de como levantar el proyecto en local.', link: 'https://github.com/draculjs/modular-framework/tree/master/packages/media'},
          {title: 'Docker', subtitle: 'Informacion acerca de como levantar el proyecto con Docker.', link: 'https://github.com/draculjs/modular-framework/blob/master/packages/media/readme-docker.md'},
          {title: 'Documentacion frontend', subtitle: 'Listado de rutas, vistas y descripcion de componentes.', link: 'https://github.com/draculjs/modular-framework/blob/master/packages/media/media-frontend/docs-es.md'},
          {title: 'Documentacion backend', subtitle: 'Endpoints de GraphQL y REST. Descripcion de los servicios que provee.', link: 'https://github.com/draculjs/modular-framework/blob/master/packages/media/media-backend/docs-es.md'},
          {title: 'Invocaciones con GraphQL', subtitle: 'Se sugiere usar la extensión "Altair Graphql cliente" la cual permite subir archivos).', link: 'https://github.com/draculjs/modular-framework/blob/master/packages/media/media-backend/docs-es.md#queries'},
          {title: 'Swagger', subtitle: 'Link a la documentacion de endpoints REST con Swagger.', link: '/api-docs'},
          {title: 'Repositorios con ejemplos', subtitle: 'Ejemplos con diferentes lenguajes (PHP, Javascript, Java). (En desarrollo).',link: 'https://github.com/draculjs/dms-code-examples'}]
      }}
    }
</script>

<style scoped>

</style>