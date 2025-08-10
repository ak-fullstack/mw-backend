import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754724001298 implements MigrationInterface {
    name = 'AutoMigration1754724001298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`returns\` DROP COLUMN \`returnType\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`returns\`
            ADD \`returnType\` enum ('REFUND', 'REPLACEMENT') NOT NULL DEFAULT 'REPLACEMENT'
        `);
    }

}
