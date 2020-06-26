import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { getRepository, In, getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface TransactionsImported {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const filePath = path.join(uploadConfig.directory, fileName);
    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);
    const transactions: TransactionsImported[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) {
        return;
      }

      transactions.push({
        title,
        type,
        value: Number(value),
        category,
      });

      categories.push(category);
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const categoriesRepository = getRepository(Category);
    const existentsCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentsCategoriesTitles = existentsCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories
      .filter(category => !existentsCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const totalCategories = [...existentsCategories, ...newCategories];

    const transactionsRepository = getCustomRepository(TransactionRepository);

    const createdTransaction = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: totalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransaction);

    await fs.promises.unlink(filePath);

    return createdTransaction;
  }
}

export default ImportTransactionsService;
