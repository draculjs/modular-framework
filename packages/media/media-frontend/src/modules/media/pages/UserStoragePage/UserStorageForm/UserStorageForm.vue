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
                    :label="$t('media.userStorage.capacity')"
                    dense hide-details
                    suffix="MB"
                    
                ></v-text-field>
            </v-col>
            <v-col cols="6" class="ml-12">
                <!-- <v-checkbox
                    v-model="form.facialRecognition"
                    :label="$t('renaper.asignOperations.facial')"
                    dense hide-details
                ></v-checkbox> -->
                <span class="headline black--text">{{$t('media.userStorage.usedPercentage')}} {{form.usedSpace/form.capacity}}%</span>
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
