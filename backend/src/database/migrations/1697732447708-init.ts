import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1697732447708 implements MigrationInterface {
    name = 'Init1697732447708'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "moneyFromClick" character varying NOT NULL DEFAULT '0', "moneyPerClick" character varying NOT NULL DEFAULT '1', "moneyUsed" character varying NOT NULL DEFAULT '0', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item" ("createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" character varying NOT NULL, "name" character varying NOT NULL, "price" character varying NOT NULL, "moneyPerSecond" character varying NOT NULL, "moneyPerClickMult" character varying NOT NULL, CONSTRAINT "UQ_c6ae12601fed4e2ee5019544ddf" UNIQUE ("name"), CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "itemBought" ("createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid, "userId" uuid, CONSTRAINT "PK_9f79e71ede98758308cb65be9ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "itemBought" ADD CONSTRAINT "FK_0c9a051d5ced541a0a38b75224b" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "itemBought" ADD CONSTRAINT "FK_28978cbe3ff67864636787da914" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "itemBought" DROP CONSTRAINT "FK_28978cbe3ff67864636787da914"`);
        await queryRunner.query(`ALTER TABLE "itemBought" DROP CONSTRAINT "FK_0c9a051d5ced541a0a38b75224b"`);
        await queryRunner.query(`DROP TABLE "itemBought"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
