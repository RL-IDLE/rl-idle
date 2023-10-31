import { MigrationInterface, QueryRunner } from 'typeorm';

export class NonNullableArray1698339398843 implements MigrationInterface {
  name = 'NonNullableArray1698339398843';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" DROP CONSTRAINT "FK_aeee85da56958e45287b1934aa4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" DROP CONSTRAINT "FK_79a6a964eeb04fad92fcdb0723b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ALTER COLUMN "prestigeId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" DROP CONSTRAINT "FK_0c9a051d5ced541a0a38b75224b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" DROP CONSTRAINT "FK_28978cbe3ff67864636787da914"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" ALTER COLUMN "itemId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ADD CONSTRAINT "FK_aeee85da56958e45287b1934aa4" FOREIGN KEY ("prestigeId") REFERENCES "prestige"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ADD CONSTRAINT "FK_79a6a964eeb04fad92fcdb0723b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" ADD CONSTRAINT "FK_0c9a051d5ced541a0a38b75224b" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" ADD CONSTRAINT "FK_28978cbe3ff67864636787da914" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "itemBought" DROP CONSTRAINT "FK_28978cbe3ff67864636787da914"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" DROP CONSTRAINT "FK_0c9a051d5ced541a0a38b75224b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" DROP CONSTRAINT "FK_79a6a964eeb04fad92fcdb0723b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" DROP CONSTRAINT "FK_aeee85da56958e45287b1934aa4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" ALTER COLUMN "itemId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" ADD CONSTRAINT "FK_28978cbe3ff67864636787da914" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" ADD CONSTRAINT "FK_0c9a051d5ced541a0a38b75224b" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ALTER COLUMN "prestigeId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ADD CONSTRAINT "FK_79a6a964eeb04fad92fcdb0723b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ADD CONSTRAINT "FK_aeee85da56958e45287b1934aa4" FOREIGN KEY ("prestigeId") REFERENCES "prestige"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
