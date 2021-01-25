#Dracul modulo: media-frontend

El modulo media de dracul brinda un servicio de almacenamiento de archivos y expone páginas y componentes Vue listo para integrar.

## Frontend 
Este modulo provee la interfaz de usuario que permite gestionar el servicio de archivos. Incluye páginas, componentes y providers.

## Pages

### File Management Page
FileManagementPage permite gestionar archivos pudiendo listar archivos, subir archivos, editar tags y descripción, eliminar archivos y visualizar la metadata, URL y preview de los archivos.   

**ruta**: /file-management

### File Dashboard Page

FileDashboardPage permite visualizar información sumarizada sobre los archivos almacenados 

**ruta**: /file-dashboard


## Components

### FileUpload
Expone un modal que permite subir un archivo

### FileUploadExpress
Expone un boton que permite subir un archivo. El boton muestra un spinner de loading mientras el archivo se sube, al finalizar muestra un icono diferente segun el tipo de archivo.

### FileView
Expone una preview del archivo si es posible (imagenes, audios, video) de lo contrario muestra el link de descarga. Muestra metadata: filename, mimetype, size, url 

## Providers

### File Metrics Provider

FileMetricsProvider expone querys graphql al módulo backend para la obtención de métricas para el dashboard

### File Provider

FileProvider expone querys y mutations graphql para obtener y editar los archivos del storage.

### Upload Provider

UploadProvider expone una mutation para subir los archivos.
