import { getRepository, getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface CreateParams {
  title: string;

  value: number;

  type: 'income' | 'outcome';

  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: CreateParams): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    let categoryObj = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryObj) {
      categoryObj = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryObj);
    }

    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && balance.total - value < 0) {
      throw new AppError('Outcome should not be bigger than total.');
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryObj.id,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
