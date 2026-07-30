declare module "pg" {
  export interface QueryResultRow {
    [column: string]: unknown;
  }

  export interface QueryResult<T extends QueryResultRow = QueryResultRow> {
    rows: T[];
  }

  export interface PoolConfig {
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    ssl?: boolean | { rejectUnauthorized?: boolean };
    max?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
    statement_timeout?: number;
    options?: string;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    on(event: "error", listener: (error: Error) => void): this;
    query<T extends QueryResultRow = QueryResultRow>(
      sql: string,
      params?: unknown[]
    ): Promise<QueryResult<T>>;
  }
}
