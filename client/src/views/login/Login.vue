<template>
    <v-container class="fill-height d-flex align-center">
        <v-row justify="center">
            <v-card
                :width="!smAndUp ? '90%' : 450"
                elevation="10"
                rounded="xl"
                class="pa-7 pb-3"
            >
                <v-card-title class="text-h5 mb-3 text-center">
                    {{ appStore.state.environmentVariables.appTitle }}
                </v-card-title>

                <v-tabs-window
                    v-model="currentTab"
                    @update:model-value="onTabChange"
                >
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
                                rounded="lg"
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
                                color="primary"
                                rounded="lg"
                                :loading="loading"
                                block
                                @click="onSubmit"
                            >
                                {{ t('login.button_signup') }}
                            </v-btn>
                        </v-card-text>
                    </v-tabs-window-item>

                    <!-- 驗證碼 -->
                    <v-tabs-window-item value="verification_code">
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
                                    <!-- 驗證碼 -->
                                    <v-col cols="12">
                                        <p class="text-caption">
                                            {{ t('login.label_verification_code') }}
                                        </p>
                                        <v-text-field
                                            v-model="form.verificationCode.value.value"
                                            :error-messages="form.verificationCode.errorMessage.value"
                                            hide-details="auto"
                                            :placeholder="t('login.input_label_verification_code')"
                                            required
                                            variant="underlined"
                                        />
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>

                        <v-card-text>
                            <v-btn
                                color="secondary"
                                rounded="lg"
                                class="mb-3"
                                :loading="loading"
                                block
                                @click="onResendVerificationCodeClick"
                            >
                                {{ t('login.button_resend_verification_code') }}
                            </v-btn>
                            <v-btn
                                color="primary"
                                :disabled="!form.verificationCode"
                                rounded="lg"
                                :loading="loading"
                                block
                                @click="onSubmit"
                            >
                                {{ t('button.submit') + t('login.label_verification_code') }}
                            </v-btn>
                        </v-card-text>
                    </v-tabs-window-item>
                </v-tabs-window>
              
                <template v-if="currentTab !== 'verification_code'">
                    <v-divider>或</v-divider>
                    
                    <v-card-text>
                        <GoogleLogin @update:credential="onGoogleLogin" />
                    </v-card-text>
                </template>

                <v-tabs
                    v-model="currentTab"
                    class="mt-5"
                    align-tabs="center"
                    hide-slider
                >
                    <v-tab
                        v-if="currentTab !== 'signup'"
                        value="signup"
                        class="text-info"
                        variant="plain"
                        :ripple="false"
                    >
                        {{ t('login.button_signup') }}
                    </v-tab>
                    <v-tab
                        v-if="currentTab !== 'login'"
                        value="login"
                        class="text-info"
                        variant="plain"
                        :ripple="false"
                    >
                        {{ t('login.button_login') }}
                    </v-tab>
                    <v-tab
                        v-if="currentTab !== 'verification_code'"
                        value="verification_code"
                        class="text-info"
                        variant="plain"
                        :ripple="false"
                    >
                        {{ t('login.button_resend_verification_code') }}
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
import { useDisplay } from 'vuetify';
import * as yup from 'yup';

import { AuthService } from '@/api/auth';
import { EnumLoginType } from '@/enums/login-type';
import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';
import { useNotifierStore } from '@/store/notifier';
import { Auth } from '@/types/auth';
import { REGEX_PASSWORD } from '@/utils/credential';

import GoogleLogin from './components/GoogleLogin.vue';

const { t } = useI18n();
const { smAndUp } = useDisplay();
const authStore = useAuthStore();
const notifierStore = useNotifierStore();
const router = useRouter();
const route = useRoute();
const showPassword = ref(false);
const appStore = useAppStore();

const currentTab = ref<'login' | 'signup' | 'verification_code'>('login');

const loading = ref(false);
const isVerificationCodeSent = ref(false);

const {
    handleSubmit, resetField, 
} = useForm({
    initialValues: {
        email: '',
        password: '',
        name: '',
        passwordConfirm: '',
        verificationCode: '',
    },
    validationSchema: yup.object({
        email: yup
            .string()
            .required(t('input.error_required')),
        name: yup
            .string()
            .test('require', t('input.error_required'), (value) => {
                if (currentTab.value === 'signup') {
                    return value.trim().length > 0;
                }
                
                return true;
            }),
        password: yup
            .string()
            .required(t('input.error_required'))
            .matches(REGEX_PASSWORD, '密碼必須由 6~10 位英數字組成'),
        passwordConfirm: yup
            .string()
            .test('require', t('input.error_required'), (value) => {
                if (currentTab.value === 'signup') {
                    return value.trim().length > 0;
                }

                return true;
            })
            .test('must-same', '需與密碼一致', (value, ctx) => {
                if (currentTab.value === 'signup') {

                    return ctx.parent?.password && ctx.parent.password === value;
                }

                return true;
            }),
        verificationCode: yup
            .string()
            .test('require', t('input.error_required'), (value) => {
                if (currentTab.value === 'verification_code') {
                    return value.trim().length > 0;
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
    verificationCode: useField<string>('verificationCode'),
};

const doLogin = async (data: Auth.Login.Request) => {
    try {
        const account = await authStore.login(data);

        notifierStore.success({ content: `歡迎回來，${account.name}` });

        // change route
        const redirect = route.query.redirect as string ?? '/';

        router.push(redirect);
    } catch (err) {
        console.error(err);
        notifierStore.error({ content: t('login.message_login_fail') });
    }
};

const onResendVerificationCodeClick = async () => {
    loading.value = true;
    const params: Auth.SendVerificationCode.Request = { email: form.email.value.value };

    try {
        await AuthService.sendVerificationCode(params);

        notifierStore.success({ content: t('login.message_send_verification_code_success') });

        isVerificationCodeSent.value = true;
    } catch (err) {
        console.error(err);
        notifierStore.error({ content: t('login.message_send_verification_code_fail') });
    }

    loading.value = false;
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
    }
    // 註冊
    else if (currentTab.value === 'signup') {
        const params: Auth.SignUp.Request = {
            email: value.email,
            name: value.name,
            password: value.password,
        };
    
        try {
            await AuthService.signUp(params);
    
            notifierStore.success({ content: t('login.message_signup_success') });

            isVerificationCodeSent.value = true;
            currentTab.value = 'verification_code';
        } catch (err) {
            console.error(err);
            notifierStore.error({ content: t('login.message_sugnup_fail') });
        }
    }
    // 填驗證碼
    else if (currentTab.value === 'verification_code') {
        const params: Auth.VerifyCode.Request = {
            email: value.email,
            verificationCode: value.verificationCode,
        };

        try {
            await AuthService.verifyCode(params);

            notifierStore.success({ content: t('login.message_verify_account_success') });

            currentTab.value = 'login';
        } catch (err) {
            console.error(err);
            notifierStore.error({ content: t('login.message_verify_account_fail') });
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

const onTabChange = () => {
    if (currentTab.value === 'verification_code') {
        resetField('verificationCode');
    } else if (currentTab.value === 'signup') {
        resetField('email');
        resetField('passwordConfirm');
    }
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