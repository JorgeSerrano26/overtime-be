import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { ChangeMatchStatusDto } from './dto/change-status.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @Roles('admin')
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Public()
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
    @Query('zoneId') zoneId?: string,
    @Query('venueId') venueId?: string,
    @Query('matchType') matchType?: string,
  ) {
    return this.matchesService.findAll(paginationDto, {
      status,
      categoryId,
      zoneId,
      venueId,
      matchType,
    });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Patch(':id/status')
  @Roles('admin')
  changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeMatchStatusDto,
  ) {
    return this.matchesService.changeStatus(id, changeStatusDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.matchesService.remove(id);
  }

  @Post(':id/announcements')
  @Roles('admin')
  createAnnouncement(
    @Param('id') matchId: string,
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.matchesService.createAnnouncement(
      matchId,
      createAnnouncementDto,
      userId,
    );
  }

  @Public()
  @Get(':id/announcements')
  getAnnouncements(@Param('id') matchId: string) {
    return this.matchesService.getAnnouncements(matchId);
  }
}
