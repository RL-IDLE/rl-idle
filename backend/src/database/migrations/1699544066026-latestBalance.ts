import { MigrationInterface, QueryRunner } from "typeorm";

export class LatestBalance1699544066026 implements MigrationInterface {
    name = 'LatestBalance1699544066026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "latestBalance" character varying NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "latestBalance"`);
    }

}
