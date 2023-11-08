import { MigrationInterface, QueryRunner } from 'typeorm';

export class ItemUrl1699091200029 implements MigrationInterface {
  name = 'ItemUrl1699091200029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "image"`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD "url" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD "kind" character varying NOT NULL DEFAULT 'car'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "kind"`);
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "url"`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD "image" character varying NOT NULL`,
    );
  }
}
