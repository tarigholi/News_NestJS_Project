import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InitialSchema1685001234567  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ----------- USERS -----------
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'fullName', type: 'varchar' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          {
            name: 'role',
            type: 'enum',
            enum: ['admin', 'journalist', 'reader'],
            default: `'reader'`,
          },
          { name: 'current_hashed_refresh_token', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    // ----------- CATEGORIES -----------
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    // ----------- NEWS -----------
    await queryRunner.createTable(
      new Table({
        name: 'news',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'title', type: 'varchar' },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'content', type: 'text' },
          { name: 'image', type: 'varchar', isNullable: true },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'published'],
            default: `'draft'`,
          },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
          { name: 'updatedAt', type: 'timestamp', default: 'NOW()' },
          { name: 'categoryId', type: 'int' },
          { name: 'authorId', type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'news',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'news',
      new TableForeignKey({
        columnNames: ['authorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // ----------- COMMENTS -----------
    await queryRunner.createTable(
      new Table({
        name: 'comments',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'content', type: 'text' },
          { name: 'newsId', type: 'int' },
          { name: 'userId', type: 'int' },
          { name: 'createdAt', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'comments',
      new TableForeignKey({
        columnNames: ['newsId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'news',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'comments',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // ----------- LIKES -----------
    await queryRunner.createTable(
      new Table({
        name: 'likes',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'userId', type: 'int' },
          { name: 'newsId', type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'likes',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'likes',
      new TableForeignKey({
        columnNames: ['newsId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'news',
        onDelete: 'CASCADE',
      }),
    );

    // ----------- BOOKMARKS -----------
    await queryRunner.createTable(
      new Table({
        name: 'bookmarks',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'userId', type: 'int' },
          { name: 'newsId', type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'bookmarks',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'bookmarks',
      new TableForeignKey({
        columnNames: ['newsId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'news',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bookmarks');
    await queryRunner.dropTable('likes');
    await queryRunner.dropTable('comments');
    await queryRunner.dropTable('news');
    await queryRunner.dropTable('categories');
    await queryRunner.dropTable('users');
  }
}
