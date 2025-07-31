import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1753972948650 implements MigrationInterface {
    name = 'AutoMigration1753972948650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`customers\` CHANGE \`role\` \`role\` enum ('CUSTOMER') NOT NULL DEFAULT 'CUSTOMER'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`customers\` CHANGE \`role\` \`role\` enum ('ADMIN', 'CUSTOMER', 'FAM_MEMBER', 'GUEST') NOT NULL DEFAULT 'FAM_MEMBER'
        `);
    }

}
