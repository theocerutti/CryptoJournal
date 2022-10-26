import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFromToBankTransaction1666815366974 implements MigrationInterface {
  name = 'AddFromToBankTransaction1666815366974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" ADD "fromBank" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "toBank" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "toBank"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "fromBank"`);
  }
}
