import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost:27017/sfdrive", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    UsersModule,
    FilesModule,
  ],
  controllers: [AppController,],
  providers: [AppService,],
})
export class AppModule { }