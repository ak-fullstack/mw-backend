import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754644501256 implements MigrationInterface {
    name = 'AutoMigration1754644501256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`stocks\` CHANGE \`initialDamagedQuantity\` \`initialDamagedQuantity\` int NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`stocks\` CHANGE \`initialDamagedQuantity\` \`initialDamagedQuantity\` int NOT NULL DEFAULT '0'
        `);
    }

}
