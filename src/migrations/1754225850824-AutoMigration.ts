import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754225850824 implements MigrationInterface {
    name = 'AutoMigration1754225850824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`eod_closure\`
            ADD \`closureDate\` date NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`eod_closure\`
            ADD UNIQUE INDEX \`IDX_3e5a796b0c5334483850690dfe\` (\`closureDate\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`eod_closure\` DROP INDEX \`IDX_3e5a796b0c5334483850690dfe\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`eod_closure\` DROP COLUMN \`closureDate\`
        `);
    }

}
