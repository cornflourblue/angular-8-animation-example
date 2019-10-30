import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // some initial default products
        const defaultProducts = [
            { id: 1, name: 'Boardies', price: '25.00' },
            { id: 2, name: 'Singlet', price: '9.50' },
            { id: 3, name: 'Thongs (Flip Flops)', price: '12.95' }
        ];

        // array in local storage for all products
        let products = JSON.parse(localStorage.getItem('products')) || defaultProducts;

        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/products') && method === 'GET':
                    return getProducts();
                case url.match(/\/products\/\d+$/) && method === 'GET':
                    return getProductById();
                case url.endsWith('/products') && method === 'POST':
                    return createProduct();
                case url.match(/\/products\/\d+$/) && method === 'PUT':
                    return updateProduct();
                case url.match(/\/products\/\d+$/) && method === 'DELETE':
                    return deleteProduct();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function getProducts() {
            return ok(products);
        }

        function getProductById() {
            const product = products.find(x => x.id === idFromUrl());
            return ok(product);
        }

        function createProduct() {
            const product = body;
            product.id = products.length ? Math.max(...products.map(x => x.id)) + 1 : 1;
            products.push(product);
            localStorage.setItem('products', JSON.stringify(products));

            return ok(product);
        }

        function updateProduct() {
            const product = body;
            const index = products.findIndex(x => x.id === idFromUrl());
            products[index] = product;
            localStorage.setItem('products', JSON.stringify(products));

            return ok(product);
        }

        function deleteProduct() {
            products = products.filter(x => x.id !== idFromUrl());
            localStorage.setItem('products', JSON.stringify(products));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};