import { useLocation } from "react-router-dom";

export default function Headertext() {
    const loc = useLocation();

    if (loc.pathname === `/internal/dashboard`) {
        return "Dashboard";
    } else if (loc.pathname === `/internal/users`) {
        return "Users";
    } else if (loc.pathname === `/internal/api/keys`) {
        return "API Keys";
    } else if (loc.pathname === `/internal/app/defaults`) {
        return "App Defaults";
    } else if (loc.pathname === `/internal/orders`) {
        return "Orders"
    } else if (loc.pathname === `/internal/carts`) {
        return "Carts"
    } else if (loc.pathname === `/internal/banners`) {
        return "Banners"
    } else if (loc.pathname === `/internal/categories`) {
        return "Categories"
    } else if (loc.pathname === `/internal/disputes`) {
        return "Disputes"
    } else if (loc.pathname === `/internal/ratings`) {
        return "Ratings"
    } else if (loc.pathname === `/internal/favorites`) {
        return "Favorites"
    } else if (loc.pathname === `/internal/products`) {
        return "Products"
    } else if (loc.pathname === `/internal/product/add`) {
        return "Add Product"
    } else if (loc.pathname === `/internal/product/edit/details`) {
        return "Edit Product"
    } else if (loc.pathname === `/internal/transactions`) {
        return "Transactions";
    } else if (loc.pathname === `/internal/settings`) {
        return "Settings";
    } else {
        return "Page not found";
    }
}