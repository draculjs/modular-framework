# Modulo de Escenciales

<br>

Este modulo se basa en la creacion de componentes basicos y reutilizables para toda plataforma. Los mismos funcionan como base para las funcionalidades mas comunes y escenciales de cualquier tipo de aplicacion.

Los principales componentes del mismo son:

1. 1) Botones comunes
    + -Boton de cierre
    + -Boton sumitir
    + -Boton de agregar
    + -Boton de ver
    + -Boton de actualizar
    + -Boton de eliminar
2.  2) CRUD(Create, Read, Update, Delete) 
    + -Crear
    + -Eliminar
    + -Layout
    + -Lista
    + -Ver/Leer 
    + -Actualizar
3. 3) Error de cliente
4. 4) Snackbar
5. 5) Loading
6. 6) Campo de busqueda
7. 7) Barra de herramientas de tarjeta y tarjeta simple

<br>

## Instalación

```
npm i @dracul/common-frontend
```

<br>

---
---

<br>

# Botones comunes

<br>

En esta seccion detallaremos los distintos botones de uso tipico en las plataformas y los componentes de los mismos.

Componentes:

    import {
        CloseButton,
        SubmitButton,
        AddButton,
        ShowButton, EditButton, DeleteButton
        } from "@dracul/common-frontend";


**Boton de cierre**: Boton que tendra el texto, color y loading que se pasa como prop. Al que se le puede utilizar con una funcion para cerrar un componente.

    props: {
            text: {type: String, default: "common.cancel"},
            loading: {type: Boolean, default: false},
            color: {type: String, default: 'secondary'}
        }

**Boton submitir**: Boton para submitir formularios o mensajes, con las propiedades acordes para funcionar como tal y tener una buena interfaz de usuario.

    props: {
            text: {type: String, default: "common.submit"},
            loading: {type: Boolean, default: false},
            disabled: {type: Boolean, default: false},
            danger: {type: Boolean, default: false},
            name: {type: String, default: 'submit'},
            color: {type: String, default: 'secondary'}
        }   

**Boton de agregar**: Boton de signo "+" fijo en una esquina de la pantalla para adicionar elementos en un componente o pagina determinado. Abre el componente de CrudCreate.

    props: {
            loading: {type: Boolean, default: false},
            disabled: {type: Boolean, default: false},
            danger:{type: Boolean, default: false},
        }

**Boton de ver**: Boton de lupa para analizar un elemento que se ve en pantalla. Lleva al componenete de CrudShow donde se ve el elemento.

**Boton de editar**: Boton de lapiz para editar un elemento que se ve en pantalla. Lleva al componenete de CrudUpdate donde se modifica el elemento.

**Boton de eliminar**: Boton de cesto para eliminar un elemento que se ve en pantalla. Lleva al componenete de CrudDelete donde se ve el elemento para eliminar.

----
----

<br>

# CRUD

<br>

En esta seccion detallaremos las funcionalidades basicas de creacion, actuzlizacion, visualizacion y eliminar elementos con los componentes.

Componentes:

    import {
        CrudCreate,
        CrudDelete,
        CrudLayout,
        CrudList,
        CrudUpdate,
        CrudShow
        } from "@dracul/common-frontend";

**CrudCreate**: Componente de pantalla completa que cuenta con los botones de cierre y sumitir, junto con mensajes de error para utilizar en un formulario de creacion 100% personalizable.

    props: {
            title: {type: String, default: 'common.create'},
            open: {type: Boolean, default: false},
            loading: {type: Boolean, default: false},
            errorMessage: {type: String, default: null},
        }

**CrudDelete**: Componente de tarjeta emergente en pantalla que cuenta con los botones de cierre y sumitir, el componente se muestra en color de alerta para alertar al usuario, permite verifcar los datos antes de eliminar algun elemento.

    props: {
            title: {type: String, default: 'common.delete'},
            open: {type: Boolean, default: false},
            loading: {type: Boolean, default: false}
        }

**CrudLayout**: Componente de tarjeta bascico para el display de informacion con props de titulo y subtitulo y lugar para personalizar el contenido a mostrar.

    props: {
            title: String,
            subtitle: String,
        }

**CrudList**: Componente de lista bascico para el display de informacion en forma de lista, con opciones para personalizar la visualizacion de la informacion y un campo de busqueda de contenido. Hace uso de varios componentes del modulo como los botones de edicion, el campo de busqueda, y mas.

    props: {
            items: {type: Array, required: true},
            totalItems: {type: Number, required: true},
            loading: {type: Boolean, default: true},
            //Headers
            headers: {type: Array, required: true},
            //Actions enable
            enableEdit: {type: Boolean, default: true},
            enableDelete: {type: Boolean, default: true},
            enableShow: {type: Boolean, default: true},
        }

**CrudShow**: Componente de tarjeta emergente bascico para el display de informacion con props de titulo y open, boton de cierre, y espacio para personalizar el contenido a mostrar.

    props: {
            title: {type: String, default: 'common.show'},
            open: {type: Boolean, default: false}
        }

**CrudUpdate**: Componente de tarjeta emergente que cuenta con los botones de cierre y sumitir, junto con mensajes de error para utilizar en un formulario de edicion basico.

    props: {
            title: {type: String, default: 'common.create'},
            open: {type: Boolean, default: false},
            loading: {type: Boolean, default: false},
            errorMessage: {type: String, default: null},
        }

<br>

## Errores de cliente

Archivo .js contiene la clase ClientError donde estan definidos y del cual se pueden importar los principales errores que utilizan los modulos de la plataforma.

Tambien esta el componente ErrorAlert el cual consiste de un mensaje de alerta al que se le pasa el errorMessage a mostrar y le aparece al usuario en caso de existir un error.

<br>

## Loading

Componente de carga de barra progresiva o carga infinita lineal horizontal, con la opcion de pasarle un texto a mostrar mientras el componente esta visible.

<br>

## Snackbar

Snackbar de mensaje/notificacion el cual permite personalizar el color y tiempo que permanece el mensaje para que el usuario vea dependiendo del caso.

    props: {
            value: String,
            message: String,
            color: {type: String, default: "success"},
            timeout: {type: Number, default: 4000}
        },

<br>

## Campo de busqueda

Componente de text-field linkeado a una busqueda, al cual solo se le pasa el label y el componente actua como buscador donde se lo utilice. 

<br>

## Barra de herramientas de tarjeta y tarjeta simple

Dos componentes que forman una trajeta de mensaje basica para mostrar informacion o mensajes con:
- -ToolbarDialog: Un boton de cierre en la esquina superior derecha y un titulo en la superior izquierda.
- -SimpleDialog: El contenido a mostrar en la tarjeta.

<br>

-----------

## Recomendación

Se recomienda utilizar Scaffold, donde ya contiene todos los módulos implementados para poder usarlo como base de proyecto.

https://github.com/draculjs/scaffold