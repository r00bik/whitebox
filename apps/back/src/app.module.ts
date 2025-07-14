import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { ContactsModule } from "./contacts/contacts.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ContactsModule,
    HealthModule,
  ],
})
export class AppModule {}
