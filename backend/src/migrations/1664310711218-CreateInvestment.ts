import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvestment1664310711218 implements MigrationInterface {
  name = 'CreateInvestment1664310711218';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "investment" ("id" SERIAL NOT NULL, "createdAat" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "buyDate" TIMESTAMP NOT NULL, "sellDate" TIMESTAMP, "buyPrice" double precision NOT NULL, "sellPrice" double precision, "buyNote" text, "sellNote" text, "name" character varying NOT NULL, "fees" double precision NOT NULL, "investedAmount" integer NOT NULL, "holdings" integer NOT NULL, "locationName" character varying NOT NULL, "primaryTag" character varying NOT NULL, "secondaryTag" character varying NOT NULL, "priceLink" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_ad085a94bd56e031136925f681b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "investment" ADD CONSTRAINT "FK_e37ec642d341163666411eae841" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "investment" DROP CONSTRAINT "FK_e37ec642d341163666411eae841"`
    );
    await queryRunner.query(`DROP TABLE "investment"`);
  }
}
