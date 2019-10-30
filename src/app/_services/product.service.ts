import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<string[]>(`${environment.apiUrl}/products`);
    }

    getById(id: number) {
        return this.http.get<any>(`${environment.apiUrl}/products/${id}`);
    }

    create(product: any) {
        return this.http.post<any>(`${environment.apiUrl}/products`, product);
    }

    update(product: any) {
        return this.http.put<any>(`${environment.apiUrl}/products/${product.id}`, product);
    }

    delete(id: number) {
        return this.http.delete<any>(`${environment.apiUrl}/products/${id}`);
    }
}