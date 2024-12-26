import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from '../assets/images/logo-white.png';
import Category from '../icons/Category';
import Swap from '../icons/Swap';
import Team from '../icons/Team';
import Token from '../icons/Token';
import Alarm from '../icons/Alarm';
import Tag from '../icons/Tag';
import Users from '../icons/Users';
import Wallet from '../icons/Wallet';
import Setting from '../icons/Setting';
import Check from '../icons/Check';
import Close from '../icons/Close';
import Logout from '../icons/Logout';
import { config } from "../config";
import useCookie from "../hooks/useCookie";
import Loading from "../icons/Loading";
import '../assets/css/style.css';
import Key from "../icons/Key";
import Arrowright from "../icons/Arrowright";
import Mail from "../icons/Mail";
import Document from "../icons/Document";
import Image from "../icons/Image";
import Folder from "../icons/Folder";
import Server from "../icons/Server";
import Cart from "../icons/Cart";
import AlertCircle from "../icons/AlertCircle";
import HelpCircle from "../icons/HelpCircle";
import Love from "../icons/Love";
import Lock from "../icons/Lock";
import ShoppingBag from "../icons/ShoppingBag";
import EyeOpenAlt from "../icons/EyeOpenAlt";
import Rating from "../icons/Rating";

export default function Layout() {
    const loc = useLocation();

    const { removeCookie } = useCookie(config.token, "");

    const navigate = useNavigate();

    const [loadingLogout, setLoadingLogout] = useState(false);

    const handleLogout = () => {
        setLoadingLogout(true);
        removeCookie();
        setTimeout(function () {
            navigate(`/signin`);
            window.location.reload(true);
        }, 1500)
    };

    return (
        <>
            <section className="xui-dashboard">
                <div className="navigator xui-text-white xui-px-2 disable-scrollbars">
                    <div className="brand xui-pt-2">
                        <div className="maxified xui-d-flex xui-flex-ai-center">
                            <Link className='xui-text-inherit xui-text-dc-none' to={`/internal/dashboard`}>
                                <div className='xui-d-inline-flex'>
                                    <img className='xui-img-30' src={Logo} alt='logo' />
                                    <div className='xui-pl-1'>
                                        <p className='xui-font-w-bold'>Admin</p>
                                        <span className='xui-font-sz-70 xui-opacity-7'>for E-Commerce</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="links xui-pt-2">
                        <div className='xui-d-flex psc-dashboard-profile'>
                            <div className='xui-pl-half'>
                                <h3 className='xui-font-sz-90 xui-font-w-normal'>Administration</h3>
                            </div>
                        </div>
                        <Link to={`/internal/dashboard`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/dashboard` ? 'active' : '')}>
                            <div className="icon">
                                <Category width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Dashboard</span>
                            </div>
                        </Link>
                        {/* <Link to={`/internal/api/keys`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/api/keys` ? 'active' : '')}>
                            <div className="icon">
                                <Key width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>API Keys</span>
                            </div>
                        </Link>
                        <Link to={`/internal/app/defaults`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/app/defaults` ? 'active' : '')}>
                            <div className="icon">
                                <Setting width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>App Defaults</span>
                            </div>
                        </Link>
                        <Link to={`/internal/banners`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/banners` ? 'active' : '')}>
                            <div className="icon">
                                <Image width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Banners</span>
                            </div>
                        </Link> */}
                        <Link to={`/internal/categories`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/categories` ? 'active' : '')}>
                            <div className="icon">
                                <Category width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Categories</span>
                            </div>
                        </Link>
                        {/* <Link to={`/internal/carts`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/carts` ? 'active' : '')}>
                            <div className="icon">
                                <Cart width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Carts</span>
                            </div>
                        </Link> */}
                        <Link to={`/internal/disputes`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/disputes` ? 'active' : '')}>
                            <div className="icon">
                                <AlertCircle width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Disputes</span>
                            </div>
                        </Link>
                        <Link to={`/internal/ratings`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/ratings` ? 'active' : '')}>
                            <div className="icon">
                                <Rating width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Ratings</span>
                            </div>
                        </Link>
                        {/* <Link to={`/internal/favorites`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/favorites` ? 'active' : '')}>
                            <div className="icon">
                                <Love width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Favorites</span>
                            </div>
                        </Link> */}
                        <Link to={`/internal/orders`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/orders` ? 'active' : '')}>
                            <div className="icon">
                                <Server width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Orders</span>
                            </div>
                        </Link>
                        <Link to={`/internal/products`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/products` || loc.pathname === `/internal/product/add` || loc.pathname === `/internal/product/edit/details` ? 'active' : '')}>
                            <div className="icon">
                                <ShoppingBag width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Products</span>
                            </div>
                        </Link>
                        <Link to={`/internal/transactions`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/transactions` ? 'active' : '')}>
                            <div className="icon">
                                <Wallet width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Transactions</span>
                            </div>
                        </Link>
                        {/* <Link to={`/internal/users`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6 " + (loc.pathname === `/internal/users` ? 'active' : '')}>
                            <div className="icon">
                                <Users width="20" height="20" />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Users</span>
                            </div>
                        </Link> */}
                        {/* <Link to={`/internal/settings`} className={"xui-text-inherit link-box xui-font-sz-90 xui-opacity-6" + (loc.pathname === `/internal/settings` ? 'active' : '')}>
                            <div className="icon">
                                <Setting />
                            </div>
                            <div className="name xui-ml-half">
                                <span>Settings</span>
                            </div>
                        </Link> */}
                        <div xui-modal-open="logoutModal" className="bottom-fixed xui-mt--5 xui-mb--5 xui-cursor-pointer">
                            <div xui-modal-open="logoutModal" className="xui-text-inherit link-box xui-font-sz-90 xui-opacity-6">
                                <div xui-modal-open="logoutModal" className="icon">
                                    <Logout width="20" height="20" />
                                </div>
                                <div xui-modal-open="logoutModal" className="name xui-ml-half">
                                    <span>Logout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className='xui-modal' xui-modal="logoutModal" id="logoutModal">
                    <div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
                        <center>
                            <h1>Logout confirmation</h1>
                            <p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to cotinue with this action?</p>
                        </center>
                        <div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
                            <div className="xui-d-inline-flex xui-flex-ai-center">
                                <button onClick={handleLogout} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
                                    <span className="xui-mr-half">Yes</span>
                                    {
                                        loadingLogout ?
                                            <Loading width="12" height="12" />
                                            : <Check width="20" height="20" />
                                    }
                                </button>
                            </div>
                            <div className="xui-d-inline-flex xui-flex-ai-center">
                                <button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close="logoutModal">
                                    <span className="xui-mr-half">No</span>
                                    <Close width="20" height="20" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <Outlet />
            </section>
        </>
    );
}