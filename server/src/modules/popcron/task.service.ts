import { Queue } from 'bullmq';
import { APP_QUEUE_NAME } from 'src/constants/queue';
import { TaskState } from 'src/enums/task-state.enum';
import {
    LessThanOrEqual,
    Repository,
} from 'typeorm';

import { InjectQueue } from '@nestjs/bullmq';
import {
    Injectable,
    Logger,
} from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

import { ScheduledApi } from './entities/scheduled-api';
import { ScheduledApiLog } from './entities/scheduled-api-log';
import { ScheduledApiTask } from './entities/scheduled-api-task';

@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);
    
    constructor(
        @InjectRepository(ScheduledApi)
        private scheduledApiRepo: Repository<ScheduledApi>,
        @InjectRepository(ScheduledApiTask)
        private scheduledApiTaskRepo: Repository<ScheduledApiTask>,
        @InjectRepository(ScheduledApiLog)
        private scheduledApiLogRepo: Repository<ScheduledApiLog>,
        @InjectQueue(APP_QUEUE_NAME) private readonly queue: Queue,
    ) {}

    /**
     * 任務排程器
     * 從 scheduled_api 蒐集要執行的 task
     */
    @Interval(60 * 1000)
    async collectTasks() {
        const allActiveApis = await this.scheduledApiRepo.find({ where: { is_active: true } });

        for (const api of allActiveApis) {
            const latestTask = await this.scheduledApiTaskRepo.findOne({
                where: { scheduled_api_id: api.id },
                order: { execute_at: 'desc' },
            });

            const nextTime = latestTask ? new Date(latestTask.execute_at).getTime() + api.interval : new Date().getTime();

            if (nextTime <= new Date().getTime()) {
                const newTask = new ScheduledApiTask({
                    scheduled_api_id: api.id,
                    execute_at: new Date(nextTime),
                    state: TaskState.PENDING,
                });
                
                await this.scheduledApiTaskRepo.insert(newTask);
            }
        }
    }

    /**
     * 任務執行器
     * 從 scheduled_api_task 撈出排程的 task 並丟入 queue
     */
    @Interval(10 * 1000)
    async addTaskToQueue() {
        const now = new Date();
        const tasks = await this.scheduledApiTaskRepo.find({
            where: {
                execute_at: LessThanOrEqual(now),
                state: TaskState.PENDING,
            },
        });

        for (const task of tasks) {
            try {
                await this.scheduledApiTaskRepo.update(task.id, { state: TaskState.QUEUED });
                await this.queue.add(APP_QUEUE_NAME, task, {
                    attempts: 3,
                    backoff: {
                        type: 'fixed',
                        delay: 10000,
                    },
                    removeOnComplete: true,
                    removeOnFail: false,
                });
            } catch (err) {
                this.logger.error(`Failed to queue task ${task.id}: ${err.message}`);
            }
        
        }
    }

}
