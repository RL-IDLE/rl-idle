import { MigrationInterface, QueryRunner } from 'typeorm';

export class LastSeen1698677500065 implements MigrationInterface {
  name = 'LastSeen1698677500065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastSeen" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastSeen"`);
  }
}
