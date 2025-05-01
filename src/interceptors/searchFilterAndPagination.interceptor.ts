/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import {
  booleanFields,
  dateFields,
  numberFields,
} from '../constants/common.constants';
import { IModelMappingsForWhere } from '../interfaces/modelMapping.interface';
import * as qs from 'qs';
import { pick } from '../utils/pick.utils';

@Injectable()
export class SearchFilterAndPaginationInterceptor<
  T extends keyof IModelMappingsForWhere,
> implements NestInterceptor
{
  constructor(
    private readonly searchableFields: Array<keyof IModelMappingsForWhere[T]>,
    private readonly filterableFields: Array<keyof IModelMappingsForWhere[T]>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const originalUrl = request.url;
    const queryStr = originalUrl.split('?')[1] ?? '';
    const parsedQuery = qs.parse(queryStr);

    const {
      searchTerm,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
      ...filterQuery
    } = parsedQuery;
    const filterFields = pick(filterQuery, this.filterableFields.map(String));

    const where: any = {};
    // --- SEARCH TERM LOGIC ---
    if (typeof searchTerm === 'string') {
      function filterFieldsByType(
        arr: (keyof IModelMappingsForWhere[T])[],
        exclude: string[],
      ) {
        return arr.filter(
          (item) => typeof item === 'string' && !exclude.includes(item),
        );
      }

      function buildNestedSearch(
        field: string,
        searchTerm: string,
      ): Record<string, any> {
        const keys = field.split('.');
        const lastKey = keys.pop()!;

        let value: any;
        if (numberFields.includes(lastKey)) {
          if (!isNaN(Number(searchTerm))) {
            value = { equals: Number(searchTerm) };
          } else {
            return {}; // Skip invalid number filter
          }
        } else if (booleanFields.includes(lastKey)) {
          if (['true', 'false'].includes(searchTerm.toLowerCase())) {
            value = { equals: searchTerm.toLowerCase() === 'true' };
          } else {
            return {};
          }
        } else if (dateFields.includes(lastKey)) {
          const date = new Date(searchTerm);
          if (!isNaN(date.getTime())) {
            value = { equals: date };
          } else {
            return {};
          }
        } else {
          // Default to string search
          value = { contains: searchTerm, mode: 'insensitive' };
        }

        const initial: Record<string, any> = { [lastKey]: value };
        const nested = keys.reduceRight<Record<string, any>>(
          (acc, key) => ({ [key]: acc }),
          initial,
        );

        return nested;
      }

      const searchable = filterFieldsByType(this.searchableFields, dateFields);

      where.OR = searchable.map((field) =>
        typeof field === 'string' ? buildNestedSearch(field, searchTerm) : {},
      );
    }

    // --- FILTER FIELDS LOGIC (SUPPORTS NESTED KEYS) ---
    const buildNestedFilter = (key: string, value: any) => {
      const keys = key.split('.');
      const leafKey = keys[keys.length - 1];

      // Parse value type
      let parsedValue: any = value;
      if (numberFields.includes(leafKey)) {
        if (typeof value === 'object') {
          parsedValue = Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, parseFloat(v as string)]),
          );
        } else {
          parsedValue = { equals: parseFloat(value) };
        }
      } else if (dateFields.includes(leafKey)) {
        if (typeof value === 'object') {
          parsedValue = Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, new Date(v as string)]),
          );
        } else {
          parsedValue = { equals: new Date(value) };
        }
      } else if (booleanFields.includes(leafKey)) {
        if (typeof value === 'object') {
          parsedValue = Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, v === 'true']),
          );
        } else {
          parsedValue = value === 'true';
        }
      }

      // Build nested object from keys
      return keys.reduceRight(
        (acc, currKey) => ({ [currKey]: acc }),
        parsedValue,
      );
    };

    const filters: any[] = Object.entries(filterFields).map(([key, value]) =>
      buildNestedFilter(key, value),
    );

    if (filters.length > 0) {
      where.AND = filters;
    }

    // --- SORTING ---
    const validatedSortBy: keyof IModelMappingsForWhere[T] =
      this.filterableFields.includes(sortBy as keyof IModelMappingsForWhere[T])
        ? (sortBy as keyof IModelMappingsForWhere[T])
        : ('created_at' as keyof IModelMappingsForWhere[T]);

    const validatedSortOrder: 'asc' | 'desc' =
      sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : 'desc';

    request['pagination'] = {
      page: typeof page === 'object' ? page : String(page),
      limit: typeof limit === 'object' ? limit : String(limit),
      skip: String((Number(page) - 1) * Number(limit)),
      sortBy: String(validatedSortBy),
      sortOrder: validatedSortOrder,
    };

    request['where'] = where;

    return next.handle();
  }
}
