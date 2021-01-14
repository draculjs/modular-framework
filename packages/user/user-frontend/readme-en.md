# User Module

<br>

It provides models, services, components and pages for the management and authentication of the application users. It has a stateless approach handling authentication through JWT and implements RBAC (Role Based Access Control) for the management of roles and permissions.

Its main features are:

1. 1) Functionalities of the user session
     - -Log in
     - -Sign off
     - -User register
         - -User activation
     - -Recover password
     - -Change Password
     - -Change avatar
2. 2)Administrator functions
     - -User and password management
     - -Role management
     - -Group administration
     - -Administrator dashboard

<br>

## Installation

```
npm i @dracul/user-frontend
```

<br>

---
## Main FRONTEND imports

<br>

The project paths must be merged with those of the module to have access to all the views:

*apps/frontend/src/router/routes.js*

    import {routes as userRoutes} from '@dracul/user-frontend'

<br>

The messages of the project must be merged with those of the module to have access to all translations:

*apps/frontend/src/i18n/index.js*

    import {i18nMessages as i18nMessagesUser} from '@dracul/user-frontend'

<br>

GraphQL must be initialized with apolloClient to make use of the module's queries:

*apps/frontend/src/main.js*

    import { setGraphQlClientToProviders } from "@dracul/user-frontend";

    setGraphQlClientToProviders(apolloClient);


<br>

Use of the module store together with the project store:

*apps/frontend/src/store/index.js*

    import {UserModuleStore} from '@dracul/user-frontend'

    import createPersistedState from "vuex-persistedstate";

    export default new Vuex.Store({
    modules:{
        user: UserModuleStore,
        ...
    },
    plugins: [
        createPersistedState({
            key: process.env.VUE_APP_KEY,
            paths: ['user'],
            reducer: state => (
                {
                user: {
                    access_token: state.user.access_token,
                    me: state.user.me
                },
                ...
            })
          })
       ]
    })

<br>

---
---
<br>

# User session functionalities

<br>

In this section we will detail the different functionalities for the configuration, creation and edition of the own user in the platform.

### Access component

The component to access this functionality is the **AppBarUserMenu**, which shows, where it is located, access to the login in case of not having logged in or access to user configuration in case of being logged in. 

    import {AppBarUserMenu} from '@dracul/user-frontend'

----
## Log in

To access all the functionalities of the tool, you must log in with your user data.

In case of not having a user see the [*User registration*](#user-registration) section.

When accessing the platform, the first screen will ask for your username and password, the two that you should have previously created. On this screen you must complete the data and press the start session button to enter all the functionalities of the tool.

In case of not remembering the password, see the [*Recover password*](#recover-password) section.

## Sign off

Once the user experience is finished, the session must be closed. This is important to protect personal information and prevent people other than the user from entering the platform.

For this you must click on the user's avatar in the upper right corner of the screen where the information of the logged in user and the options to visit your profile and log out will be displayed:
~~~~
user
user@domain.com
-------------------
Profile
Sign off
~~~~
By clicking on the last, the session will be closed.

-----
## User registration

This functionality will be accessed the first time the platform is used. It is found below the login as: *"Still dont have a user? Sign up"*. By clicking on this link you can access the user registration screen.

To register a new user, a series of data is requested:
- Name
- Lastname
- Email
- Password
- Phone

<br>

These are all mandatory except for the phone number. After completing this form you must click on *Sign up*, and, if all the information is valid, you will be redirected to a screen where a registration completed message will appear, along side with the email address to which you are sent the confirmation for the user´s activation.<br><br>


## User activation

You must enter to the email provided in the user registration and look for the email from **loquesaea@sondeos.com.ar**, in which you will be asked to confirm that you have created the user, after doing so you will be redirected to the CRM page and the user will be successfully created.

----

## Recover password

This instance is designed in case you already have a user on the platform but do not remember the login password.

To recover the password you must click on the phrase *"Forgot your password?"* That is under the login button on the login screen. By doing this you will be redirected to a password recovery screen where you will be asked for the email with which you initially registered on the platform, to which we will send you the instructions to recover your password.


## Change Password

If at any point it is decided to change the user password, be it for convenience or security, or another reason, you must enter the user profile and select that option.

To do this you must first log in. Once on the main screen, look for the avatar in the upper right corner, click and from the drop-down that appears select the option *"Profile"*. Then a box will be displayed with the user's data (Name, Email and Telephone), and underneath a `Recover password` button, which must be clicked to advance. When you click on this button, a form will appear that will first request the current password to allow the password change and below the new password with the confirmation of it. The form must be completed and sent to finalize the modification.

-----
## Change avatar

The avatar, being this a graphic representation or image that is associated with a user on the platform, must be chosen once the user has been confirmed, since it is not requested during the creation of the same.

To do this you must first log in. Once on the main screen, look for the avatar in the upper right corner, click and from the drop-down that appears select the option * "Profile" *. Then a box will be displayed with the user's data (Name, Email and Telephone), headed by a predetermined image, in order to modify this image, you must click it, this will open the computer explorer, from where you have to choose the image that will be your new avatar.

<br>

-----
-----

<br>

# Administrator functions
In this section, the functions corresponding to an administrator user will be detailed, they are the possibility of creating, editing and controlling all users, their roles and the different groups, together with the visualization of a general control dashboard.

To access these functions, once the session is started, go to the DashboardButton component button and click on it.

<br>

### Access component

<br>


The component to access this functionality is the **DashboardButton**, being this one a button to access the administrator's control panel, when clicking on this component you are redirected to the previously mentioned panel where you have access to all the functionalities that were mentioned and that we will explain below.

     import {DashboardButton} from '@dracul/user-frontend'


----

## Users Management

From this screen you can view, edit and create new users.
Upon entering the user administration screen, a list of all users assigned to the administrator session can be seen, with their information.

|Name| User |Email|Phone|Role|Active|Accions
|------| ------- |-----|--------|---|----- |---|
|   John  |  Nash  | Jn@jn.com| 12345  | Op. |  True  |  CRUD    |

<br>

From this information you can use the search bar to filter users by any of these data, also you can click on the column headings to sort the lists. There are also a series of actions that can be performed for each user according to the action chosen in the last column of the list:
- View user info: Displays all the user information
- Apikey: It allows obtaining the **apikey** of the user
- Edit: Allows you to edit all the user's info, including role, group and if it is active or not.
- Password: Allows **to modify the password** of the selected user
- Delete: Delete the user

<br>

To **create a new user** you must select the symbol **(+)** in the lower right corner, when clicking on it a form for creating users is displayed with all the necessary information to do this.

----

## Role management

The roles are used to manage the permissions that each user has within the platform. From this screen you can view, edit and create new roles.
Upon entering the role management screen, you can see a list of all the platform's permissions and which of these are assigned to each role.

|Permission   | Role 1 |Role 2|
|--------   |: ----- :|:-----:|
| Permission 1 |    yes | no|
| Permission 2 |   yes  | yes|

<br>

Under each role there are 2 icons, edit and delete. The first allows the edition of the role, where you can modify the name and which permissions it has and which it does not. The other removes the role of the platform.

To **create a new role** you must select the symbol **(+)** in the lower right corner, clicking on it displays the form for creating roles, requesting the name of the role with the permissions that can be assigned to it.

----

## Group administration

Groups are used to classify users by something beyond their role, such as a specific project or sector. From this screen you can view, edit and create new groups.
Upon entering the group administration screen, you can see a list of all the groups that were created, with their information.

|Avatar| |Name  ||Color||Users||Actions|
|------| -|-------| -|-----|-|--------|-|---|
|   img|  |grupo 1| |rojo | |usA,usB | |CRUD   |

<br>

From this information you can use the search bar to filter the groups by any of these data and by clicking on the column headings, sort the lists. There are also a series of actions that can be taken for each user according to the action that is chosen from the last column of the list:
- See group info: Displays all the group information
- Edit: Allows you to edit all the information and group members
- Delete: Delete the group

<br>

To **create a new group** you must select the symbol **(+)** in the lower right corner, clicking on it displays the form for creating users with all the necessary information and the members that can be assigned to it.

---
## Administrator Dashboard

The administrator dashboard is a screen in which you have a summary of all the information and the main events of the company on the platform. You can access it through the left side menu or more quickly by clicking on the icon to the left of the avatar in the upper right corner of the screen.

Once inside the dashboard, there are direct access buttons to the user, role and group administration screens explained above. Below these you can see a series of graphics and tables of data on the use of the platform:

### Summary of user sessions
It is a table with the main session data of each user, including number of sessions, average duration, orders, among others.

### User audit
Register the creations and modifications of the users on the platform.

### Client sessions by browser
Pie chart that explains the percentage of sessions per browser over the total sessions to the platform.

### Client sessions per OS
Pie chart that explains the percentage of sessions per OS over the total sessions to the platform.

### Client sessions per device
Pie chart that explains the percentage of sessions by type of device over the total sessions to the platform.

### Failed logins
Logs failed login attempts.

### Sessions by country
It consists of a map where you can position the cursor to identify the amount of sessions from the selected place.

### Sessions by city
Comparative bar graph that shows the amounts of sessions from the different registered locations.

-----
-----
<br>

## Requisites
- -store
- -i18n
- -vuetify
- -apollo client
- -router

<br>

## Stack & Dependencies
- -Nodejs
- -Express
- -Mongoose
- -Nodemailer
- -Graphql (Apollo Server)
- -JWT Auth

<br>

## Dependencies
```
  "dependencies": {
    "apollo-cache-inmemory": "^1.6.6",
    "apollo-client": "^2.6.10",
    "apollo-link": "^1.2.14",
    "apollo-link-error": "^1.1.13",
    "apollo-upload-client": "^13.0.0",
    "chart.js": "^2.9.3",
    "chartjs-plugin-labels": "^1.1.0",
    "core-js": "^3.6.5",
    "graphql": "^15.0.0",
    "jwt-decode": "^2.2.0",
    "moment": "^2.26.0",
    "moment-timezone": "^0.5.31",
    "vue": "^2.6.11",
    "vue-chartjs": "^3.5.0",
    "vue-i18n": "^8.18.1",
    "vue-map-chart": "0.0.2",
    "vue-router": "^3.3.2",
    "vuetify": "^2.2.11",
    "vuex": "^3.4.0"
  }
```
<br>

## Dev Dependecies
```
    devDependencies{
        "graphql-tag": "^2.10.3",
        "deepmerge": "^4.2.2"
    }
```
<br>

## Misc
- Storybook
- Test with jest

<br>

## vue.config.js
Add gql loader
```
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack: (config) => {
    config.module
        .rule('gql')
        .test(/\.(graphql|gql)$/)
        .use('graphql-tag/loader')
        .loader('graphql-tag/loader')
        .end();
  }
}
```

-----------

## Recommendation

It is recommended to use Scaffold, where you already have all the modules implemented to be able to use it as a project base.

https://github.com/draculjs/scaffold