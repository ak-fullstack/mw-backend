import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1754732053221 implements MigrationInterface {
    name = 'AutoMigration1754732053221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_image\` DROP FOREIGN KEY \`FK_794963ad14bf1f7674ff49a9c4a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_image\` CHANGE \`returnId\` \`returnItemId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_image\`
            ADD CONSTRAINT \`FK_c163d7a7d91bf24101d205f3088\` FOREIGN KEY (\`returnItemId\`) REFERENCES \`return_items\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`return_image\` DROP FOREIGN KEY \`FK_c163d7a7d91bf24101d205f3088\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_image\` CHANGE \`returnItemId\` \`returnId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`return_image\`
            ADD CONSTRAINT \`FK_794963ad14bf1f7674ff49a9c4a\` FOREIGN KEY (\`returnId\`) REFERENCES \`returns\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
