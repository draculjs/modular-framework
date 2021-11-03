<template>
    <v-container>
        <v-form ref="form" autocomplete="off" @submit.prevent="$emit('save')">
        <v-row> 
            <v-col cols="12">
                <span class="headline black--text">{{$t('media.userStorage.cliente')}}: {{form.name}}</span>
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
                <span class="headline black--text">{{$t('media.userStorage.usedPercentage')}} {{percentageUsed(form)}}</span>
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
                ></v-text-field>
            </v-col>
            <v-col cols="6" class="ml-12">
                <!-- <v-checkbox
                    v-model="form.facialRecognition"
                    :label="$t('renaper.asignOperations.facial')"
                    dense hide-details
                ></v-checkbox> -->
                <span class="headline black--text">{{$t('media.userStorage.fileSizeLimit')}}</span>
            </v-col>   
        </v-row>
        </v-form>
    </v-container>
</template>
<script>

    export default {
        name: "UserStorageForm",
        props: {
            value:{
                type: Object,
                required: true
            },
            inputErrors: Object,
            fileSizeLimit: Number
        },
        methods: {
          percentageUsed(form){
            return form.capacity > 0 ? parseFloat(form.usedSpace * 100 / form.capacity).toFixed(2) + "%" : "-"
          },    
        },
        data () {
            return {
                maxFileSize: 0,
                storageRules: [
                    (v) =>
                    parseFloat(v) >= this.form.usedSpace || this.$t("media.userStorage.insufficientCapacity"),
                ],
                maxFileSizeRules: [
                    (v) =>
                    parseFloat(v) <= this.fileSizeLimit || this.$t("media.userStorage.sizeLimitExceeded"),
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
            error:{
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
            }
        },
        
    }
</script>
