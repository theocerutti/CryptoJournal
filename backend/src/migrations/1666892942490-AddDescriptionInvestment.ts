import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionInvestment1666892942490 implements MigrationInterface {
  name = 'AddDescriptionInvestment1666892942490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investment" ADD "description" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investment" DROP COLUMN "description"`);
  }
}
