import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProductService, PubSubService } from '../_services/index';

// import fade in animation
import { fadeInAnimation } from '../_animations/index';
@Component({
    templateUrl: 'product-list.component.html',

    // make fade in animation available to this component
    animations: [fadeInAnimation],

    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' }
})
export class ProductListComponent implements OnInit, OnDestroy {
    products: any[];
    subscription: Subscription;
    loading = false;

    constructor(
        private productService: ProductService,
        private pubSubService: PubSubService
    ) { }
    
    ngOnInit() {
        this.loadProducts();

        // reload products when updated
        this.subscription = this.pubSubService.on('products-updated').subscribe(() => this.loadProducts());
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    deleteProduct(id: number) {
        this.products.find(x => x.id === id).deleting = true;
        this.productService.delete(id).subscribe(() => {
            // remove product from products array after deleting
            this.products = this.products.filter(x => x.id !== id);
        });
    }

    private loadProducts() {
        this.productService.getAll().subscribe(x => this.products = x);
    }
}