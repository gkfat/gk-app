import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'RegisterScheduledApisRequest' })
export class RegisterScheduledApisRequestDto {
    @ApiProperty({
        description: '要新增排程呼叫的 API url', required: true, 
    })
        apiUrl: string;

    @ApiProperty({
        description: '任務完成後的呼叫', required: false, 
    })
        task_completed_webhook_rul: string;

    @ApiProperty({
        description: '此 Url 描述', required: false, 
    })
        description?: string;
}