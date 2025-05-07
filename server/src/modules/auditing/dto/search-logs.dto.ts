import {
    ApiProperty,
    ApiSchema,
} from '@nestjs/swagger';

@ApiSchema({ name: 'SearchLogsRequest' })
export class SearchLogsRequestDto {
    @ApiProperty({ example: '2024-12-11' })
        startDate: string;

    @ApiProperty({ example: '2024-12-11' })
        endDate: string;

    @ApiProperty({
        example: {
            job: 'api-server', level: 'error', 
        }, 
    })
        labels?: Record<string, string>;

    @ApiProperty({ example: 'failed to login' })
        keyword?: string;
}