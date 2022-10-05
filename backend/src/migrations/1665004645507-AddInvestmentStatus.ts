import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInvestmentStatus1665004645507 implements MigrationInterface {
  name = 'AddInvestmentStatus1665004645507';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."investment_status_enum" AS ENUM('OPEN', 'CLOSED')`
    );
    await queryRunner.query(
      `ALTER TABLE "investment" ADD "status" "public"."investment_status_enum" NOT NULL DEFAULT 'OPEN'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investment" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."investment_status_enum"`);
  }
}
