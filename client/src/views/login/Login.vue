<template>
    <v-container class="fill-height d-flex align-center">
        <v-row justify="center">
            <v-card
                min-width="320px"
                elevation="10"
                rounded="xl"
                class="pa-7 pb-3"
            >
                <v-card-title class="text-h5 mb-3 text-center">
                    {{ appStore.state.environmentVariables.appTitle }}
                </v-card-title>

                <v-tabs-window v-model="currentTab">
                    <!-- 登入 -->
                    <v-tabs-window-item value="login">
                        <v-card-text>
                            <v-form validate-on="input">
                                <!-- Email -->
                                <v-row>
                                    <v-col cols="12">
                                        <p class="text-caption">
                                            {{ t('login.input_label_email') }}
                                        </p>
                                        <v-text-field
                                            v-model="form.email.value.value"
                                            :error-messages="form.email.errorMessage.value"
                                            autocomplete="username"
                                            variant="underlined"
                                            hide-details="auto"
                                            :placeholder="t('login.input_label_email')"
                                            autofocus
                                            required
                                        />
                                    </v-col>
        
                                    <!-- Password -->
                                    <v-col cols="12">
                                        <p class="text-caption">
                                            {{ t('login.input_label_password') }}
                                        </p>
                                        <v-text-field
                                            v-model="form.password.value.value"
                                            :error-messages="form.password.errorMessage.value"
                                            autocomplete="current-password"
                                            hide-details="auto"
                                            :placeholder="t('login.input_label_password')"
                                            required
                                            variant="underlined"
                                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                            :type="showPassword ? 'text' : 'password'"
                                            @click:append-inner="showPassword = !showPassword"
                                        />
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
        
                        <v-card-text>
                            <v-btn
                                color="primary"
                                flat
                                rounded="xl"
                                :loading="loading"
                                block
                                @click="onSubmit"
                            >
                                {{ t('login.button_login') }}
                            </v-btn>
                        </v-card-text>
                    </v-tabs-window-item>
                    
                    <!-- 註冊 -->
                    <v-tabs-window-item value="signup">
                        <v-card-text>
                            <v-form validate-on="input">
                                <v-row>
                                    <!-- Email -->
                                    <v-col cols="12">
                                        <p class="text-caption">
                                            {{ t('login.input_label_email') }}
                                        </p>
                                        <v-text-field
                                            v-model="form.email.value.value"
                                            :error-messages="form.email.errorMessage.value"
                                            autocomplete="username"
                                            variant="underlined"
                                            hide-details="auto"
                                            :placeholder="t('login.input_label_email')"
                                            autofocus
                                            required
                                        />
                                    </v-col>

                                    <v-col cols="12">
                                        <p class="text-caption">
                                            {{ t('login.input_label_name') }}
                                        </p>
                                        <v-text-field
                                            v-model="form.name.value.value"
                                            :error-messages="form.name.errorMessage.value"
                                            variant="underlined"
                                            hide-details="auto"
                                            :placeholder="t('login.input_label_name')"
                                            autofocus
                                            required
                                        />
                                    </v-col>
        
                                    <!-- Password -->
                                    <v-col cols="12">
                                        <p class="text-caption">
                                            {{ t('login.input_label_password') }}
                                        </p>
                                        <v-text-field
                                            v-model="form.password.value.value"
                                            :error-messages="form.password.errorMessage.value"
                                            autocomplete="current-password"
                                            hide-details="auto"
                                            :placeholder="t('login.input_label_password')"
                                            required
                                            variant="underlined"
                                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                            :type="showPassword ? 'text' : 'password'"
                                            @click:append-inner="showPassword = !showPassword"
                                        />
                                    </v-col>

                                    <!-- Confirm Password -->
                                    <v-col cols="12">
                                        <p class="text-caption">
                                            {{ t('login.input_label_password_confirm') }}
                                        </p>
                                        <v-text-field
                                            v-model="form.passwordConfirm.value.value"
                                            :error-messages="form.passwordConfirm.errorMessage.value"
                                            autocomplete="current-password"
                                            hide-details="auto"
                                            :placeholder="t('login.input_label_password_confirm')"
                                            required
                                            variant="underlined"
                                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                            :type="showPassword ? 'text' : 'password'"
                                            @click:append-inner="showPassword = !showPassword"
                                        />
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
        
                        <v-card-text>
                            <v-btn
                                color="warning"
                                flat
                                rounded="xl"
                                :loading="loading"
                                block
                                @click="onSubmit"
                            >
                                {{ t('login.button_signup') }}
                            </v-btn>
                        </v-card-text>
                    </v-tabs-window-item>
                </v-tabs-window>

                <v-divider>或</v-divider>

                <v-card-text>
                    <GoogleLogin @update:credential="onGoogleLogin" />
                </v-card-text>

                <v-tabs
                    v-model="currentTab"
                    class="mt-5"
                    align-tabs="center"
                    hide-slider
                >
                    <v-tab
                        v-if="currentTab === 'login'"
                        value="signup"
                        class="text-info"
                        variant="plain"
                        :ripple="false"
                    >
                        {{ t('login.button_signup') }}
                    </v-tab>
                    <v-tab
                        v-if="currentTab === 'signup'"
                        value="login"
                        class="text-info"
                        variant="plain"
                        :ripple="false"
                    >
                        {{ t('login.button_login') }}
                    </v-tab>
                </v-tabs>
            </v-card>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import {
    onMounted,
    ref,
} from 'vue';

import {
    useField,
    useForm,
} from 'vee-validate';
import { useI18n } from 'vue-i18n';
import {
    useRoute,
    useRouter,
} from 'vue-router';
import * as yup from 'yup';

import { AuthService } from '@/api/auth';
import { EnumLoginType } from '@/enums/login-type';
import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';
import { useNotifierStore } from '@/store/notifier';
import { Auth } from '@/types/auth';

import GoogleLogin from './components/GoogleLogin.vue';

const { t } = useI18n();
const authStore = useAuthStore();
const notifierStore = useNotifierStore();
const router = useRouter();
const route = useRoute();
const showPassword = ref(false);
const appStore = useAppStore();

const currentTab = ref<'login' | 'signup'>('login');

const loading = ref(false);

const { handleSubmit } = useForm({
    initialValues: {
        email: '',
        password: '',
        name: '',
        passwordConfirm: '',
    },
    validationSchema: yup.object({
        email: yup
            .string()
            .required(t('input.error_required')),
        password: yup
            .string()
            .required(t('input.error_required')),
        name: yup
            .string()
            .test('require', t('input.error_required'), (value) => {
                if (currentTab.value === 'signup') {
                    return value.length > 0;
                }

                return true;
            }),
        passwordConfirm: yup
            .string()
            .test('require', t('input.error_required'), (value) => {
                if (currentTab.value === 'signup') {
                    return value.length > 0;
                }

                return true;
            }),
    }),
});

const form = {
    email: useField<string>('email'),
    password: useField<string>('password'),
    name: useField<string>('name'),
    passwordConfirm: useField<string>('passwordConfirm'),
};

const doLogin = async (data: Auth.Login.Request) => {
    try {
        await authStore.login(data);

        // change route
        const redirect = route.query.redirect as string ?? '/';

        router.push(redirect);
    } catch (err) {
        notifierStore.error({ content: t('login.message_login_fail') });
    }
};

const onSubmit = handleSubmit(async (value) => {
    loading.value = true;

    if (currentTab.value === 'login') {
        const params: Auth.Login.PasswordLoginRequest = {
            type: EnumLoginType.PASSWORD,
            email: value.email,
            password: value.password,
        };

        await doLogin(params);
    } else if (currentTab.value === 'signup') {
        const params: Auth.SignUp.Request = {
            email: value.email,
            name: value.name,
            password: value.password,
        };
    
        try {
            await AuthService.signUp(params);
    
            notifierStore.success({ content: t('login.message_signup_success') });

            currentTab.value = 'login';
        } catch (err) {
            notifierStore.error({ content: t('login.message_sugnup_fail') });
        }
    }

    loading.value = false;
});

const onGoogleLogin = async (code: string) => {
    const params: Auth.Login.GoogleLoginRequest = {
        type: EnumLoginType.GOOGLE,
        code,
    };

    await doLogin(params);
};

onMounted(() => {
    currentTab.value = 'login';
});
</script>
<style lang="scss" scoped>
.v-field__input {
    padding-top: 0;
}
</style>