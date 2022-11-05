import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsMyBankToPortfolio1667666701451 implements MigrationInterface {
  name = 'AddIsMyBankToPortfolio1667666701451';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
    await queryRunner.query(`ALTER TABLE "portfolio" ADD "isMyBank" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(
      `ALTER TABLE "asset" ADD CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
    await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01"`);
    await queryRunner.query(`ALTER TABLE "portfolio" DROP COLUMN "isMyBank"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "asset" ADD CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`
    );
  }
}
