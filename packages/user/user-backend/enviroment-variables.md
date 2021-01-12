# User Module

<br>

## Enviroment variables .env

### Frontend

```$xslt
NODE_ENV=development o production
VUE_APP_APIHOST=http://localhost:5000
VUE_APP_KEY=scaffold
VUE_APP_REGISTER=enable
```

### Backend

```$xslt
NODE_ENV=desarrollo

#MONGO CONFIG
MONGO_URI=mongodb://127.0.0.1:27017/proyect

#AUTH CONFIG
JWT_SECRET=djghhhhuuwiwuewieuwieuriwu
JWT_LOGIN_EXPIRED_IN=1h
JWT_REGISTER_EXPIRED_IN=30d

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

<br>

#### User:

- username: String,Unique, Required
- email: String, Unique, Required
- password: String, Required
- name: String, Required
- phone: String, Optional
- active: Boolean, Required
- role: Relation with Role
- groups: Relations with group

#### Role:
- name: String, Unique, Required
- permissions: Array of Strings