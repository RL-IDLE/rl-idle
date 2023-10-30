import { MigrationInterface, QueryRunner } from "typeorm";

export class Prestige1697796155145 implements MigrationInterface {
    name = 'Prestige1697796155145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "prestige" ("createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" character varying NOT NULL, "name" character varying NOT NULL, "price" character varying NOT NULL, "moneyMult" character varying NOT NULL, CONSTRAINT "UQ_efe4daf7e3e9773f02a6d8008be" UNIQUE ("name"), CONSTRAINT "PK_b2fb44ff74d75fa9274d2d5bb17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prestigeBought" ("createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "prestigeId" uuid, "userId" uuid, CONSTRAINT "PK_47113c8db339ed17f6e3948ad5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "prestigeBought" ADD CONSTRAINT "FK_aeee85da56958e45287b1934aa4" FOREIGN KEY ("prestigeId") REFERENCES "prestige"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prestigeBought" ADD CONSTRAINT "FK_79a6a964eeb04fad92fcdb0723b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prestigeBought" DROP CONSTRAINT "FK_79a6a964eeb04fad92fcdb0723b"`);
        await queryRunner.query(`ALTER TABLE "prestigeBought" DROP CONSTRAINT "FK_aeee85da56958e45287b1934aa4"`);
        await queryRunner.query(`DROP TABLE "prestigeBought"`);
        await queryRunner.query(`DROP TABLE "prestige"`);
    }

}
