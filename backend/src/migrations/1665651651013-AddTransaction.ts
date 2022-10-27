import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransaction1665651651013 implements MigrationInterface {
  name = 'AddTransaction1665651651013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "from" character varying NOT NULL, "to" character varying NOT NULL, "amount" numeric NOT NULL, "date" TIMESTAMP NOT NULL, "fees" numeric NOT NULL, "userId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "investment" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."investment_status_enum"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "erc20Address" character varying`);
    await queryRunner.query(`ALTER TABLE "user" ADD "btcAddress" character varying`);
    await queryRunner.query(`CREATE TYPE "public"."investment_orderstatus_enum" AS ENUM('OPEN', 'CLOSED')`);
    await queryRunner.query(
      `ALTER TABLE "investment" ADD "orderStatus" "public"."investment_orderstatus_enum" NOT NULL DEFAULT 'OPEN'`
    );
    await queryRunner.query(`CREATE TYPE "public"."investment_type_enum" AS ENUM('NONE', 'GIFT')`);
    await queryRunner.query(
      `ALTER TABLE "investment" ADD "type" "public"."investment_type_enum" NOT NULL DEFAULT 'NONE'`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
    await queryRunner.query(`ALTER TABLE "investment" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."investment_type_enum"`);
    await queryRunner.query(`ALTER TABLE "investment" DROP COLUMN "orderStatus"`);
    await queryRunner.query(`DROP TYPE "public"."investment_orderstatus_enum"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "btcAddress"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "erc20Address"`);
    await queryRunner.query(`CREATE TYPE "public"."investment_status_enum" AS ENUM('OPEN', 'CLOSED')`);
    await queryRunner.query(
      `ALTER TABLE "investment" ADD "status" "public"."investment_status_enum" NOT NULL DEFAULT 'OPEN'`
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
