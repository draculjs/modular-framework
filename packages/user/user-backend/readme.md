# Dracul User Module
A user module with common functions with rbac (role based access control)

This module works together with @dracul/user-frontend

## Stack & Dependencies
- Nodejs
- Express
- Mongoose
- Nodemailer
- Graphql (Apollo Server)
- JWT Auth

##  Dracul User Module - Manual of use

The following file is an instruction manual for the use of the Dracul user´s module. It will seek to describe the main functionalities of said module, these are:

1. Functionalities of the user session
     - Log in
     - Sign off
     - User register
         - User activation
     - Recover password
     - Change Password
     - Change avatar
2. Administrator functions
     - User and password management
     - Role management
     - Group administration
     - Administrator dashboard

---
---
# 1. User session functionalities
In this section we will detail the different functionalities for the configuration, creation and edition of the own user in the platform.

----
## Log in

To access all the functionalities of the tool, you must log in with your user data.

> In case of not having a user see the [*User registration*](#user-registration) section.

When accessing the platform, the first screen will ask for your username and password, the two that you should have previously created. On this screen you must complete the data and press the start session button to enter all the functionalities of the tool.

> In case of not remembering the password, see the [*Recover password*](#recover-password) section.

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

These are all mandatory except for the phone number. After completing this form you must click on *Sign up*, and, if all the information is valid, you will be redirected to a screen where a registration completed message will appear, along side with the email address to which you are sent the confirmation for the user´s activation.


## User activation

You must enter to the email provided in the user registration and look for the email from **xxx@yyy.com**, in which you will be asked to confirm that you have created the user, after doing so you will be redirected to the CRM page and the user will be successfully created.

----
## Recover password

This instance is designed in case you already have a user on the platform but do not remember the login password.

To recover the password you must click on the phrase *"Forgot your password?"* That is under the login button on the login screen. By doing this you will be redirected to a password recovery screen where you will be asked for the email with which you initially registered on the platform, to which we will send you the instructions to recover your password.

----
## Change Password

If at any point it is decided to change the user password, be it for convenience or security, or another reason, you must enter the user profile and select that option.

To do this you must first log in. Once on the main screen, look for the avatar in the upper right corner, click and from the drop-down that appears select the option *"Profile"*. Then a box will be displayed with the user's data (Name, Email and Telephone), and underneath a `Recover password` button, which must be clicked to advance. When you click on this button, a form will appear that will first request the current password to allow the password change and below the new password with the confirmation of it. The form must be completed and sent to finalize the modification.

-----
## Change avatar

The avatar, being this a graphic representation or image that is associated with a user on the platform, must be chosen once the user has been confirmed, since it is not requested during the creation of the same.

To do this you must first log in. Once on the main screen, look for the avatar in the upper right corner, click and from the drop-down that appears select the option * "Profile" *. Then a box will be displayed with the user's data (Name, Email and Telephone), headed by a predetermined image, in order to modify this image, you must click it, this will open the computer explorer, from where you have to choose the image that will be your new avatar.


-----
-----

# 2 Administrator functions
In this section, the functions corresponding to an administrator user will be detailed, they are the possibility of creating, editing and controlling all users, their roles and the different groups, together with the visualization of a general control dashboard.

To access these functions, once the session is started, go to the upper left corner of the screen, and click on the menu icon (3 horizontal stripes). A side menu with several options will be displayed:
|Menu|
----
|Main  |
|About  |
|Campaigns  |
|Citizens | 
|Companys  |
|Administrator|

In this last option of ** Administrator ** you will find all the functions that were mentioned and that we will explain below.


----

## Users Management

From this screen you can view, edit and create new users.
Upon entering the user administration screen, a list of all users assigned to the administrator session can be seen, with their information.

|Name| User |Email|Phone|Role|Active|Accions
|------| ------- |-----|--------|---|----- |---
|      |         |     |        |   |      |

From this information you can use the search bar to filter users by any of these data, also you can click on the column headings to sort the lists. There are also a series of actions that can be performed for each user according to the action chosen in the last column of the list:
- View user info: Displays all the user information
- Apikey: It allows obtaining the **apikey** of the user
- Edit: Allows you to edit all the user's info, including role, group and if it is active or not.
- Password: Allows **to modify the password** of the selected user
- Delete: Delete the user

To **create a new user** you must select the symbol **(+)** in the lower right corner, when clicking on it a form for creating users is displayed with all the necessary information to do this.

----

## Role management

The roles are used to manage the permissions that each user has within the platform. From this screen you can view, edit and create new roles.
Upon entering the role management screen, you can see a list of all the platform's permissions and which of these are assigned to each role.

|Permission   | Role 1 |Role 2
|--------   | ----- |-----
| Permission 1 |    yes | no
| Permission 2 |   yes  | yes

Under each role there are 2 icons, edit and delete. The first allows the edition of the role, where you can modify the name and which permissions it has and which it does not. The other removes the role of the platform.

To **create a new role** you must select the symbol **(+)** in the lower right corner, clicking on it displays the form for creating roles, requesting the name of the role with the permissions that can be assigned to it.

----

## Group administration

Groups are used to classify users by something beyond their role, such as a specific project or sector. From this screen you can view, edit and create new groups.
Upon entering the group administration screen, you can see a list of all the groups that were created, with their information.

|Avatar| Name  |Colour|Users|Actions
|------| ------- |-----|--------|---
|      |         |     |        |

From this information you can use the search bar to filter the groups by any of these data and by clicking on the column headings, sort the lists. There are also a series of actions that can be taken for each user according to the action that is chosen from the last column of the list:
- See group info: Displays all the group information
- Edit: Allows you to edit all the information and group members
- Delete: Delete the group

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




## EnviromentVariables .env

```$xslt
# Max avatar file size in bytes. Ex: 10000000 Bytes == 1 MegaByte
AVATAR_MAX_SIZE = 20000000

### SMTP CONFIG ###

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

# SMTP_SECURE= true (use 465 port) / false (use other port)
SMTP_SECURE=true

# SMTP_IGNORE_TLS= true (dont user TLS, ej port 25) / false (use TLS)
SMTP_IGNORE_TLS=false

SMTP_USER=ci.sys.virtual@gmail.com
SMTP_PASS=
```


## Entities / Models

#### User:

- username: String,Unique, Required
- email: String, Unique, Required
- password: String, Required
- name: String, Required
- phone: String, Optional
- active: Boolean, Required
- role: Relation with Role
- groups: Relations with group

### Role:
- name: String, Unique, Required
- permissions: Array of Strings

