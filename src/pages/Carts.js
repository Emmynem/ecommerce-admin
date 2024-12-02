import { useEffect, useState } from "react";
import SuccessTick from "../assets/images/success-tick.png";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import Screen from '../components/Screen';
import Arrowright from '../icons/Arrowright';
import Arrowleft from '../icons/Arrowleft';
import Close from "../icons/Close";
import Plus from "../icons/Plus";
import Reset from "../icons/Reset";
import Check from "../icons/Check";
import Cancel from "../icons/Cancel";
import Copy from "../icons/Copy";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { getCarts, getCartsViaUser } from "../api/carts";
import Loading from "../icons/Loading";
import Filter from "../icons/Filter";
import EyeOpen from "../icons/EyeOpen";
import Search from "../icons/Search";

export default function Carts() {
	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const [currentFunction, setCurrentFunction] = useState("getAllCarts");

	const [filterByUserUniqueId, setFilterByUserUniqueId] = useState("");
	const [removeUserFilterModal, setRemoveUserFilterModal] = useState(null);

	const showPreview = function (file) {
		const preview = file;

		window.open(preview, "_blank");
	};

	const [allCarts, setAllCarts] = useState(null);
	const [errorCarts, setErrorCarts] = useState(null);
	const [loadingAllCarts, setLoadingAllCarts] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleFilterByUserUniqueId = (e) => { e.preventDefault(); setFilterByUserUniqueId(e.target.value); };

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); cartsBySize(e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); cartsByPage(parseInt(e.target.value), size); };

	const resetUserFilterParameters = () => {
		setFilterByUserUniqueId("");
		setCurrentFunction("getAllCarts");
	};

	const continueUserFilterByUser = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllUserCarts");
		getAllUserCarts(filterByUserUniqueId, page, size);
		setRemoveUserFilterModal(true);
	};

	async function callLastCartFunction() {
		switch (currentFunction) {
			case "getAllCarts":
				getAllCarts(page, size);
				break;
			case "getAllUserCarts":
				getAllUserCarts(filterByUserUniqueId, page, size);
				break;
			// default:
			// 	getAllCarts(page, size);
		}
	};

	async function cartsBySize(size) {
		switch (currentFunction) {
			case "getAllCarts":
				getAllCarts(page, size);
				break;
			case "getAllUserCarts":
				getAllUserCarts(filterByUserUniqueId, page, size);
				break;
			default:
				getAllCarts(page, size);
		}
	};

	async function cartsByPage(page) {
		switch (currentFunction) {
			case "getAllCarts":
				getAllCarts(page, size);
				break;
			case "getAllUserCarts":
				getAllUserCarts(filterByUserUniqueId, page, size);
				break;
			default:
				getAllCarts(page, size);
		}
	};

	async function previousCarts() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) {
			switch (currentFunction) {
				case "getAllCarts":
					getAllCarts(page - 1, size);
					break;
				case "getAllUserCarts":
					getAllUserCarts(filterByUserUniqueId, page - 1, size);
					break;
				default:
					getAllCarts(page - 1, size);
			}
		};
	};

	async function nextCarts() {
		if (page < allCarts.data.pages) setPage(page + 1);
		if (page < allCarts.data.pages) {
			switch (currentFunction) {
				case "getAllCarts":
					getAllCarts(page + 1, size);
					break;
				case "getAllUserCarts":
					getAllUserCarts(filterByUserUniqueId, page + 1, size);
					break;
				default:
					getAllCarts(page + 1, size);
			}
		};
	};

	async function getAllCarts(_page, _size) {
		setLoadingAllCarts(true);
		const response = await getCarts(cookie, (_page || page), (_size || size));
		setAllCarts(response.data);
		if (response.error) setErrorCarts(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllCarts(false);
	};

	async function getAllUserCarts(user_unique_id, _page, _size) {
		setLoadingAllCarts(true);
		const response = await getCartsViaUser(cookie, (_page || page), (_size || size), ({ user_unique_id: user_unique_id }));
		setAllCarts(response.data);
		if (response.error) setErrorCarts(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllCarts(false);
	};

	useEffect(() => {
		if (allCarts === null) {
			callLastCartFunction();
		}
	}, [allCarts]);

	if (removeUserFilterModal) {
		const modalResponse = document.querySelector("#filterByUser");
		modalResponse.setAttribute("display", false);
		callLastCartFunction();
		setRemoveUserFilterModal(null);
	}

	const copySomeText = (text) => {
		navigator.clipboard.writeText(text);
	};

	const copyText = (text) => {
		copySomeText(text);
		setCopiedText(true);
		setTimeout(function () {
			setCopiedText(false);
		}, 2000)
	};

	const pageSelectArray = new Array(allCarts ? allCarts.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Carts</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and filter all carts</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="filterByUser">
										<span className="xui-mr-half">Search</span>
										<Search width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllCarts ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allCarts && allCarts.success && allCarts.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>User</th>
														<th className='xui-min-w-150'>Category</th>
														<th className='xui-min-w-200'>Product</th>
														<th className='xui-min-w-200'>Product Price</th>
														<th className='xui-min-w-150'>Product Image</th>
														<th className='xui-min-w-150'>Quantity</th>
														<th className='xui-min-w-150'>Shipping Fee</th>
														<th className='xui-min-w-150'>Status</th>
														<th className='xui-min-w-300'>Created At</th>
														<th className='xui-min-w-300'>Updated At</th>
													</tr>
												</thead>
												<tbody>
													{allCarts.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>{(data.user_data ? data.user_data.firstname + (data.user_data.middlename ? " " + data.user_data.middlename + " " : " ") + data.user_data.lastname : allCarts.data.user_data.firstname + (allCarts.data.user_data.middlename ? " " + allCarts.data.user_data.middlename + " " : " ") + allCarts.data.user_data.lastname)}</span>
																	<span title="Copy Unique Id" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.user_data ? data.user_data.user_unique_id : allCarts.data.user_data.user_unique_id); setTextCopied(data.user_data ? data.user_data.user_unique_id : allCarts.data.user_data.user_unique_id); }}>
																		{copiedText && textCopied === (data.user_data ? data.user_data.user_unique_id : allCarts.data.user_data.user_unique_id) ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.category_data.name}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.product_data.name} ({data.product_data.remaining}/{data.product_data.quantity})</span>
															</td>
															<td className='xui-opacity-5'>
																<span><b>NGN {data.product_data.sales_price ? <>{data.product_data.sales_price.toLocaleString()} <s style={{textDecoration: ""}}> NGN {data.product_data.price.toLocaleString()}</s> </> : data.product_data.price.toLocaleString()}</b></span>
															</td>
															<td className=''>
																{
																	data.product_images_data === null || !data.product_images_data ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.product_images_data[0].image} alt="Product Image" />
																			<span title="Copy Image Link" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.product_images_data[0].image); setTextCopied(data.product_images_data[0].image); }}>
																				{copiedText && textCopied === data.product_images_data[0].image ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																			<span title="View File" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.product_images_data[0].image); }}>
																				<EyeOpen width="16" height="16" />
																			</span>
																		</div>
																}
															</td>
															<td className='xui-opacity-5'>
																<span>{data.quantity.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.shipping_fee ? data.shipping_fee === 0 ? "Free" : "NGN " + data.shipping_fee.toLocaleString() : "No shipping fee"}</span>
															</td>
															<td className=''>
																{
																	data.status === 1 ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Active</span> : ""
																}
																{
																	data.status === 2 ?
																		<span className='xui-badge xui-badge-blue xui-font-sz-80 xui-bdr-rad-half'>Checked out</span> : ""
																}
															</td>
															<td className='xui-opacity-5'>
																<span>{data.createdAt.date} at {data.createdAt.time}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.updatedAt.date} at {data.updatedAt.time}</span>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div> :
										<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
											<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
												<center className="xui-text-red">
													<Close width="100" height="100" />
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorCarts || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllCarts ?
								<Loading width="12" height="12" /> :
								(
									allCarts && allCarts.success ?
										<div className='xui-d-flex xui-flex-jc-flex-end xui-py-1 xui-font-sz-85 xui-opacity-5 xui-mt-1'>
											<div className='xui-d-inline-flex xui-flex-ai-center'>
												<span>Rows per page:</span>
												<select value={size} onChange={handleSize} className='psc-select-rows-per-page xui-ml-half'>
													<option value={20}>20</option>
													<option value={50}>50</option>
													<option value={100}>100</option>
													<option value={500}>500</option>
													<option value={1000}>1000</option>
												</select>
											</div>
											<div className='xui-mx-1 xui-lg-mx-2'>
												<span><span className='xui-font-w-bold'><select value={page} onChange={handlePage} className='psc-select-rows-per-page xui-ml-half'>
													{
														pageSelectArray.map((value, index) => {
															return (
																<option key={index + 1} value={index + 1}>{index + 1}</option>
															)
														})
													}
												</select></span> of {allCarts ? allCarts.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousCarts}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextCarts}>
													<Arrowright width="18" height="18" />
												</div>
											</div>
										</div> :
										""
								)
						}
					</section>
				</Content>
			</Screen>
			<section className='xui-modal' xui-modal="filterByUser" id="filterByUser">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetUserFilterParameters()} xui-modal-close="filterByUser">
						<Close width="24" height="24" />
					</div>
					<h1>Filter Carts By User</h1>
					<form className="xui-form" onSubmit={continueUserFilterByUser}>
						<div className="xui-form-box">
							<label>User Unique Id</label>
							<input className="xui-font-sz-90" type="text" value={filterByUserUniqueId} onChange={handleFilterByUserUniqueId} required placeholder="Enter/Paste User UniqueId"></input>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-70">
								<Filter width="16" height="16" />
								<span className="xui-ml-half">Filter</span>
							</button>
						</div>
					</form>
				</div>
			</section>
		</>
	);

};