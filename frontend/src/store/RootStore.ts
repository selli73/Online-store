import { AuthStore } from './AuthStore';
import { CartStore } from './CartStore';
import { CatalogStore } from './CatalogStore';

export class RootStore {
    auth: AuthStore;
    cart: CartStore;
    catalog: CatalogStore;

    constructor() {
        this.auth = new AuthStore();
        this.cart = new CartStore();
        this.catalog = new CatalogStore();
    }

    /** Полный сброс клиентского состояния при выходе из аккаунта. */
    logout() {
        this.auth.logout();
        this.cart.reset();
    }
}
