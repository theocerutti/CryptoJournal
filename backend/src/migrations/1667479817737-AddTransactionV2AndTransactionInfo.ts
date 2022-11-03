import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransactionV2AndTransactionInfo1667479817737 implements MigrationInterface {
  name = 'AddTransactionV2AndTransactionInfo1667479817737';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction_info"
       (
           "id"        SERIAL            NOT NULL,
           "currency"  character varying NOT NULL,
           "priceLink" character varying NOT NULL,
           "amount"    numeric           NOT NULL,
           CONSTRAINT "PK_b966a45ea2cb981bd86edece282" PRIMARY KEY ("id")
       )`
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_v2"
       (
           "id"           SERIAL            NOT NULL,
           "note"         character varying,
           "fees"         numeric           NOT NULL,
           "feesCurrency" character varying NOT NULL,
           "date"         TIMESTAMP         NOT NULL,
           "portfolioId"  integer,
           "toId"         integer,
           "fromId"       integer,
           CONSTRAINT "REL_04f65e1b131dbcc5e24dd3f2ef" UNIQUE ("toId"),
           CONSTRAINT "REL_700540c0ed9082e15d84d7245b" UNIQUE ("fromId"),
           CONSTRAINT "PK_e425490337724d1f92e6740d53a" PRIMARY KEY ("id")
       )`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_v2"
          ADD CONSTRAINT "FK_946b73c780a13e990119c1bdc48" FOREIGN KEY ("portfolioId") REFERENCES "portfolio" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_v2"
          ADD CONSTRAINT "FK_04f65e1b131dbcc5e24dd3f2ef9" FOREIGN KEY ("toId") REFERENCES "transaction_info" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_v2"
          ADD CONSTRAINT "FK_700540c0ed9082e15d84d7245bd" FOREIGN KEY ("fromId") REFERENCES "transaction_info" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction_v2"
        DROP CONSTRAINT "FK_700540c0ed9082e15d84d7245bd"`);
    await queryRunner.query(`ALTER TABLE "transaction_v2"
        DROP CONSTRAINT "FK_04f65e1b131dbcc5e24dd3f2ef9"`);
    await queryRunner.query(`ALTER TABLE "transaction_v2"
        DROP CONSTRAINT "FK_946b73c780a13e990119c1bdc48"`);
    await queryRunner.query(`DROP TABLE "transaction_v2"`);
    await queryRunner.query(`DROP TABLE "transaction_info"`);
  }
}
