import path from 'path';
import fs from 'fs';
import getStream from 'get-stream';
import csv from 'csv-parse';
import uploadConfig from '../config/uploadConfig';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const transactionsFilePath = path.join(uploadConfig.directory, filename);
    const transactions_data = (await getStream.array(
      fs.createReadStream(transactionsFilePath).pipe(csv()),
    )) as [string, string, string, string][];

    if (transactions_data.length <= 1) {
      throw new AppError('CSV file should not be empty');
    }

    const createTransaction = new CreateTransactionService();
    const transactions: Transaction[] = [];

    /* eslint-disable no-await-in-loop */
    for (let i = 1; i < transactions_data.length; i += 1) {
      const item = transactions_data[i];
      const title = item[0].trim();
      const type = item[1].trim() as 'income' | 'outcome';
      const value = +item[2].trim() as number;
      const category = item[3].trim();
      const transaction = await createTransaction.execute({
        title,
        value,
        type,
        category,
      });
      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
