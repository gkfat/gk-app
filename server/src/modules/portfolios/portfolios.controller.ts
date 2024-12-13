import { Response } from 'express';
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
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    getSchemaPath,
} from '@nestjs/swagger';

import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PortfolioDto } from './dto/portfolio.dto';
import { QuoteTicker } from './dto/quote-ticker.dto';
import { GetTickersResponse } from './dto/ticker.dto';
import { Portfolio } from './enities/portfolio.entity';
import { PortfoliosService } from './portfolios.service';
import {
    CashTradeRecord,
    FXTradeRecord, StockTradeRecord, 
} from './enities/trade-record.entity';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

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
    async listPortfolios(@$TokenPayload() payload: ITokenPayload | null, @Res() res: Response<PortfolioDto[]>) {
        const { scope: { sub } } = payload;

        const result = await this.portfoliosService.listPortfoliosByAccountId(+sub);

        return res.json(result);
    }

    @Post('create')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.add)
    @ApiOkResponse({ type: Portfolio })
    async createPortfolio(
        @$TokenPayload() payload: ITokenPayload | null,
        @Body() createPortfolioDto: CreatePortfolioDto,
        @Res() res: Response<Portfolio>,
    ) {
        const { scope: { sub } } = payload;

        const result = await this.portfoliosService.createPortfolio(+sub, createPortfolioDto);

        return res.json(result);
    }

    @Put(':id')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.update)
    @ApiOkResponse({ type: Portfolio })
    async updatePortfolio(
        @$TokenPayload() payload: ITokenPayload | null,
        @Param('id') id: string, 
        @Body() updatePortfolioDto: UpdatePortfolioDto,
        @Res() res: Response<Portfolio>,
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

        return res.json(result);
    }
    
    @Delete(':id')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.delete)
    @ApiOkResponse({ type: Portfolio })
    async deletePortfolio(
        @$TokenPayload() payload: ITokenPayload | null,
        @Param('id') id: string, 
        @Res() res: Response<Portfolio>,
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

        return res.json(result);
    }

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
        @Res() res: Response<StockTradeRecord | FXTradeRecord | CashTradeRecord>,
    ) {
        const { scope: { sub } } = payload;

        // 驗證 portfolio 所有權
        const portfolios = await this.portfoliosService.listPortfoliosByAccountId(+sub);
        const findPortfolio = portfolios.find((p) => p.id === createTransactionDto.portfolioId);

        if (!findPortfolio) {
            throw new NotFoundException(`Portfolio id ${createTransactionDto.portfolioId} not found`);
        }

        const result = await this.portfoliosService.createTransaction(createTransactionDto);

        return res.json(result);
    }

    @Get('tickers')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.get)
    @ApiOkResponse({ type: GetTickersResponse })
    async listTickers(@Res() res: Response<GetTickersResponse>) {
        const result = await this.portfoliosService.listTickers();

        return res.json(result);
    }

    @Get('tickers/:ticker/quote')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.get)
    @ApiOkResponse({ type: QuoteTicker })
    async quoteTicler(@Param('ticker') ticker: string, @Res() res: Response<QuoteTicker>) {
        const result = await this.portfoliosService.quoteTicker(ticker);

        return res.json(result);
    }
}
