import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder/seeder.module';
import { Seeder } from './seeder/seeder';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const seeder = appContext.get(Seeder);
      seeder
        .seed()
        .then(() => {
          console.log('Seeding complete!');
        })
        .catch((error) => {
          console.log('Seeding failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}

bootstrap();
