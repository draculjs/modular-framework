# Common Module

<br>

This module is based on the creation of basic and reusable components for all platforms. They work as the basis for the most common and essential functionalities of any type of application.

Its main features are:


1. 1) Common buttons
    + -Close button
    + -Submit button
    + -Add button
    + -Show button
    + -Update button
    + -Delete button
2. 2) CRUD (Create, Read, Update, Delete)
    + -Create
    + -Delete
    + -Layout
    + -List
    + -Show / Read
    + -Update
3. 3) Client error
4. 4) Snackbar
5. 5) Loading
6. 6) Search field
7. 7) Toolbar Dialog and Simple Dialog

<br>

## Installation

```
npm i @dracul/common-frontend
```

<br>

---
---

<br>

# Common buttons

<br>

In this section we will detail the different buttons of typical use on the platforms, and their components.

Components:

    import {
        CloseButton,
        SubmitButton,
        AddButton,
        ShowButton, EditButton, DeleteButton
        } from "@dracul/common-frontend";

**Close button**: Simple button with text and color to pass to it, and actionable click functionality.

    props: {
            text: {type: String, default: "common.cancel"},
            loading: {type: Boolean, default: false},
            color: {type: String, default: 'secondary'}
        }

**Submit button**: Button to submit forms or messages, with the appropriate properties to function as such and have a good user interface.

    props: {
            text: {type: String, default: "common.submit"},
            loading: {type: Boolean, default: false},
            disabled: {type: Boolean, default: false},
            danger: {type: Boolean, default: false},
            name: {type: String, default: 'submit'},
            color: {type: String, default: 'secondary'}
        }   

**Add button**: A "+" sign button fixed in a corner of the screen to add elements in a specific component or page. It leads to the CrudCreate component.

    props: {
            loading: {type: Boolean, default: false},
            disabled: {type: Boolean, default: false},
            danger:{type: Boolean, default: false},
        }

**View button**: A magnifying glass button to analyze an element that is seen on the screen. It leads to the CrudShow component where the item is seen.

**Edit button**: A pencil button to edit an element that is seen on the screen. It leads to the CrudUpdate component where the element is modified.

**Delete button**: A basket button to delete an item that is seen on the screen. It leads to the CrudDelete component where the item to be removed is seen.

----
----

<br>

# CRUD

<br>

In this section we will detail the basic functionalities of creation, updating, visualization and deleting elements with the components.

Components:

    import {
        CrudCreate,
        CrudDelete,
        CrudLayout,
        CrudList,
        CrudUpdate,
        CrudShow
        } from "@dracul/common-frontend";

**CrudCreate**: Full screen component that has close and submit buttons, along with error messages to use in a 100% customizable creation form.

    props: {
            title: {type: String, default: 'common.create'},
            open: {type: Boolean, default: false},
            loading: {type: Boolean, default: false},
            errorMessage: {type: String, default: null},
        }

**CrudDelete**: On-screen pop-up card component that has close and submit buttons, the component is displayed in alert color to alert the user, it allows verifying the data before deleting any element.

    props: {
            title: {type: String, default: 'common.delete'},
            open: {type: Boolean, default: false},
            loading: {type: Boolean, default: false}
        }

**CrudLayout**: Basic card component for the information display with title and subtitle props and place to customize the content to be displayed.

    props: {
            title: String,
            subtitle: String,
        }

**CrudList**: Basic list component for displaying information in the form of a list, with options to customize the display of the information and a search field for content. It makes use of various components of the module such as the edit buttons, the search field, and more.

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

**CrudShow**: Basic pop-up card component for the information display with title and open props, close button, and space to customize the content to display.

    props: {
            title: {type: String, default: 'common.show'},
            open: {type: Boolean, default: false}
        }

**CrudUpdate**: Pop-up card component that features close and submit buttons, along with error messages for use in a basic edit form.

    props: {
            title: {type: String, default: 'common.create'},
            open: {type: Boolean, default: false},
            loading: {type: Boolean, default: false},
            errorMessage: {type: String, default: null},
        }

<br>

## Client errors

The .js file contains the ClientError class where they are defined and from which the main errors used by the platform modules can be imported.

There is also the ErrorAlert component which consists of an alert message to which the errorMessage to be displayed is passed and it appears to the user in case of an error.

<br>

## Loading

It is a loading progressive bar or linear infinite loading bar, with the option of passing a text to display while the component is visible.

<br>

## Snackbar

Message / notification snackbar which allows you to, depending on the case, customize the color and time that the message remains for the user to see.

    props: {
            value: String,
            message: String,
            color: {type: String, default: "success"},
            timeout: {type: Number, default: 4000}
        },

<br>

## Search field

Text-field component linked to a search, to which only the label is passed and the component acts as a search engine where it is used.

<br>

## Toolbar Dialog and Simple Dialog

Two components that form a basic message card to display information or messages with:
- -ToolbarDialog: A close button in the upper right corner and a title in the upper left corner.
- -SimpleDialog: The content to display on the card.

<br>

-----------

## Recommendation

It is recommended to use Scaffold, where you already have all the modules implemented to be able to use it as a project base.

https://github.com/draculjs/scaffold

