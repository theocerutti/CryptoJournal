import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAndRefreshTokens1664030168950 implements MigrationInterface {
  name = 'UserAndRefreshTokens1664030168950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user"
       (
           "id"       SERIAL            NOT NULL,
           "username" character varying NOT NULL,
           "password" character varying NOT NULL,
           "email"    character varying NOT NULL,
           CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
           CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
           CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
       )`
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_token"
       (
           "id"         SERIAL    NOT NULL,
           "is_revoked" boolean   NOT NULL,
           "expires"    TIMESTAMP NOT NULL,
           "userId"     integer   NOT NULL,
           CONSTRAINT "REL_8e913e288156c133999341156a" UNIQUE ("userId"),
           CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id")
       )`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token"
          ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token"
          DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`
    );
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
