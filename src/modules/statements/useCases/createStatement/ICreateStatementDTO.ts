interface ICreateStatementDTO {
  user_id: string;
  description: string;
  amount: number;
  type: string;
  sender_id?: string;
}

export { ICreateStatementDTO };
