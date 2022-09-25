import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUsernameFromUser1664110434281 implements MigrationInterface {
  name = 'RemoveUsernameFromUser1664110434281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`
    );
  }
}
