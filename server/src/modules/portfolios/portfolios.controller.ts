import { OperationLog } from 'src/decorators/operation-log.decorators';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import {
    $TokenPayload,
    ITokenPayload,
} from 'src/decorators/token-payload.decorators';
import { Permissions } from 'src/enums';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    getSchemaPath,
} from '@nestjs/swagger';

import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DeletePositionDto } from './dto/delete-position.dto';
import { PortfolioDto } from './dto/portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';
import {
    CashTradeRecord,
    FXTradeRecord,
    StockTradeRecord,
} from './entities/trade-record.entity';
import { PortfoliosService } from './portfolios.service';

@ApiBearerAuth('Authorization')
@Controller('portfolios')
export class PortfoliosController {
    constructor(
        private readonly portfoliosService: PortfoliosService,
    ) {}

    @Get()
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.get)
    @ApiOkResponse({ type: [PortfolioDto] })
    async listPortfolios(@$TokenPayload() payload: ITokenPayload | null) {
        const { scope: { sub } } = payload;

        const result = await this.portfoliosService.listPortfoliosByAccountId(+sub);

        return result;
    }

    @OperationLog()
    @Post('create')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.add)
    @ApiOkResponse({ type: PortfolioDto })
    async createPortfolio(
        @$TokenPayload() payload: ITokenPayload | null,
        @Body() createPortfolioDto: CreatePortfolioDto,
    ) {
        const { scope: { sub } } = payload;

        const result = await this.portfoliosService.createPortfolio(+sub, createPortfolioDto);

        return result;
    }

    @OperationLog()
    @Put(':id')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.update)
    @ApiOkResponse({ type: PortfolioDto })
    async updatePortfolio(
        @$TokenPayload() payload: ITokenPayload | null,
        @Param('id') id: string, 
        @Body() updatePortfolioDto: UpdatePortfolioDto,
    ) {
        const { scope: { sub } } = payload;

        const findPortfolio = await this.portfoliosService.findOne(+id);

        if (!findPortfolio) {
            throw new NotFoundException(`Portfolio ${id} not found`);
        }

        if (findPortfolio.account_id !== +sub) {
            throw new ForbiddenException('Invalid operation');
        }

        const result = await this.portfoliosService.updatePortfolio(+id, updatePortfolioDto);

        return result;
    }
    
    @OperationLog()
    @Delete(':id')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.delete)
    @ApiOkResponse({ type: Portfolio })
    async deletePortfolio(
        @$TokenPayload() payload: ITokenPayload | null,
        @Param('id') id: string,
    ) {
        const { scope: { sub } } = payload;

        const findPortfolio = await this.portfoliosService.findOne(+id);

        if (!findPortfolio) {
            throw new NotFoundException(`Portfolio ${id} not found`);
        }

        if (findPortfolio.account_id !== +sub) {
            throw new ForbiddenException('Invalid operation');
        }

        const result = await this.portfoliosService.deletePortfolio(+id);

        return result;
    }

    @OperationLog()
    @Post('transactions/create')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.add)
    @ApiOkResponse({
        schema: {
            oneOf: [
                { $ref: getSchemaPath(StockTradeRecord) },
                { $ref: getSchemaPath(FXTradeRecord) },
                { $ref: getSchemaPath(CashTradeRecord) },
            ],
        }, 
    })
    async createTransaction(
        @$TokenPayload() payload: ITokenPayload | null,
        @Body() createTransactionDto: CreateTransactionDto,
    ) {
        const { scope: { sub } } = payload;

        // 驗證 portfolio 所有權
        const portfolios = await this.portfoliosService.listPortfoliosByAccountId(+sub);
        const findPortfolio = portfolios.find((p) => p.id === createTransactionDto.portfolioId);

        if (!findPortfolio) {
            throw new NotFoundException(`Portfolio id ${createTransactionDto.portfolioId} not found`);
        }

        const result = await this.portfoliosService.createTransaction(createTransactionDto);

        return result;
    }

    @OperationLog()
    @Delete(':id/position')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.delete)
    @ApiOkResponse({ type: Portfolio })
    async deletePosition(
        @$TokenPayload() payload: ITokenPayload | null,
        @Param('id') id: string, 
        @Body() deletePositionDto: DeletePositionDto,
    ) {
        const { scope: { sub } } = payload;

        const findPortfolio = await this.portfoliosService.findOne(+id);

        if (!findPortfolio) {
            throw new NotFoundException(`Portfolio ${id} not found`);
        }

        if (findPortfolio.account_id !== +sub) {
            throw new ForbiddenException('Invalid operation');
        }

        const result = await this.portfoliosService.deletePosition(+id, deletePositionDto);
        
        return result;
    }

}
