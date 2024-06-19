import { customers } from 'src/utils/constants/user';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMigration1718796641268 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const customer of customers) {
      await queryRunner.query(`
                INSERT INTO "customer" (first_name, last_name, email, password, created_at, updated_at)
                VALUES ('${customer.firstName}', '${customer.lastName}', '${customer.email}', '${customer.password}', NOW(), NOW());
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const emails = customers
      .map((customer) => `'${customer.email}'`)
      .join(', ');
    await queryRunner.query(`
            DELETE FROM "customer"
            WHERE email IN (${emails});
        `);
  }
}
