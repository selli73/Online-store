import { OnModuleInit, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(private _configService: ConfigService) {
        const databaseUrl = _configService.getOrThrow('DATABASE_URL');
        const adapter = new PrismaPg({
            connectionString: databaseUrl
        });
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }   
}