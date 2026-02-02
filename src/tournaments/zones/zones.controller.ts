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
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { AssignTeamDto } from './dto/assign-team.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('categories/:categoryId/zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @Roles('admin')
  create(
    @Param('categoryId') categoryId: string,
    @Body() createZoneDto: CreateZoneDto,
  ) {
    return this.zonesService.create({
      ...createZoneDto,
      categoryId,
    });
  }

  @Public()
  @Get()
  findAll(
    @Param('categoryId') categoryId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.zonesService.findAll(categoryId, paginationDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zonesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateZoneDto: UpdateZoneDto) {
    return this.zonesService.update(id, updateZoneDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.zonesService.remove(id);
  }

  @Post(':id/teams')
  @Roles('admin')
  assignTeam(
    @Param('id') zoneId: string,
    @Body() assignTeamDto: AssignTeamDto,
  ) {
    return this.zonesService.assignTeam(zoneId, assignTeamDto);
  }

  @Delete(':id/teams/:teamId')
  @Roles('admin')
  removeTeam(@Param('id') zoneId: string, @Param('teamId') teamId: string) {
    return this.zonesService.removeTeam(zoneId, teamId);
  }
}
