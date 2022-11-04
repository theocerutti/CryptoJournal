import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPriceInvestmentInfo1667582881070 implements MigrationInterface {
  name = 'AddPriceInvestmentInfo1667582881070';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "FK_6d39c525cfc1b5e42e0adb183a9"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" ADD "price" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "UQ_6d39c525cfc1b5e42e0adb183a9"`);
    await queryRunner.query(`ALTER TABLE "transaction_v2" ALTER COLUMN "fees" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction_v2" ALTER COLUMN "feesCurrency" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction_v2" ALTER COLUMN "feesCurrency" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction_v2" ALTER COLUMN "fees" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "UQ_6d39c525cfc1b5e42e0adb183a9" UNIQUE ("portfolioId")`
    );
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "FK_6d39c525cfc1b5e42e0adb183a9" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
