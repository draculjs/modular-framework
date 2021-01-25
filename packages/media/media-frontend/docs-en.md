#Dracul module: media-frontend

The dracul media module provides a file storage service and exposes Vue pages and components ready to integrate.

## Interface
This module provides the user interface for managing the file service. Includes pages, components, and providers.

## Pages

### File management page
FileManagementPage allows you to manage files, being able to list files, upload files, edit tags and description, delete files and view the metadata, URL and preview of the files.

** route **: / file management

### Files control panel page

FileDashboardPage allows you to view summary information about stored files

** route **: / file-dashboard


## Components

### Upload file
Exposes a modal that allows uploading a file

### FileUploadExpress
It exposes a button that allows to upload a file. The button shows a loading spinner while the file is uploaded, at the end it shows a different icon depending on the type of file.

### FileView
Show a preview of the file if possible (images, audios, video) otherwise it shows the download link. Metadata sample: file name, MIME type, size, URL

## Suppliers

### File metric provider

FileMetricsProvider exposes querys graphql to the backend module to obtain metrics for the dashboard

### File Provider

FileProvider exposes querys and graphql mutations to get and edit files from storage.

### Upload provider

UploadProvider exposes a mutation to upload the files.
