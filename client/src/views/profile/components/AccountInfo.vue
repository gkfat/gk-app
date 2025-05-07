<template>
    <v-card elevation="2">
        <v-card-title>
            <v-row class="align-center">
                <v-col
                    class="text-h6"
                    cols="auto"
                >
                    Account Information
                </v-col>
                <v-col
                    cols="auto"
                    class="ml-auto"
                >
                    <v-btn
                        color="primary"
                        prepend-icon="mdi-pencil"
                    >
                        編輯
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>

        <v-divider />
        
        <v-card-text>
            {{ account.email }}
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import { Account } from '@/types/account';

const account = defineModel<Account.Account>('account');
</script>