import { Component, Input, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductService } from '@/services/product.service';
import { Helpers } from '@/helper/helper';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
  ]
})
export class ProductDetailPage {
  // public productModel: WritableSignal<any | null> = signal(null);
  public productModel: any = null;
  
  @Input()
  set id(prodId: string) {
    this.productService.getDetailProduct(prodId).subscribe(
      {
        next: (res) => {
          console.log(res);
          // this.productModel.set(res);
          this.productModel = res;
          console.log(this.productModel);
          
        },
        error: (err) => {
          console.log(err);
          
        }
      }
    );
  }

  constructor(
    private productService: ProductService,
    private authSevice: AuthService,
    private helper: Helpers
  ) { 
    const currentUser = this.helper.getAdminProfile();
    if (!currentUser) {
      this.authSevice.logout();
    }
  }

}
