import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFeesFieldsName1667663217251 implements MigrationInterface {
  name = 'UpdateFeesFieldsName1667663217251';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "feesAmount"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "feesPrice"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "feesCurrencyId"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "feeAmount" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "feePrice" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "feeAssetId" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "feeAssetId"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "feePrice"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "feeAmount"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "feesCurrencyId" integer`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "feesPrice" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "feesAmount" numeric NOT NULL`);
  }
}
