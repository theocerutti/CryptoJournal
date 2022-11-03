import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReworkPortfolioAndTransaction1667487684889 implements MigrationInterface {
  name = 'ReworkPortfolioAndTransaction1667487684889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction_v2" DROP CONSTRAINT "FK_946b73c780a13e990119c1bdc48"`);
    await queryRunner.query(`ALTER TABLE "transaction_v2" RENAME COLUMN "portfolioId" TO "userId"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" ADD "portfolioId" integer`);
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "UQ_6d39c525cfc1b5e42e0adb183a9" UNIQUE ("portfolioId")`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "FK_6d39c525cfc1b5e42e0adb183a9" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_v2" ADD CONSTRAINT "FK_a16fdc1ce9ac50712532acd8fb9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction_v2" DROP CONSTRAINT "FK_a16fdc1ce9ac50712532acd8fb9"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "FK_6d39c525cfc1b5e42e0adb183a9"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "UQ_6d39c525cfc1b5e42e0adb183a9"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP COLUMN "portfolioId"`);
    await queryRunner.query(`ALTER TABLE "transaction_v2" RENAME COLUMN "userId" TO "portfolioId"`);
    await queryRunner.query(
      `ALTER TABLE "transaction_v2" ADD CONSTRAINT "FK_946b73c780a13e990119c1bdc48" FOREIGN KEY ("portfolioId") REFERENCES "portfolio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
