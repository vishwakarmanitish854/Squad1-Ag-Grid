import api from './api';
import { config } from '../config/env';
import type { UserRow, GridFilters, GridSortParams, GridPaginationParams, ApiResponse } from '../types/index';

const MOCK_DATA: UserRow[] = Array.from({ length: 1000 }, (_, i) => ({
  UserID: i + 1,
  Employee_Code: `EMP${1000 + i}`,
  Employee_Name: `Employee ${i + 1}`,
  LoginID: `user${i + 1}`,
  Employee_Mobile: `987654${(1000 + i).toString().slice(-4)}`,
  Department: ['HR', 'IT', 'Finance', 'Sales'][i % 4],
  Status: ['active', 'inactive', 'on-leave'][i % 3] as any,
  CreatedAt: new Date(2024, 0, 1 + (i % 365)).toISOString(),
  UpdatedAt: new Date().toISOString(),
  CreatedBy: 'system',
  UpdatedBy: 'system',
}));

class UserService {
  async getUsers(
    filters?: GridFilters,
    sort?: GridSortParams,
    pagination?: GridPaginationParams
  ): Promise<ApiResponse<UserRow>> {
    if (config.useMockData) {
      return this.getMockUsers(filters, sort, pagination);
    }

    try {
      const params = {
        page: pagination?.pageNumber || 1,
        pageSize: pagination?.pageSize || 20,
        searchText: filters?.searchText,
        sortColumn: sort?.sortColumn,
        sortDirection: sort?.sortDirection,
        department: filters?.Department,
        status: filters?.Status,
      };

      const response = await api.get<ApiResponse<UserRow>>('/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserDetail(userId: number): Promise<UserRow> {
    if (config.useMockData) {
      const user = MOCK_DATA.find((u) => u.UserID === userId);
      return (
        user || {
          UserID: userId,
          Employee_Code: `EMP${1000 + userId}`,
          Employee_Name: `Employee ${userId}`,
          LoginID: `user${userId}`,
          Employee_Mobile: '',
        }
      );
    }

    const response = await api.get<UserRow>(`/users/${userId}`);
    return response.data;
  }

  async createUser(user: Omit<UserRow, 'UserID' | 'CreatedAt' | 'UpdatedAt'>): Promise<UserRow> {
    if (config.useMockData) {
      const newUser: UserRow = {
        ...user,
        UserID: Math.max(...MOCK_DATA.map((u) => u.UserID)) + 1,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      };
      MOCK_DATA.push(newUser);
      return newUser;
    }

    const response = await api.post<UserRow>('/users', user);
    return response.data;
  }

  async updateUser(userId: number, user: Partial<UserRow>): Promise<UserRow> {
    if (config.useMockData) {
      const index = MOCK_DATA.findIndex((u) => u.UserID === userId);
      if (index > -1) {
        MOCK_DATA[index] = { ...MOCK_DATA[index], ...user, UpdatedAt: new Date().toISOString() };
        return MOCK_DATA[index];
      }
      throw new Error('User not found');
    }

    const response = await api.patch<UserRow>(`/users/${userId}`, user);
    return response.data;
  }

  async deleteUser(userId: number): Promise<void> {
    if (config.useMockData) {
      const index = MOCK_DATA.findIndex((u) => u.UserID === userId);
      if (index > -1) {
        MOCK_DATA.splice(index, 1);
      }
      return;
    }

    await api.delete(`/users/${userId}`);
  }

  async bulkDeleteUsers(userIds: number[]): Promise<void> {
    if (config.useMockData) {
      userIds.forEach((id) => {
        const index = MOCK_DATA.findIndex((u) => u.UserID === id);
        if (index > -1) {
          MOCK_DATA.splice(index, 1);
        }
      });
      return;
    }

    await api.post('/users/bulk-delete', { ids: userIds });
  }

  private getMockUsers(
    filters?: GridFilters,
    sort?: GridSortParams,
    pagination?: GridPaginationParams
  ): ApiResponse<UserRow> {
    let filtered = [...MOCK_DATA];

    if (filters?.searchText) {
      const query = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.Employee_Name.toLowerCase().includes(query) ||
          u.Employee_Code.toLowerCase().includes(query) ||
          u.LoginID.toLowerCase().includes(query) ||
          u.Employee_Mobile.includes(query)
      );
    }

    if (filters?.Department) {
      filtered = filtered.filter((u) => u.Department === filters.Department);
    }

    if (filters?.Status) {
      filtered = filtered.filter((u) => u.Status === filters.Status);
    }

    if (sort?.sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sort.sortColumn as keyof UserRow];
        const bVal = b[sort.sortColumn as keyof UserRow];

        if (aVal !== undefined && bVal !== undefined) {
          if (aVal < bVal) return sort.sortDirection === 'asc' ? -1 : 1;
          if (aVal > bVal) return sort.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const pageNumber = pagination?.pageNumber || 1;
    const pageSize = pagination?.pageSize || 20;
    const startIdx = (pageNumber - 1) * pageSize;
    const paginatedData = filtered.slice(startIdx, startIdx + pageSize);

    return {
      data: paginatedData,
      totalRecords: filtered.length,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  }
}

export default new UserService();
