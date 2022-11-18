import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAsset1668802016387 implements MigrationInterface {
  name = 'RemoveAsset1668802016387';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "asset"
        DROP CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01"`);
    await queryRunner.query(`DROP TABLE "asset"`);

    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "FK_4481017b89d44bc25978de05b66"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "FK_096d896f05ba284e803334c173e"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "UQ_4481017b89d44bc25978de05b66"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP COLUMN "transactionToId"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "UQ_096d896f05ba284e803334c173e"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP COLUMN "transactionFromId"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "toId" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_a02bf62a801914225fc2cad7ff7" UNIQUE ("toId")`
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "fromId" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_ac3d6711c8adf322a76c0d1a227" UNIQUE ("fromId")`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_a02bf62a801914225fc2cad7ff7" FOREIGN KEY ("toId") REFERENCES "transaction_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ac3d6711c8adf322a76c0d1a227" FOREIGN KEY ("fromId") REFERENCES "transaction_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "asset"
          ADD CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION`
    );

    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_ac3d6711c8adf322a76c0d1a227"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_a02bf62a801914225fc2cad7ff7"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_ac3d6711c8adf322a76c0d1a227"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "fromId"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_a02bf62a801914225fc2cad7ff7"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "toId"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" ADD "transactionFromId" integer`);
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "UQ_096d896f05ba284e803334c173e" UNIQUE ("transactionFromId")`
    );
    await queryRunner.query(`ALTER TABLE "transaction_info" ADD "transactionToId" integer`);
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "UQ_4481017b89d44bc25978de05b66" UNIQUE ("transactionToId")`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "FK_096d896f05ba284e803334c173e" FOREIGN KEY ("transactionFromId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "FK_4481017b89d44bc25978de05b66" FOREIGN KEY ("transactionToId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
