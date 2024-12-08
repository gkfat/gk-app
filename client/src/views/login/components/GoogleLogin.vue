<template>
    <v-row>
        <v-col cols="12">
            <GoogleLogin :callback="handleGoogleLogin" />
            <!-- <v-btn color="primary" class="text-none" variant="outlined" rounded="lg" block>
                <GoogleLogin :callback="handleGoogleLogin">
                    使用 Google 繼續
                </GoogleLogin>
            </v-btn> -->
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import { CallbackTypes } from 'vue3-google-login';

const emit = defineEmits(['update:credential'])

const handleGoogleLogin: CallbackTypes.CredentialCallback = async (res: any) => {
    try {
        const credential = res?.credential;

        if (credential) {
            emit('update:credential', credential)
        }
    } catch (err) {
        console.error(err)
    }
}
</script>
<style lang="scss" scoped>
.g-btn-wrapper {
    width: 100%;

    iframe {
        width: 100%;

        #container {
            width: 100%;
        }
    }
}
</style>