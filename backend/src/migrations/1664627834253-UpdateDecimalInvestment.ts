import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDecimalInvestment1664627834253 implements MigrationInterface {
  name = 'UpdateDecimalInvestment1664627834253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investment"
        DROP COLUMN "buyPrice"`);
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "buyPrice" numeric NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "investment"
        DROP COLUMN "sellPrice"`);
    await queryRunner.query(`ALTER TABLE "investment"
        ADD "sellPrice" numeric`);
    await queryRunner.query(`ALTER TABLE "investment"
        DROP COLUMN "fees"`);
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "fees" numeric NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "investment"
          DROP COLUMN "investedAmount"`
    );
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "investedAmount" numeric NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "investment"
        DROP COLUMN "holdings"`);
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "holdings" numeric NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "investment"
          ALTER COLUMN "locationName" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "investment"
          ALTER COLUMN "primaryTag" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "investment"
          ALTER COLUMN "secondaryTag" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investment"
          ALTER COLUMN "secondaryTag" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "investment"
          ALTER COLUMN "primaryTag" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "investment"
          ALTER COLUMN "locationName" SET NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "investment"
        DROP COLUMN "holdings"`);
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "holdings" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "investment"
          DROP COLUMN "investedAmount"`
    );
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "investedAmount" integer NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "investment"
        DROP COLUMN "fees"`);
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "fees" double precision NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "investment"
        DROP COLUMN "sellPrice"`);
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "sellPrice" double precision`
    );
    await queryRunner.query(`ALTER TABLE "investment"
        DROP COLUMN "buyPrice"`);
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "buyPrice" double precision NOT NULL`
    );
  }
}
