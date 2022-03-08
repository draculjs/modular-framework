<template>
  <v-container>
    <v-form ref="form" autocomplete="off" @submit.prevent="$emit('save')">
      <v-row>
        <v-col cols="12">
          <span class="headline black--text">{{ $t('media.userStorage.cliente') }}: {{ form.name }}</span>
        </v-col>
        <v-col cols="4">
          <v-text-field
              v-model="form.capacity"
              type='number'
              :label="$t('media.userStorage.capacity')"
              dense
              suffix="MB"
              :rules="storageRules"
              required
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="ml-12">
          <span
              class="headline black--text">{{ $t('media.userStorage.usedPercentage') }} {{ percentageUsed(form) }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
              v-model="form.maxFileSize"
              type='number'
              :label="$t('media.userStorage.maxFileSize')"
              dense
              suffix="MB"
              :rules="maxFileSizeRules"
              required
              :hint="'Max '+fileSizeLimit+' Mb'"
              persistent-hint
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="ml-12">
          <!-- <v-checkbox
              v-model="form.facialRecognition"
              :label="$t('renaper.asignOperations.facial')"
              dense hide-details
          ></v-checkbox> -->
          <span class="headline black--text">{{ $t('media.userStorage.fileSizeLimit') }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
              v-model="form.fileExpirationTime"
              type='number'
              :label="$t('media.userStorage.fileExpirationTime')"
              dense
              :suffix="$t('media.userStorage.days')"
              :rules="fileExpirationTimeRules"
              required
              :hint="'Max '+fileExpirationLimit"
              persistent-hint
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="ml-12">
          <span class="headline black--text">{{ $t('media.userStorage.fileExpirationLimit') }}</span>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="4" class="pa-0 pl-2">
          <v-col cols="12" sm="12" class="pa-0">
            <v-switch color="success" :label="form.deleteByLastAccess?'Activo':'Inactivo'" input-value="0"
                      v-model="form.deleteByLastAccess"></v-switch>
          </v-col>
        </v-col>
        <v-col cols="7" class="ml-12">
          <span class="headline black--text">{{ $t('media.userStorage.deleteByLastAccess') }}</span>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="4" class="pa-0 pl-2">
          <v-col cols="12" sm="12" class="pa-0">
            <v-switch color="success" :label="form.deleteByCreatedAt?'Activo':'Inactivo'" input-value="0"
                      v-model="form.deleteByCreatedAt"></v-switch>
          </v-col>
        </v-col>
        <v-col cols="7" class="ml-12">
          <span class="headline black--text">{{ $t('media.userStorage.deleteByDateCreated') }}</span>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>

export default {
  name: "UserStorageForm",
  props: {
    value: {
      type: Object,
      required: true
    },
    inputErrors: Object,
    fileSizeLimit: Number,
    fileExpirationLimit: Number
  },
  methods: {
    percentageUsed(form) {
      return form.capacity > 0 ? parseFloat(form.usedSpace * 100 / form.capacity).toFixed(2) + "%" : "-"
    },
  },
  data() {
    return {
      maxFileSize: 0,
      storageRules: [
        (v) =>
            parseFloat(v) >= this.form.usedSpace || this.$t("media.userStorage.insufficientCapacity"),
      ],
      maxFileSizeRules: [
        (v) => {
          if (this.fileSizeLimit != 0) {
            return parseFloat(v) <= this.fileSizeLimit && parseFloat(v) > 0 || this.$t("media.userStorage.sizeLimitExceeded");
          } else {
            return true
          }
        }
      ],
      fileExpirationTimeRules: [
        (v) => {
          if (this.fileExpirationLimit != 0) {
            return parseInt(v) <= this.fileExpirationLimit && parseFloat(v) > 0 || this.$t("media.userStorage.fileExpirationTimeExceeded")
          } else {
            return true
          }
        }
      ]
    }
  },
  computed: {
    form: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    error: {
      get() {
        return this.inputErrors
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    form: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    },
    // No pueden estar los dos flags prendidos ni apagados simultaneamente
    'form.deleteByCreatedAt': function (newVal, oldVal) {
      if (oldVal == false && newVal == true && this.form.deleteByLastAccess) {
        this.form.deleteByLastAccess = false
      } else if (oldVal == true && newVal == false && this.form.deleteByLastAccess == false) {
        this.form.deleteByLastAccess = true
      }
    },
    'form.deleteByLastAccess': function (newVal, oldVal) {
      if (oldVal == false && newVal == true && this.form.deleteByCreatedAt) {
        this.form.deleteByCreatedAt = false
      } else if (oldVal == true && newVal == false && this.form.deleteByCreatedAt == false) {
        this.form.deleteByCreatedAt = true
      }
    }
  },

}
</script>
