import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
  IonList,
  IonItem, IonButton, IonLabel, IonAvatar, IonThumbnail, IonSkeletonText, IonAlert, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { ProductService } from '@/services/product.service';
import { RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs';
import { storefront, storefrontOutline } from "ionicons/icons";
import { addIcons } from "ionicons";
import { Helpers } from '@/helper/helper';
import { AuthService } from '@/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonInfiniteScroll, 
    IonInfiniteScrollContent,
    IonIcon, 
    IonSkeletonText, 
    IonAvatar, 
    IonLabel, 
    IonButton, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList,
    IonItem,
    IonThumbnail,
    IonAlert,
    RouterModule
  ],
})
export class HomePage {
  public dataProfile: any = null;

  private currentTotal = 0;
  private total = 0;
  public isLoading: boolean = false;
  public error: any = null;

  public listProduct: any[] = [];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private helper: Helpers
  ) {
    setTimeout(() => {
      this.getProfile();
    //   this.getProdList();
    }, 500);
    addIcons({ storefront, storefrontOutline });
  }

  getProfile() {
    this.authService.getProfileAdmin().subscribe(
      {
        next: (res) => {
          this.dataProfile = res;
          const profileStorage = this.helper.encodeBase64('profileData');
          const dataProfile = this.helper.encodeBase64(JSON.stringify(this.dataProfile));
          localStorage.setItem(profileStorage, dataProfile);
          this.getProdList();
        },
        error: (err) => {
          console.log(err);
          this.dataProfile = null;
          this.authService.logout();
          this.error = {
            error: err.name,
            message: err.error.message
          };
        }
      }
    );
  }

  getProdList(event?: InfiniteScrollCustomEvent) {
    let params = {};
    if (event) {
      // add params numbers of skip based on numbers of current total data 
      params = {
        skip: this.currentTotal
      }
    }
    
    this.isLoading = true;
    this.productService.getListProduct(params).pipe(
      finalize(() => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      })
    ).subscribe(
      {
        next: (res) => {
          console.log(res);
          this.isLoading = false;
          this.listProduct.push(...res.products);
          this.total = res.total;

          // Disable the infinite scroll when all data is already collected
          if (event) {
            event.target.disabled = res.total <= this.currentTotal;
          }
        },
        error: (err) => {
          console.log(err);
          this.error = err;
        }
      }
    );
  }

  // Function for event scroll handler
  loadList(event: InfiniteScrollCustomEvent) {
    // Increment current total
    if (this.currentTotal < this.total) {
      let diff = this.total - this.currentTotal;
      this.currentTotal += (diff >= 30 ? 30 : diff);
    }
    // Callback the get list function
    this.getProdList(event);
  }
}
