<template>
    <v-card elevation="2">
        <v-card-title>
            個人資訊
           
            <!-- <v-col
                    cols="auto"
                    class="ml-auto"
                >
                    <v-btn
                        color="primary"
                        prepend-icon="mdi-pencil"
                    >
                        編輯
                    </v-btn>
                </v-col> -->
        </v-card-title>

        <v-divider />
        
        <v-card-text>
            <v-row class="align-center">
                <v-col
                    cols="4"
                    sm="3"
                    class="text-secondary text-no-wrap"
                >
                    頭像
                </v-col>

                <v-col>
                    <v-avatar
                        color="primary"
                        rounded="lg"
                    >
                        <v-img
                            v-if="account.avatar"
                            alt="avatar"
                            :src="account.avatar"
                        />

                        <v-icon
                            v-else
                            icon="mdi-account"
                        />
                    </v-avatar>
                </v-col>
            </v-row>
            
            <v-row class="align-center">
                <v-col
                    cols="4"
                    sm="3"
                    class="text-secondary text-no-wrap"
                >
                    編號
                </v-col>
                <v-col>
                    {{ account.id }}
                </v-col>
            </v-row>
            
            <v-row class="align-center">
                <v-col
                    cols="4"
                    sm="3"
                    class="text-secondary text-no-wrap"
                >
                    使用者名稱
                </v-col>

                <v-col>
                    {{ account.name }}
                </v-col>
            </v-row>

            <v-row class="align-center">
                <v-col
                    cols="4"
                    sm="3"
                    class="text-secondary text-no-wrap"
                >
                    Email
                </v-col>

                <v-col>
                    {{ account.email }}
                </v-col>
            </v-row>

            <v-row class="align-center">
                <v-col
                    cols="4"
                    sm="3"
                    class="text-secondary text-no-wrap"
                >
                    角色
                </v-col>

                <v-col class="d-flex align-center ga-3">
                    <v-chip
                        v-for="(role) in account.roles"
                        :key="role.id"
                    >
                        {{ t(`role.${role.role}`) }}
                    </v-chip>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import { Account } from '@/types/account';

defineProps<{
    account: Account.Account;
}>();

const { t } = useI18n();
</script>