import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnCascadeDeleteEntities1667732501045 implements MigrationInterface {
  name = 'UpdateOnCascadeDeleteEntities1667732501045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_a02bf62a801914225fc2cad7ff7"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_ac3d6711c8adf322a76c0d1a227"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_a02bf62a801914225fc2cad7ff7"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "toId"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_ac3d6711c8adf322a76c0d1a227"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "fromId"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" ADD "transactionToId" integer`);
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "UQ_4481017b89d44bc25978de05b66" UNIQUE ("transactionToId")`
    );
    await queryRunner.query(`ALTER TABLE "transaction_info" ADD "transactionFromId" integer`);
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "UQ_096d896f05ba284e803334c173e" UNIQUE ("transactionFromId")`
    );
    await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01"`);
    await queryRunner.query(`ALTER TABLE "asset" ALTER COLUMN "userId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction_info" ALTER COLUMN "assetId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction_info" ALTER COLUMN "portfolioId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
    await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "userId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "feeAssetId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "portfolio" DROP CONSTRAINT "FK_9d041c43c782a9135df1388ae16"`);
    await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "userId" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "asset" ADD CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "FK_4481017b89d44bc25978de05b66" FOREIGN KEY ("transactionToId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_info" ADD CONSTRAINT "FK_096d896f05ba284e803334c173e" FOREIGN KEY ("transactionFromId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ADD CONSTRAINT "FK_9d041c43c782a9135df1388ae16" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "portfolio" DROP CONSTRAINT "FK_9d041c43c782a9135df1388ae16"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "FK_096d896f05ba284e803334c173e"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "FK_4481017b89d44bc25978de05b66"`);
    await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01"`);
    await queryRunner.query(`ALTER TABLE "portfolio" ALTER COLUMN "userId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "portfolio" ADD CONSTRAINT "FK_9d041c43c782a9135df1388ae16" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "feeAssetId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "userId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE "transaction_info" ALTER COLUMN "portfolioId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction_info" ALTER COLUMN "assetId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "asset" ALTER COLUMN "userId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "asset" ADD CONSTRAINT "FK_e469bb1b58d7ae4d9527d35ca01" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "UQ_096d896f05ba284e803334c173e"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP COLUMN "transactionFromId"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP CONSTRAINT "UQ_4481017b89d44bc25978de05b66"`);
    await queryRunner.query(`ALTER TABLE "transaction_info" DROP COLUMN "transactionToId"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "fromId" integer`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_ac3d6711c8adf322a76c0d1a227" UNIQUE ("fromId")`
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "toId" integer`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_a02bf62a801914225fc2cad7ff7" UNIQUE ("toId")`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_ac3d6711c8adf322a76c0d1a227" FOREIGN KEY ("fromId") REFERENCES "transaction_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_a02bf62a801914225fc2cad7ff7" FOREIGN KEY ("toId") REFERENCES "transaction_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }
}
