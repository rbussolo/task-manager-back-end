import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTask1712271717867 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'title',
            type: 'varchar',
            precision: 100,
          },
          {
            name: 'description',
            type: 'varchar',
            precision: 255,
            isNullable: true,
          },
          {
            name: 'category',
            type: 'varchar',
            precision: 100,
            isNullable: true,
          },
          {
            name: 'completed',
            type: 'boolean',
          },
          {
            name: 'priority',
            type: 'varchar',
            precision: 10,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tasks');
  }
}
