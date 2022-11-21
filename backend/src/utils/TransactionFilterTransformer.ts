import { HttpStatus } from '@nestjs/common';
import HttpError from 'exceptions/http.error';

export type TransactionFilter = string | null;
export type TransactionFilterParsed = number | number[] | null;

export class TransactionFilterTransformer {
  static tryParseFilter(filter: TransactionFilter): TransactionFilterParsed {
    if (!filter) return null;

    let parsedFilter;

    if (filter.indexOf(',') > -1) {
      parsedFilter = this.tryParsingArrayFilter(filter.split(','));
    } else {
      parsedFilter = this.tryParsingId(filter);
    }

    return parsedFilter;
  }

  private static tryParsingArrayFilter(filter: string[]): number[] {
    const parsedFilterIds = [];

    for (let i = 0; i < filter.length; i++) {
      const parsedId = this.tryParsingId(filter[i]);
      parsedFilterIds.push(parsedId);
    }

    return parsedFilterIds;
  }

  private static tryParsingId(id: string): number {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new HttpError('Invalid filter', null, HttpStatus.BAD_REQUEST);
    }
    return parsedId;
  }
}
