import BOOKS from 'src/utils/constants/book';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMigration1718686778508 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const book of BOOKS) {
      await queryRunner.query(`
        INSERT INTO "book" (id, title, author, publication_year, genre, description, cover_image, quantity, isbn_no, created_at, updated_at)
        VALUES (${book.id}, '${book.title}', '${book.author}', '${book.publicationYear}', '${book.genre}', '${book.description}', '${book.coverImage}', ${book.quantity}, ${book.ISBNNo},NOW(), NOW());
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const ids = BOOKS.map((book) => book.id).join(', ');
    await queryRunner.query(`
      DELETE FROM "book"
      WHERE id IN (${ids});
    `);
  }
}
