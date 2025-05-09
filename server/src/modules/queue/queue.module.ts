import { APP_QUEUE_NAME } from 'src/constants/queue';

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { QueueProcessor } from './queue.processor';

@Module({
    imports: [BullModule.registerQueue({ name: APP_QUEUE_NAME })],
    controllers: [],
    providers: [QueueProcessor],
    exports: [BullModule],
})
export class QueueModule {}
