import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { SportsModule } from './sports/sports.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { VenuesModule } from './venues/venues.module';
import { MatchesModule } from './matches/matches.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { FixturesModule } from './fixtures/fixtures.module';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import supabaseConfig from './config/supabase.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, supabaseConfig],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{
          ttl: config.get<number>('app.throttle.ttl') || 60,
          limit: config.get<number>('app.throttle.limit') || 100,
        }],
      }),
    }),
    DatabaseModule,
    AuthModule, // Maneja Profile + 2 flujos de registro
    PlayersModule, // Maneja Players vinculados a Profile
    TeamsModule,
    SportsModule,
    TournamentsModule, // Maneja Torneos, Categorías y Zonas
    VenuesModule, // Maneja Canchas y Locaciones
    MatchesModule, // Maneja Partidos y Comunicados
    RegistrationsModule, // Maneja Inscripciones de Equipos a Torneos
    FixturesModule, // Maneja Fixture, Standings y Playoffs
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
