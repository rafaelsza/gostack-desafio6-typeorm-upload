import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';

import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const categoriesRepository = getRepository(Category);

  const transactions = await transactionRepository.find();
  const balance = await transactionRepository.getBalance();
  const categories = await categoriesRepository.find();

  const transactionsWithCategory = transactions.map(transaction => ({
    id: transaction.id,
    title: transaction.title,
    type: transaction.type,
    value: transaction.value,
    category: categories.find(
      category => category.id === transaction.category_id,
    ),
  }));

  return response.json({
    transactions: transactionsWithCategory,
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
