import { getRepository } from 'typeorm';

import Category from '../models/Category';

class CreateCategoryService {
  public async execute(category: string): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const categoryFinded = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryFinded) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);

      return newCategory;
    }

    return categoryFinded;
  }
}

export default CreateCategoryService;
