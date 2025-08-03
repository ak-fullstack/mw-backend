import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754244990102 implements MigrationInterface {
    name = 'AutoMigration1754244990102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_9cb17ff48c560792048a1b5e67\` ON \`eod_closure\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`eod_closure\` DROP COLUMN \`date\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`eod_closure\`
            ADD \`date\` date NOT NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_9cb17ff48c560792048a1b5e67\` ON \`eod_closure\` (\`date\`)
        `);
    }

}
