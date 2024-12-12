import { Response } from 'express';
import { RequirePermissions } from 'src/decorators/require-permissions.decorators';
import {
    $TokenPayload,
    ITokenPayload,
} from 'src/decorators/token-payload.decorators';
import { Permissions } from 'src/enums/permissions';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';

import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
} from '@nestjs/swagger';

import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { CreateTradeRecordDto } from './dto/create-trade-record.dto';
import { PortfolioDto } from './dto/portfolio.dto';
import { QuoteTicker } from './dto/quote-ticker.dto';
import { GetTickersResponse } from './dto/ticker.dto';
import { Portfolio } from './enities/portfolio.entity';
import { TradeRecord } from './enities/trade-record.entity';
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

    @Post('trade-records/create')
    @UseGuards(AuthGuard, PermissionsGuard)
    @RequirePermissions(Permissions.portfolio.portfolios.add)
    @ApiOkResponse({ type: TradeRecord })
    async createTradeRecord(
        @$TokenPayload() payload: ITokenPayload | null,
        @Body() createTradeRecord: CreateTradeRecordDto,
        @Res() res: Response<TradeRecord>,
    ) {
        const { scope: { sub } } = payload;

        // 驗證 portfolio 所有權
        const portfolios = await this.portfoliosService.listPortfoliosByAccountId(+sub);
        const findPortfolio = portfolios.find((p) => p.id === createTradeRecord.portfolioId);

        if (!findPortfolio) {
            throw new NotFoundException(`Portfolio id ${createTradeRecord.portfolioId} not found`);
        }

        const result = await this.portfoliosService.createTradeRecord(createTradeRecord);

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
