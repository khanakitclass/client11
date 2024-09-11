import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../scenes/dashboard';
import Role from '../admin/container/Role/Role';
import Category from '../admin/container/Category/Category';
import Subcategory from '../admin/container/Subcategory/Subcategory';
import ListProducts from '../admin/container/Product/ListProducts';
import Vendor from '../admin/container/Vendor/Vendor';
import Warehouse from '../admin/container/Warehouse/Warehouse';
import User from '../admin/container/User/User';
import Auth from '../admin/container/Auth/Auth';
// import MainSidebar from '../scenes/global/Sidebar';
import Product from '../admin/container/Product/Product';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../redux/slice/auth.slice';
// import Cookies from 'js-cookie';
// import Topbar from '../scenes/global/Topbar';
import ResponsiveDrawer from '../admin/component/Layout/ResponsiveDrawer';
import Logout from '../admin/container/Auth/Logout';
// import Marketing from '../admin/container/CommercialMarketing/Marketing';
// import ListMarket from '../admin/container/CommercialMarketing/ListMarket';
import Liasoning from '../admin/container/Liasoning/Liasoning';
import AddLiasoning from '../admin/container/Liasoning/Addliasoning';
// import ListResidential from '../admin/container/ResidentialMarketing/ListResidential';
// import AddResidential from '../admin/container/ResidentialMarketing/AddResidential';
// import ListDealer from '../admin/container/Dealer/Listdealer';
// import AddDealer from '../admin/container/Dealer/Adddealer';
import Marketing from '../admin/container/Marketing/Marketing';
import ListMarket from '../admin/container/Marketing/ListMarket';
import AddWarehouse from '../admin/container/Warehouse/AddWarehouse';
import AddVendor from '../admin/container/Vendor/AddVendor';
import AddDealer from '../admin/container/Dealer/Adddealer';
import ListDealer from '../admin/container/Dealer/Listdealer';
import PandingMarket from '../admin/container/Marketing/PandingMarket';
import AddSidebar from '../admin/container/SidebarName/AddSidebar';
import Purchase from '../admin/container/Purchase/Purchase';
import ListPurchase from '../admin/container/Purchase/ListPurchase';
import Addterms from '../admin/container/TermsCondition/Addterms';
import PurchaseOrder from '../admin/container/Purchase/PurchaseOrder';
// import TestLiasoning from '../TestLiasoning';
import PendingPo from '../admin/container/Store/PendingPo';
import Items from '../admin/container/Store/Items';
import AddStore from '../admin/container/Store/AddStore';
function AdminRoutes(props) {
    const [isSidebar, setIsSidebar] = useState(true);

    return (
        <>
            <ResponsiveDrawer isSidebar={isSidebar} />
            <main className="content">
                {/* <Topbar setIsSidebar={setIsSidebar} /> */}

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route exact path='/role' element={<Role />} />
                    <Route path="/category" element={<Category />} />
                    <Route exact path='/sub-category' element={<Subcategory />} />
                    <Route exact path='/add-product' element={<Product />} />
                    <Route exact path='/list-product' element={<ListProducts />} />
                    <Route exact path='/add-liasoning' element={<Liasoning />} />

                    <Route exact path='/liasoning' element={<AddLiasoning />} />
                    {/* <Route exact path='/test-liasoning' element={<TestLiasoning />} /> */}
                    <Route exact path='/add-market' element={<Marketing />} />
                    <Route exact path='/list-marketing' element={<ListMarket />} />
                    <Route exact path='/pending-marketing' element={<PandingMarket />} />

                    <Route exact path='/PurchaseOrder' element={<PurchaseOrder />} />

                    <Route exact path='/side-bar' element={<AddSidebar />} />   

                    <Route exact path='/terms-&-conditions' element={<Addterms />} />
                    <Route exact path='/purchase' element={<ListPurchase />} />
                    <Route exact path='/add-purchase' element={<Purchase />} />

                    <Route exact path='/dealer-entry' element={<ListDealer />} />
                    <Route exact path='/add-dealer' element={<AddDealer />} />
                    <Route exact path='/vendors' element={<Vendor />} />
                    <Route exact path='/add-vendor' element={<AddVendor />} />
                    <Route exact path='/warehouses' element={<Warehouse />} />
                    <Route exact path='/add-warehouses' element={<AddWarehouse />} />
                    <Route exact path='/pending-po' element={<PendingPo />} />
                    <Route exact path='/add-store' element={<AddStore />} />
                    <Route exact path='/items' element={<Items />} />
                    {/* <Route exact path='/add-market' element={<Marketing />} />
                    <Route exact path='/list-market' element={<ListMarket />} /> */}
                    <Route exact path='/user' element={<User />} />
                    <Route exact path='/login' element={<Auth />} />
                    <Route exact path='/logout' element={<Logout />} />
                </Routes>
            </main>
        </>
    );
}

export default AdminRoutes;