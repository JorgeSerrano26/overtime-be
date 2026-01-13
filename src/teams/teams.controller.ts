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
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddPlayerDto } from './dto/add-player.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(
    @Body() createTeamDto: CreateTeamDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.teamsService.create(createTeamDto, userId);
  }

  @Public()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.teamsService.findAll(paginationDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    // TODO: Verificar que el usuario es el creador del equipo o admin
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // TODO: Verificar que el usuario es el creador del equipo o admin
    return this.teamsService.remove(id);
  }

  @Post(':id/players')
  addPlayer(@Param('id') id: string, @Body() addPlayerDto: AddPlayerDto) {
    // TODO: Verificar que el usuario es el creador del equipo o admin
    return this.teamsService.addPlayer(id, addPlayerDto);
  }

  @Delete(':id/players/:playerId')
  removePlayer(@Param('id') id: string, @Param('playerId') playerId: string) {
    // TODO: Verificar que el usuario es el creador del equipo o admin
    return this.teamsService.removePlayer(id, playerId);
  }

  @Patch(':id/captain/:playerId')
  assignCaptain(@Param('id') id: string, @Param('playerId') playerId: string) {
    // TODO: Verificar que el usuario es el creador del equipo o admin
    return this.teamsService.assignCaptain(id, playerId);
  }
}
