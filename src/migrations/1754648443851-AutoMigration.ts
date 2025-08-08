import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754648443851 implements MigrationInterface {
    name = 'AutoMigration1754648443851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`product_images\`
            ADD \`isPrimary\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`product_images\` DROP COLUMN \`isPrimary\`
        `);
    }

}
