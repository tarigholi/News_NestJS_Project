import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1694770000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // نمونه کاربران (پسوردها باید bcrypt هش شوند)
        await queryRunner.query(`
            INSERT INTO users(fullName, email, password, role)
            VALUES 
            ('Admin User', 'admin@example.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxx', 'admin'),
            ('Journalist User', 'journalist@example.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxx', 'journalist'),
            ('Reader User', 'reader@example.com', '$2b$10$xxxxxxxxxxxxxxxxxxxxxx', 'reader');
        `);

        // نمونه دسته‌بندی
        await queryRunner.query(`
            INSERT INTO categories(name, slug)
            VALUES 
            ('Technology', 'technology'),
            ('Sports', 'sports'),
            ('Politics', 'politics');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM users;`);
        await queryRunner.query(`DELETE FROM categories;`);
    }
}
