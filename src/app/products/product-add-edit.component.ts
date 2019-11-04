import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductService, PubSubService } from '../_services/index';

// import slide in/out animation
import { slideInOutAnimation } from '../_animations/index';

@Component({
    templateUrl: 'product-add-edit.component.html',

    // make slide in/out animation available to this component
    animations: [slideInOutAnimation],

    // attach the slide in/out animation to the host (root) element of this component
    host: { '[@slideInOutAnimation]': '' }
})
export class ProductAddEditComponent implements OnInit {
    title: string;
    product: any = {};
    saving = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        private pubSubService: PubSubService
    ) { }

    ngOnInit() {
        this.title = 'Add Product';
        const productId = Number(this.route.snapshot.params['id']);
        if (productId) {
            this.title = 'Edit Product';
            this.productService.getById(productId).subscribe(x => this.product = x);
        }
    }

    saveProduct() {
        // save product
        this.saving = true;
        const action = this.product.id ? 'update' : 'create';
        this.productService[action](this.product)
            .subscribe(() => {
                this.saving = false;

                // redirect to products view
                this.router.navigate(['products']);

                // publish event so list component refreshes
                this.pubSubService.publish('products-updated');
            });
    }
}