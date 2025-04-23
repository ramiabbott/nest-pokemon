import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfig } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import Joi from 'joi';

@Module({
  imports: [
    // Carga el módulo de configuración global, con esquema de validación usando Joi
    ConfigModule.forRoot({
      load: [envConfig],                     // Permite cargar configuración personalizada
      validationSchema: JoiValidationSchema, // Valida que existan y sean válidas las variables de entorno
      isGlobal: true,                         // Hace que ConfigService esté disponible en todos los módulos sin necesidad de importarlo manualmente
    }),

    // Sirve archivos estáticos desde la carpeta 'public'
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    // Configura la conexión a MongoDB usando variables del entorno, a través del ConfigService
    MongooseModule.forRootAsync({
      inject: [ConfigService], // Inyectamos el servicio de configuración para acceder a variables del entorno
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB'), // Obtenemos la URI desde el entorno
        dbName: 'pokemon',                         // Nombre de la base de datos
      }),
    }),

    // Módulos propios del proyecto
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
  controllers: [], // No hay controladores definidos en AppModule
  providers: [],   // No hay proveedores definidos en AppModule
})
export class AppModule {}
