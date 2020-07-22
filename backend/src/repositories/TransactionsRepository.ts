import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions.reduce((acumulator, current) => {
      if (current.type === 'income') {
        return { ...acumulator, value: acumulator.value + current.value };
      }
      return acumulator;
    }, this.create({ title: '', value: 0, type: 'income' }));

    const outcome = transactions.reduce((acumulator, current) => {
      if (current.type === 'outcome') {
        return { ...acumulator, value: acumulator.value + current.value };
      }
      return acumulator;
    }, this.create({ title: '', value: 0, type: 'outcome' }));

    return {
      income: income.value,
      outcome: outcome.value,
      total: income.value - outcome.value,
    };
  }
}

export default TransactionsRepository;
