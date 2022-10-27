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

  async getDistinct(column: string): Promise<string[]> {
    const res = await this.createQueryBuilder('investment')
      .select(`DISTINCT(investment.${column})`, 'distinct')
      .getRawMany();
    return res.map((item) => item.distinct);
  }
}
