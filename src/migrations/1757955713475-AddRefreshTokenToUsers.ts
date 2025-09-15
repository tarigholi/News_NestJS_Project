import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUsers1757955713475 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD COLUMN "current_hashed_refresh_token" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            DROP COLUMN "current_hashed_refresh_token"
        `);
    }
}
