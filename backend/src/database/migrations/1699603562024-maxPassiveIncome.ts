import { MigrationInterface, QueryRunner } from 'typeorm';

export class MaxPassiveIncome1699603562024 implements MigrationInterface {
  name = 'MaxPassiveIncome1699603562024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "maxPassiveIncomeInterval" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "maxPassiveIncomeInterval"`,
    );
  }
}
