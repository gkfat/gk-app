<template>
    <DialogCard
        ref="dialogCardRef"
        :in-progress="inProgress"
        :max-width="500"
        :activator-config="{
            useIconActivator: true,
            activatorIcon: 'mdi-pencil'
        }"
        :dialog-config="{
            title: t('edit_profile.title'),
            color: 'warn',
            readonly: false,
        }"
        @dialog:init="resetForm"
        @update:submit="submit"
    >
        <template #default>
            <v-form validate-on="input">
                <!-- Old Password -->
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="form.oldPassword.value.value"
                            rounded="lg"
                            variant="outlined"
                            :label="t('edit_profile.input_label_old_password')"
                            :error-messages="form.oldPassword.errorMessage.value"
                            hide-details="auto"
                            prepend-icon="mdi-lock"
                            required
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="showPassword ? 'text' : 'password'"
                            @click:append-inner="showPassword = !showPassword"
                        />
                    </v-col>
                </v-row>
                <!-- New Password -->
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="form.newPassword.value.value"
                            :label="t('edit_profile.input_label_new_password')"
                            rounded="lg"
                            variant="outlined"
                            :error-messages="form.newPassword.errorMessage.value"
                            hide-details="auto"
                            prepend-icon="mdi-lock"
                            required
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="showPassword ? 'text' : 'password'"
                            @click:append-inner="showPassword = !showPassword"
                        />
                    </v-col>
                </v-row>
                <!-- New Password Confirm -->
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="form.newPasswordConfirm.value.value"
                            :error-messages="form.newPasswordConfirm.errorMessage.value"
                            rounded="lg"
                            variant="outlined"
                            :label="t('edit_profile.input_label_new_password_confirm')"
                            hide-details="auto"
                            prepend-icon="mdi-lock"
                            required
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="showPassword ? 'text' : 'password'"
                            @click:append-inner="showPassword = !showPassword"
                        />
                    </v-col>
                </v-row>
            </v-form>
        </template>
    </DialogCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import {
    useField,
    useForm,
} from 'vee-validate';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

import { templateRef } from '@vueuse/core';
import { UserService } from '@/api/user';
import DialogCard from '@/components/common/DialogCard.vue';
import { useAuthStore } from '@/store/auth';
import { useNotifierStore } from '@/store/notifier';
import { User } from '@/types/user';

const { t } = useI18n();
const notifierStore = useNotifierStore();
const authStore = useAuthStore();
const inProgress = ref(false);
const showPassword = ref(false);

const dialogCardRef = templateRef('dialogCardRef');

const { user } = defineProps<{
    user: User.User
}>();

const {
    handleSubmit, resetForm, 
} = useForm({
    validationSchema: yup.object({
        oldPassword: yup
            .string()
            .required(t('input.error_required')),
        newPassword: yup
            .string()
            .notOneOf(
                [yup.ref('oldPassword')],
                t('edit_profile.error_same_password'),
            )
            .required(t('input.error_required')),
        newPasswordConfirm: yup
            .string()
            .oneOf(
                [yup.ref('newPassword')],
                t('edit_profile.error_new_password_confirm'),
            )
            .required(t('input.error_required')),
    }),
});

const form = {
    oldPassword: useField('oldPassword'),
    newPassword: useField('newPassword'),
    newPasswordConfirm: useField('newPasswordConfirm'),
};

const emit = defineEmits(['update:profile']);

const emitAndClose = () => {
    dialogCardRef.value?.close();
    emit('update:profile');
};

const submit = handleSubmit(async (formValue) => {
    inProgress.value = true;

    try {
        const {
            newPassword, oldPassword, 
        } = formValue;
        const params: User.UpdateProfileReq = {
            name: user.name,
            old_password: oldPassword,
            new_password: newPassword,
        };

        const { data: { token } } = await UserService.updateProfile(params);

        authStore.setToken(token);

        notifierStore.success({ content: t('edit_profile.message_update_profile_success') });

        emitAndClose();
    } catch (err) {
        console.error(err);
        notifierStore.error({ content: t('edit_profile.message_update_profile_fail') });
    }

    inProgress.value = false;
});
</script>
