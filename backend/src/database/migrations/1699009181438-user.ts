import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1699009181438 implements MigrationInterface {
  name = 'User1699009181438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "emeralds" character varying NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emeralds"`);
  }
}
