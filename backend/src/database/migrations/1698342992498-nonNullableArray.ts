import { MigrationInterface, QueryRunner } from 'typeorm';

export class NonNullableArray1698342992498 implements MigrationInterface {
  name = 'NonNullableArray1698342992498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" DROP CONSTRAINT "FK_aeee85da56958e45287b1934aa4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" DROP CONSTRAINT "FK_79a6a964eeb04fad92fcdb0723b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" DROP CONSTRAINT "FK_0c9a051d5ced541a0a38b75224b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" DROP CONSTRAINT "FK_28978cbe3ff67864636787da914"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ADD CONSTRAINT "FK_aeee85da56958e45287b1934aa4" FOREIGN KEY ("prestigeId") REFERENCES "prestige"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ADD CONSTRAINT "FK_79a6a964eeb04fad92fcdb0723b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" ADD CONSTRAINT "FK_0c9a051d5ced541a0a38b75224b" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" ADD CONSTRAINT "FK_28978cbe3ff67864636787da914" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
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
      `ALTER TABLE "itemBought" ADD CONSTRAINT "FK_28978cbe3ff67864636787da914" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "itemBought" ADD CONSTRAINT "FK_0c9a051d5ced541a0a38b75224b" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ADD CONSTRAINT "FK_79a6a964eeb04fad92fcdb0723b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prestigeBought" ADD CONSTRAINT "FK_aeee85da56958e45287b1934aa4" FOREIGN KEY ("prestigeId") REFERENCES "prestige"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
