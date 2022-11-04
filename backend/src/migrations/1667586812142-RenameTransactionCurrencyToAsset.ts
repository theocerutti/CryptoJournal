import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTransactionCurrencyToAsset1667586812142 implements MigrationInterface {
  name = 'RenameTransactionCurrencyToAsset1667586812142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction_info" RENAME COLUMN "currency" TO "asset"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction_info" RENAME COLUMN "asset" TO "currency"`);
  }
}
