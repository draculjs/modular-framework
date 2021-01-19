# Logger Module

Dracul Logger Module provide several winston logger configurations and factories ready to use.
Options can be set from environment variables.

## This module allows:

1. 1) Differentiate logs by deciding the priority level.
2. 2) The levels for logging logs from highest to lowest priority are:
  - - -Energ
  - - -Alert
  - - -Crit
  - - -Error 
  - - -Warning
  - - -Notice
  - - -Info
  - - -Debug
3. 3) Allows you to define the log output format using the conveyor from the environment variables.

## Installation:
```
npm i @dracul/logger-backend
```
## Setting environment variables:

<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <th>Log level</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_LEVEL</td>
    <td>String</td>
    <td>Depending on the level of the Log you want it is declared as an error / warning / info / debug.</td>
  </tr>
  <tr>
    <th>Request</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_REQUEST</td>
    <td>String [ON/OFF]</td>
    <td></td>
  </tr>
  <tr>
    <td>LOG_RESPONSE_TIME</td>
    <td>String [ON/OFF]</td>
    <td></td>
  </tr>
  <tr>
    <td>LOG_GQL_ERRORS</td>
    <td>String [ON/OFF]</td>
    <td></td>
  </tr>
  <tr>
    <th>Log Transports</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_CONSOLE</td>
    <td>String [ON/OFF]</td>
    <td>Enables console logging.</td>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_COMBINED</td>
    <td>String [ON/OFF]</td>
    <td>Enables console and per-file logging, and also brings logs from all levels.</td>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_ERROR</td>
    <td>String [ON/OFF]</td>
    <td>Enables error logging.</td>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_ACCESS</td>
    <td>String [ON/OFF]</td>
    <td>Enables logging of requests to the backend.</td>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_GQL_ERROR</td>
    <td>String [ON/OFF]</td>
    <td>Enables logging of backend responses and also delays responding in milliseconds.</td>
  </tr>
  <tr>
    <td>LOG_TRANSPORT_GQL_RESPONSE</td>
    <td>String [ON/OFF]</td>
    <td>Enables logging of GraphQl errors.</td>
  </tr>
  <tr>
    <th>Colorize</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_COLORIZE</td>
    <td>String [ON/OFF]</td>
    <td>Enables the color of logs according to their type.</td>
  </tr>
  <tr>
    <th>Max log file size in bytes</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_FILE_MAX_SIZE</td>
    <td>Integer</td>
    <td>Declares the size of the file on which logs are saved in Bytes. Eg: 10000000 Bytes == 1 MegaByte.</td>
  <tr>
    <th>Number of max files</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_FILE_MAX_FILES</td>
    <td>Integer</td>
    <td>Declares the maximum number of files to log logs.</td>
  </tr>
  <tr>
    <th>Log modes</th>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td>LOG_FILE_MAX_SIZE</td>
    <td>String [TEXT/JSON]</td>
    <td>Declares how you want to save the logs. As text or as JSON.</td>
  </tr>
</table>

## Recommendation
It is recommended to use Scaffold, where it already contains all the modules implemented in order to use it as a project base.
https://github.com/draculjs/scaffold
