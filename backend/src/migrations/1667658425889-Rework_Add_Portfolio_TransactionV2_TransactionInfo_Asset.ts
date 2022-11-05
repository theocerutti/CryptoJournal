import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReworkAddPortfolioTransactionV2TransactionInfoAsset1667658425889 implements MigrationInterface {
  name = 'ReworkAddPortfolioTransactionV2TransactionInfoAsset1667658425889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "investment"`);
    await queryRunner.query(`DROP TYPE "public"."investment_orderstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."investment_type_enum"`);

    await queryRunner.query(`ALTER TABLE "transaction"
        DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
    await queryRunner.query(
      `CREATE TABLE "asset"
       (
           "id"              SERIAL            NOT NULL,
           "name"            character varying NOT NULL,
           "priceTrackerUrl" character varying NOT NULL,
           "userId"          integer,
           CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id")
       )`
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_info"
       (
           "id"          SERIAL  NOT NULL,
           "amount"      numeric NOT NULL,
           "price"       numeric NOT NULL,
           "assetId"     integer,
           "portfolioId" integer,
           CONSTRAINT "PK_b966a45ea2cb981bd86edece282" PRIMARY KEY ("id")
       )`
    );
    await queryRunner.query(
      `CREATE TABLE "portfolio"
       (
           "id"          SERIAL            NOT NULL,
           "name"        character varying NOT NULL,
           "description" character varying,
           "userId"      integer,
           CONSTRAINT "PK_6936bb92ca4b7cda0ff28794e48" PRIMARY KEY ("id")
       )`
    );
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "from"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "to"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "amount"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "fees"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "fromBank"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "toBank"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "note" character varying`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "feesAmount" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "feesPrice" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "toId" integer`);
    await queryRunner.query(
      `ALTER TABLE "transaction"
          ADD CONSTRAINT "UQ_a02bf62a801914225fc2cad7ff7" UNIQUE ("toId")`
    );
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "fromId" integer`);
    await queryRunner.query(
      `ALTER TABLE "transaction"
          ADD CONSTRAINT "UQ_ac3d6711c8adf322a76c0d1a227" UNIQUE ("fromId")`
    );
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "feesCurrencyId" integer`);
    await queryRunner.query(
      `ALTER TABLE "asset"
          ADD CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction"
          ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction"
          ADD CONSTRAINT "FK_a02bf62a801914225fc2cad7ff7" FOREIGN KEY ("toId") REFERENCES "transaction_info" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction"
          ADD CONSTRAINT "FK_ac3d6711c8adf322a76c0d1a227" FOREIGN KEY ("fromId") REFERENCES "transaction_info" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio"
          ADD CONSTRAINT "FK_9d041c43c782a9135df1388ae16" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the investment table
    await queryRunner.query(
      `CREATE TABLE "investment"
       (
           "id"             SERIAL            NOT NULL,
           "createdAt"      TIMESTAMP         NOT NULL DEFAULT now(),
           "updatedAt"      TIMESTAMP         NOT NULL DEFAULT now(),
           "buyDate"        TIMESTAMP         NOT NULL,
           "sellDate"       TIMESTAMP,
           "buyPrice"       double precision  NOT NULL,
           "sellPrice"      double precision,
           "buyNote"        text,
           "sellNote"       text,
           "name"           character varying NOT NULL,
           "fees"           double precision  NOT NULL,
           "investedAmount" integer           NOT NULL,
           "holdings"       integer           NOT NULL,
           "locationName"   character varying NOT NULL,
           "primaryTag"     character varying NOT NULL,
           "secondaryTag"   character varying NOT NULL,
           "priceLink"      character varying NOT NULL,
           "userId"         integer,
           CONSTRAINT "PK_ad085a94bd56e031136925f681b" PRIMARY KEY ("id")
       )`
    );
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD CONSTRAINT "FK_e37ec642d341163666411eae841" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
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
    await queryRunner.query(`CREATE TYPE "public"."investment_status_enum" AS ENUM('OPEN', 'CLOSED')`);
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "status" "public"."investment_status_enum" NOT NULL DEFAULT 'OPEN'`
    );
    await queryRunner.query(`ALTER TABLE "investment"
        DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."investment_status_enum"`);
    await queryRunner.query(`CREATE TYPE "public"."investment_orderstatus_enum" AS ENUM('OPEN', 'CLOSED')`);
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "orderStatus" "public"."investment_orderstatus_enum" NOT NULL DEFAULT 'OPEN'`
    );
    await queryRunner.query(`CREATE TYPE "public"."investment_type_enum" AS ENUM('NONE', 'GIFT')`);
    await queryRunner.query(
      `ALTER TABLE "investment"
          ADD "type" "public"."investment_type_enum" NOT NULL DEFAULT 'NONE'`
    );
    await queryRunner.query(`ALTER TABLE "investment"
        ADD "description" character varying`);

    // Down
    await queryRunner.query(`ALTER TABLE "portfolio"
        DROP CONSTRAINT "FK_9d041c43c782a9135df1388ae16"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP CONSTRAINT "FK_ac3d6711c8adf322a76c0d1a227"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP CONSTRAINT "FK_a02bf62a801914225fc2cad7ff7"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
    await queryRunner.query(`ALTER TABLE "asset"
        DROP CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "feesCurrencyId"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP CONSTRAINT "UQ_ac3d6711c8adf322a76c0d1a227"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "fromId"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP CONSTRAINT "UQ_a02bf62a801914225fc2cad7ff7"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "toId"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "feesPrice"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "feesAmount"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        DROP COLUMN "note"`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "toBank" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "fromBank" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "fees" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "amount" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "to" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "from" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "transaction"
        ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`DROP TABLE "portfolio"`);
    await queryRunner.query(`DROP TABLE "transaction_info"`);
    await queryRunner.query(`DROP TABLE "asset"`);
    await queryRunner.query(
      `ALTER TABLE "transaction"
          ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
