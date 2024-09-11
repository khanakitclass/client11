import { combineReducers } from "redux";
import categoriesSlice from "./slice/categories.slice";
import subcategoriesSlice from "./slice/subcategories.slice";
import alertSlice from "./slice/alert.slice";
import productsSlice from "./slice/products.slice";
import rolesSlice from "./slice/roles.slice";
import vendorsSlice from "./slice/vendors.slice";
import warehousesSlice from "./slice/warehouses.slice";
import usersSlice from "./slice/users.slice";
import authSlice from "./slice/auth.slice";
import CommercialmarketingSlice from "./slice/Commercialmarketing.slice";
import ResidentialmarketingSlice from "./slice/Residentialmarketing.slice";
import liasoningSlice from "./slice/liasoning.slice";
import dealerSlice from "./slice/dealer.slice";
import sidebarReducer from "./slice/SidebarName.slice";
import PurchaseSlice from "./slice/Purchase.slice";
import TermsSlice from "./slice/Terms.slice";
import storeSlice from "./slice/store.slice";

export const rootReducer = combineReducers({
    alert: alertSlice,
    auth: authSlice,
    roles: rolesSlice,
    sidebar: sidebarReducer,
    categories: categoriesSlice,
    purchase: PurchaseSlice,
    subcategories: subcategoriesSlice,
    products: productsSlice,
    vendors: vendorsSlice,
    warehouses: warehousesSlice,
    users: usersSlice,
    store: storeSlice,
    comMarketing: CommercialmarketingSlice,
    resMarketing: ResidentialmarketingSlice,
    liasoning: liasoningSlice,
    dealer: dealerSlice,
    Terms: TermsSlice,
});