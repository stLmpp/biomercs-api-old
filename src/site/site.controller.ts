import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { Site } from './site.entity';
import {
  RouteParamId,
  RouteParamTerm,
  RoutePath,
} from '../shared/types/route-enums';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreatedByPipe } from '../shared/pipes/created-by.pipe';
import { SiteAddDto } from './dto/add.dto';
import { UpdateResult } from '../util/types';
import { UpdatedByPipe } from '../shared/pipes/updated-by.pipe';
import { SiteUpdateDto } from './dto/update.dto';
import { Auth } from '../auth/auth.decorator';
import { Roles } from '../auth/role/role.guard';
import { RoleEnum } from '../auth/role/role.enum';

@ApiTags('Site')
@Roles(RoleEnum.admin)
@Auth()
@Controller('site')
export class SiteController {
  constructor(private siteService: SiteService) {}

  @Post()
  add(@Body(CreatedByPipe) dto: SiteAddDto): Promise<Site> {
    return this.siteService.add(dto);
  }

  @Post(RoutePath.batch)
  @ApiBody({ type: SiteAddDto, isArray: true })
  addMany(@Body(CreatedByPipe) dto: SiteAddDto[]): Promise<Site[]> {
    return this.siteService.addMany(dto);
  }

  @Patch(`:${RouteParamId.idSite}`)
  update(
    @Param(RouteParamId.idSite) idSite: number,
    @Body(UpdatedByPipe) dto: SiteUpdateDto
  ): Promise<UpdateResult> {
    return this.siteService.update(idSite, dto);
  }

  @Get(RoutePath.search)
  search(@Query(RouteParamTerm.term) term: string): Promise<Site[]> {
    return this.siteService.search(term);
  }
}
