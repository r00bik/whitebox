import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { ContactsController } from "./contacts.controller";
import { ContactsService } from "./contacts.service";

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
