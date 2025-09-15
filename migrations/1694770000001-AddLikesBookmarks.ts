// migrations/1694770000001-AddLikesBookmarks.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLikesBookmarks1694770000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // نمونه لایک
        await queryRunner.query(`
            INSERT INTO likes(userId, newsId)
            VALUES 
            (3, 1), 
            (3, 2); 
        `);

        // نمونه بوکمارک
        await queryRunner.query(`
            INSERT INTO bookmarks(userId, newsId)
            VALUES 
            (3, 1), 
            (3, 3); 
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM likes;`);
        await queryRunner.query(`DELETE FROM bookmarks;`);
    }
}
