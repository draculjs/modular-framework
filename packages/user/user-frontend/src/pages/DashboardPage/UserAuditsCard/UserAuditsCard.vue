<template>
  <v-card>
    <v-card-title v-t="'user.audit.userAudit'"></v-card-title>


    <v-card-text>
      <v-simple-table dense fixed-header :height="height">
        <template v-slot:default>

          <tbody>

          <tr v-for="item in data" :key="item.id">
            <td :bgcolor="getColor(item)">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span style="cursor:pointer" v-on="on">{{ getMessage(item) }}</span>
                </template>
                <span>{{ getDateTimeFormat(item.date, true) }}</span>
              </v-tooltip>

            </td>

          </tr>

          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>


  </v-card>
</template>
<script>

import {DayjsMixin} from "@dracul/dayjs-frontend"

export default {
  name: 'userAuditsCard',
  mixins: [DayjsMixin],
  props: {
    data: Array,
    height: Number
  },
  computed: {
    getMessage() {
      return item => this.capitalize(this.$t('user.audit.' + item.action, {username: item.actionFor ? item.actionFor.username : '?'}))
    },
    capitalize() {
      return (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
      }
    },
    getColor() {
      return item => {
        switch (item.action) {
          case 'userCreated':
          case 'userModified':
            return '#C8E6C9'
          case 'userDeleted':
            return '#FFCCBC'
          case 'userPasswordChange':
          case 'adminPasswordChange':
            return '#FFF9C4'
          case 'userRegistered':
          case 'userActivated':
            return '#B2DFDB'
          default:
            return '#B2DFDB'
        }
      }
    }

  }
}
</script>
