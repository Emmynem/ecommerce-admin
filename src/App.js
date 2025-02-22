import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { config } from "./config";
import useCookie from "./hooks/useCookie";
import Layout from "./pages/Layout";
import Access from "./pages/Access";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import SignIn from "./pages/auth/SignIn";
import ApiKeys from "./pages/ApiKeys";
import Orders from "./pages/Orders";
import Banners from "./pages/Banners";
import Carts from "./pages/Carts";
import Categories from "./pages/Categories";
import Disputes from "./pages/Disputes";
import Ratings from "./pages/Ratings";
import Favorites from "./pages/Favorites";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProductDetails from "./pages/EditProductDetails";
import AppDefaults from "./pages/AppDefaults";

export default function App(){
  const {cookie} = useCookie(config.key, "");

  return(
    <BrowserRouter>
      <Routes>
        <Route path='/internal' element={<Layout />}>
          <Route path="dashboard" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Dashboard />)
          } />
          <Route path="api/keys" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<ApiKeys />)
          } />
          <Route path="app/defaults" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<AppDefaults />)
          } />
          <Route path="transactions" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Transactions />)
          } />
          <Route path="orders" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
            (<Navigate replace to={"/signin"} />) : 
            (<Orders />)
          } />
          {/* <Route path="users" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Users />)
          } /> */}
          <Route path="banners" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Banners />)
          } />
          <Route path="carts" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Carts />)
          } />
          <Route path="categories" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Categories />)
          } />
          <Route path="disputes" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Disputes />)
          } />
          <Route path="ratings" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Ratings />)
          } />
          <Route path="favorites" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Favorites />)
          } />
          <Route path="products" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<Products />)
          } />
          <Route path="product/add" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
             (<Navigate replace to={"/signin"} />) :
             (<AddProduct />)
          } />
          <Route path="product/edit/details" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<EditProductDetails />)
          } />
          {/* <Route path="settings" element={
            !cookie || cookie === '' || cookie === '[object Object]' ?
              (<Navigate replace to={"/signin"} />) :
              (<Dashboard />)
          } /> */}
          <Route path="*" element={<Navigate replace to={"dashboard"} />} />
        </Route>
        <Route path='/' element={<Access />}>
          <Route index element={<SignIn />} />
          <Route path="signin" element={
            cookie && cookie !== '' && cookie !== '[object Object]' ?
              (<Navigate replace to={"/internal/dashboard"} />) :
              (<SignIn />)
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}