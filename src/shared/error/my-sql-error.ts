export class MySqlError {
  message: string;
  code: string;
  errno: number;
  sqlMessage: string;
  sqlState: string;
  index: number;
  sql: string;
  name: string;
  query: string;
  parameters: number[];
}
