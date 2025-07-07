import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1751361537256 implements MigrationInterface {
  name = 'AutoMigration1751361537256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1️⃣ Expand enum to include both old and new values temporarily
    await queryRunner.query(`
      ALTER TABLE \`return_items\` CHANGE \`status\` \`status\` enum (
        'PENDING',
        'RETURN_REQUESTED',
        'RETURN_IN_TRANSIT',
        'RETURN_RECEIVED',
        'APPROVED',
        'REJECTED',
        'COMPLETED'
      ) NOT NULL DEFAULT 'RETURN_REQUESTED'
    `);

    await queryRunner.query(`
      ALTER TABLE \`returns\` CHANGE \`returnStatus\` \`returnStatus\` enum (
        'PENDING',
        'RETURN_REQUESTED',
        'RETURN_IN_TRANSIT',
        'RETURN_RECEIVED',
        'APPROVED',
        'REJECTED',
        'COMPLETED'
      ) NOT NULL DEFAULT 'RETURN_REQUESTED'
    `);

    // 2️⃣ Now update existing data
    await queryRunner.query(`
      UPDATE \`returns\` SET \`returnStatus\` = 'RETURN_REQUESTED' WHERE \`returnStatus\` = 'PENDING'
    `);
    await queryRunner.query(`
      UPDATE \`return_items\` SET \`status\` = 'RETURN_REQUESTED' WHERE \`status\` = 'PENDING'
    `);

    // 3️⃣ Re-define enum to remove 'PENDING'
    await queryRunner.query(`
      ALTER TABLE \`return_items\` CHANGE \`status\` \`status\` enum (
        'RETURN_REQUESTED',
        'RETURN_IN_TRANSIT',
        'RETURN_RECEIVED',
        'APPROVED',
        'REJECTED',
        'COMPLETED'
      ) NOT NULL DEFAULT 'RETURN_REQUESTED'
    `);

    await queryRunner.query(`
      ALTER TABLE \`returns\` CHANGE \`returnStatus\` \`returnStatus\` enum (
        'RETURN_REQUESTED',
        'RETURN_IN_TRANSIT',
        'RETURN_RECEIVED',
        'APPROVED',
        'REJECTED',
        'COMPLETED'
      ) NOT NULL DEFAULT 'RETURN_REQUESTED'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert enum (add PENDING back)
    await queryRunner.query(`
      ALTER TABLE \`returns\` CHANGE \`returnStatus\` \`returnStatus\` enum (
        'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'
      ) NOT NULL DEFAULT 'PENDING'
    `);
    await queryRunner.query(`
      ALTER TABLE \`return_items\` CHANGE \`status\` \`status\` enum (
        'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'
      ) NOT NULL DEFAULT 'PENDING'
    `);

    // Optional: revert data
    await queryRunner.query(`
      UPDATE \`returns\` SET \`returnStatus\` = 'PENDING' WHERE \`returnStatus\` = 'RETURN_REQUESTED'
    `);
    await queryRunner.query(`
      UPDATE \`return_items\` SET \`status\` = 'PENDING' WHERE \`status\` = 'RETURN_REQUESTED'
    `);
  }
}
