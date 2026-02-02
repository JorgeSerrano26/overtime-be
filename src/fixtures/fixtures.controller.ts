import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FixturesService } from './fixtures.service';
import {
  GeneratePlayoffsDto,
  UpdatePlayoffConfigDto,
  SeedingMethod,
} from './dto/generate-playoffs.dto';

@Controller('fixtures')
export class FixturesController {
  constructor(private readonly fixturesService: FixturesService) {}

  /**
   * Get standings for a category
   * GET /fixtures/categories/:categoryId/standings
   */
  @Get('categories/:categoryId/standings')
  async getStandings(@Param('categoryId') categoryId: string) {
    return this.fixturesService.getStandings(categoryId);
  }

  /**
   * Get playoff status for a category
   * GET /fixtures/categories/:categoryId/playoffs/status
   */
  @Get('categories/:categoryId/playoffs/status')
  async getPlayoffStatus(@Param('categoryId') categoryId: string) {
    return this.fixturesService.getPlayoffStatus(categoryId);
  }

  /**
   * Get playoff bracket for a category
   * GET /fixtures/categories/:categoryId/playoffs/bracket
   */
  @Get('categories/:categoryId/playoffs/bracket')
  async getPlayoffBracket(@Param('categoryId') categoryId: string) {
    return this.fixturesService.getPlayoffBracket(categoryId);
  }

  /**
   * Preview playoff seeds (without generating)
   * GET /fixtures/categories/:categoryId/playoffs/seeds/preview
   */
  @Get('categories/:categoryId/playoffs/seeds/preview')
  async previewPlayoffSeeds(
    @Param('categoryId') categoryId: string,
    @Query('teamsPerZone') teamsPerZone?: string,
    @Query('seedingMethod') seedingMethod?: SeedingMethod,
  ) {
    return this.fixturesService.getPlayoffSeedsPreview(
      categoryId,
      teamsPerZone ? parseInt(teamsPerZone, 10) : undefined,
      seedingMethod,
    );
  }

  /**
   * Update playoff configuration
   * PUT /fixtures/categories/:categoryId/playoffs/config
   */
  @Put('categories/:categoryId/playoffs/config')
  async updatePlayoffConfig(
    @Param('categoryId') categoryId: string,
    @Body() config: UpdatePlayoffConfigDto,
  ) {
    return this.fixturesService.updatePlayoffConfig(categoryId, config);
  }

  /**
   * Mark regular phase as complete
   * POST /fixtures/categories/:categoryId/regular-phase/complete
   */
  @Post('categories/:categoryId/regular-phase/complete')
  @HttpCode(HttpStatus.OK)
  async completeRegularPhase(@Param('categoryId') categoryId: string) {
    return this.fixturesService.completeRegularPhase(categoryId);
  }

  /**
   * Generate playoffs for a category
   * POST /fixtures/categories/:categoryId/playoffs/generate
   */
  @Post('categories/:categoryId/playoffs/generate')
  @HttpCode(HttpStatus.CREATED)
  async generatePlayoffs(
    @Param('categoryId') categoryId: string,
    @Body() dto: Omit<GeneratePlayoffsDto, 'categoryId'>,
  ) {
    return this.fixturesService.generatePlayoffs({
      ...dto,
      categoryId,
    });
  }

  /**
   * Reset/delete playoffs for a category
   * DELETE /fixtures/categories/:categoryId/playoffs
   */
  @Delete('categories/:categoryId/playoffs')
  @HttpCode(HttpStatus.OK)
  async resetPlayoffs(@Param('categoryId') categoryId: string) {
    return this.fixturesService.resetPlayoffs(categoryId);
  }

  /**
   * Notify that a playoff match has finished (to advance winners)
   * POST /fixtures/matches/:matchId/advance
   */
  @Post('matches/:matchId/advance')
  @HttpCode(HttpStatus.OK)
  async advanceWinner(@Param('matchId') matchId: string) {
    return this.fixturesService.onPlayoffMatchFinished(matchId);
  }
}
