import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';

import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import Transaction from '../models/Transaction';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();

  /* const categoriesRepository = getRepository(Category);
  const categories = await categoriesRepository.find(); */

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
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute(id);

  return response.status(200).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importCSVTransaction = new ImportTransactionsService();
    const transactions: Transaction[] = await importCSVTransaction.execute(
      request.file.filename,
    );

    return response.json({ transactions });
  },
);

export default transactionsRouter;
