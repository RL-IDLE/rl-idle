import { MigrationInterface, QueryRunner } from "typeorm";

export class Ranking1699624915814 implements MigrationInterface {
    name = 'Ranking1699624915814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "latestBalanceMantissa" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "latestBalanceExponent" character varying NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "latestBalanceExponent"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "latestBalanceMantissa"`);
    }

}
