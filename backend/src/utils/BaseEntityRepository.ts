import { Repository } from 'typeorm';
import { User } from '../model/user.entity';

export class BaseEntityRepository<T> extends Repository<T> {
  async getColumnSumByUser(column: string, user: User): Promise<number> {
    const { sum } = await this.createQueryBuilder('table')
      .leftJoin('table.user', 'user')
      .where('user.id = :id', { id: user.id })
      .select(`SUM(table.${column})`, 'sum')
      .getRawOne();
    return parseFloat(sum);
  }

  async getEntityDistinct(column: string): Promise<T[]> {
    const entities = await this.find();
    return entities.reduce((acc, entity) => {
      if (!acc.includes(entity)) {
        acc.push(entity);
      }
      return acc;
    }, []);
  }

  async getDistinct(column: string): Promise<string[]> {
    const res = await this.createQueryBuilder('entity').select(`DISTINCT(entity.${column})`, 'distinct').getRawMany();
    return res.map((item) => item.distinct);
  }
}
