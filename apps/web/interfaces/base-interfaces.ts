interface SelectObject {
  label: string;
  value: string;
  [key: string]: any;
}

interface Pagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  next: number | null;
  prev: number | null;
}
