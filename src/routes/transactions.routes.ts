import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';

import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();

  //const categoriesRepository = getRepository(Category);
  //const categories = await categoriesRepository.find();

  /* const transactionsWithCategoryComplet = transactions.forEach(
    transaction =>
    { transaction.category = categories.find(
      category => category.id === transaction.category_id),
    }); */

  /* const transactionsWithCategoryComplet = transactions.map(
    transaction => transaction.category_id = await categoriesRepository.findOne({
        where: { id: transaction.category_id },
      });
  ); */

  return response.json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
