import { useEffect, useState } from "react";
import SuccessTick from "../assets/images/success-tick.png";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import Screen from '../components/Screen';
import Arrowright from '../icons/Arrowright';
import Arrowleft from '../icons/Arrowleft';
import Close from "../icons/Close";
import Delete from "../icons/Delete";
import Plus from "../icons/Plus";
import Reset from "../icons/Reset";
import Check from "../icons/Check";
import Cancel from "../icons/Cancel";
import Copy from "../icons/Copy";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { getRatings, getRatingsViaOrder, getRatingsViaProduct, getRating } from "../api/ratings";
import { useAddRating, useDeleteRating } from "../hooks/useRatings";
import Loading from "../icons/Loading";
import Filter from "../icons/Filter";
import EyeOpen from "../icons/EyeOpen";
import Search from "../icons/Search";
import EyeOpenAlt from "../icons/EyeOpenAlt";

export default function Ratings() {
	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const [currentFunction, setCurrentFunction] = useState("getAllRatings");

	const {
		description, errorAddRating, fullname, handleAddRating, handleDescription, handleFullname, handleProductUniqueId, 
		handleRating, loadingAddRating, productUniqueId, rating, removeAddRatingModal, setDescription, setFullname, 
		setProductUniqueId, setRating, setRemoveAddRatingModal, successAddRating
	} = useAddRating();

	const {
		errorDeleteRating, handleDeleteRating, loadingDeleteRating, removeDeleteRatingModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteRatingModal, successDeleteRating
	} = useDeleteRating();

	const [filterByOrderUniqueId, setFilterByOrderUniqueId] = useState("");
	const [removeOrderFilterModal, setRemoveOrderFilterModal] = useState(null);
	
	const [filterByProductUniqueId, setFilterByProductUniqueId] = useState("");
	const [removeProductFilterModal, setRemoveProductFilterModal] = useState(null);

	const showPreview = function (file) {
		const preview = file;

		window.open(preview, "_blank");
	};

	const [allRatings, setAllRatings] = useState(null);
	const [errorRatings, setErrorRatings] = useState(null);
	const [loadingAllRatings, setLoadingAllRatings] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleFilterByOrderUniqueId = (e) => { e.preventDefault(); setFilterByOrderUniqueId(e.target.value); };
	const handleFilterByProductUniqueId = (e) => { e.preventDefault(); setFilterByProductUniqueId(e.target.value); };

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); ratingsBySize(e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); ratingsByPage(parseInt(e.target.value), size); };

	const resetOrderFilterParameters = () => {
		setFilterByOrderUniqueId("");
		setCurrentFunction("getAllRatings");
	};

	const resetProductFilterParameters = () => {
		setFilterByProductUniqueId("");
		setCurrentFunction("getAllRatings");
	};

	const continueFilterByOrder = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllOrderRatings");
		getAllOrderRatings(filterByOrderUniqueId, page, size);
		setRemoveOrderFilterModal(true);
	};

	const continueFilterByProduct = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllProductRatings");
		getAllProductRatings(filterByProductUniqueId, page, size);
		setRemoveProductFilterModal(true);
	};

	async function callLastRatingFunction() {
		switch (currentFunction) {
			case "getAllRatings":
				getAllRatings(page, size);
				break;
			case "getAllOrderRatings":
				getAllOrderRatings(filterByOrderUniqueId, page, size);
				break;
			case "getAllProductRatings":
				getAllProductRatings(filterByProductUniqueId, page, size);
				break;
			// default:
			// 	getAllRatings(page, size);
		}
	};

	async function ratingsBySize(size) {
		switch (currentFunction) {
			case "getAllRatings":
				getAllRatings(page, size);
				break;
			case "getAllOrderRatings":
				getAllOrderRatings(filterByOrderUniqueId, page, size);
				break;
			case "getAllProductRatings":
				getAllProductRatings(filterByProductUniqueId, page, size);
				break;
			default:
				getAllRatings(page, size);
		}
	};

	async function ratingsByPage(page) {
		switch (currentFunction) {
			case "getAllRatings":
				getAllRatings(page, size);
				break;
			case "getAllOrderRatings":
				getAllOrderRatings(filterByOrderUniqueId, page, size);
				break;
			case "getAllProductRatings":
				getAllProductRatings(filterByProductUniqueId, page, size);
				break;
			default:
				getAllRatings(page, size);
		}
	};

	async function previousRatings() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) {
			switch (currentFunction) {
				case "getAllRatings":
					getAllRatings(page - 1, size);
					break;
				case "getAllOrderRatings":
					getAllOrderRatings(filterByOrderUniqueId, page - 1, size);
					break;
				case "getAllProductRatings":
					getAllProductRatings(filterByProductUniqueId, page - 1, size);
					break;
				default:
					getAllRatings(page - 1, size);
			}
		};
	};

	async function nextRatings() {
		if (page < allRatings.data.pages) setPage(page + 1);
		if (page < allRatings.data.pages) {
			switch (currentFunction) {
				case "getAllRatings":
					getAllRatings(page + 1, size);
					break;
				case "getAllOrderRatings":
					getAllOrderRatings(filterByOrderUniqueId, page + 1, size);
					break;
				case "getAllProductRatings":
					getAllProductRatings(filterByProductUniqueId, page + 1, size);
					break;
				default:
					getAllRatings(page + 1, size);
			}
		};
	};

	async function getAllRatings(_page, _size) {
		setLoadingAllRatings(true);
		const response = await getRatings(cookie, (_page || page), (_size || size));
		setAllRatings(response.data);
		if (response.error) setErrorRatings(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllRatings(false);
	};

	async function getAllOrderRatings(order_unique_id, _page, _size) {
		setLoadingAllRatings(true);
		const response = await getRatingsViaOrder(cookie, (_page || page), (_size || size), ({ order_unique_id: order_unique_id }));
		setAllRatings(response.data);
		if (response.error) setErrorRatings(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllRatings(false);
	};

	async function getAllProductRatings(product_unique_id, _page, _size) {
		setLoadingAllRatings(true);
		const response = await getRatingsViaProduct(cookie, (_page || page), (_size || size), ({ product_unique_id: product_unique_id }));
		setAllRatings(response.data);
		if (response.error) setErrorRatings(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllRatings(false);
	};

	useEffect(() => {
		if (allRatings === null) {
			callLastRatingFunction();
		}
	}, [allRatings]);

	const [loadingViewRating, setLoadingViewRating] = useState(false)
	const [errorViewRating, setErrorViewRating] = useState(null)
	const [viewRating, setViewRating] = useState(null)

	async function getARating(unique_id) {
		setLoadingViewRating(true)
		const response = await getRating(cookie, { unique_id });
		if (!response.err) {
			setViewRating(response.data);
			setSelectedImage(response.data.data.product.product_images ? response.data.data.product.product_images[0].image : "");
			setThumbnailImages(response.data.data.product.product_images ? response.data.data.product.product_images.map(image => image.image) : []);
		} else { setErrorViewRating(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewRating(false)
	};

	if (removeOrderFilterModal) {
		const modalResponse = document.querySelector("#filterByOrder");
		modalResponse.setAttribute("display", false);
		callLastRatingFunction();
		setRemoveOrderFilterModal(null);
	}
	if (removeProductFilterModal) {
		const modalResponse = document.querySelector("#filterByProduct");
		modalResponse.setAttribute("display", false);
		callLastRatingFunction();
		setRemoveProductFilterModal(null);
	}

	if (removeAddRatingModal) {
		const modalResponse = document.querySelector("#addRatingModal");
		modalResponse.setAttribute("display", false);
		callLastRatingFunction();
		setRemoveAddRatingModal(null);
	}

	if (removeDeleteRatingModal) {
		const modalResponse = document.querySelector("#deleteRatingModal");
		modalResponse.setAttribute("display", false);
		callLastRatingFunction();
		setRemoveDeleteRatingModal(null);
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

	const pageSelectArray = new Array(allRatings ? allRatings.data.pages : 0).fill(0);

	const [selectedImage, setSelectedImage] = useState("");
	const [thumbnailImages, setThumbnailImages] = useState([]);
	const handleThumbnailClick = (image) => {
		setSelectedImage(image);
	};

	const ratings = [
		{
			rate: "Very Bad",
			value: 1
		},
		{
			rate: "Bad",
			value: 2
		},
		{
			rate: "Ok",
			value: 3
		},
		{
			rate: "Good",
			value: 4
		},
		{
			rate: "Very Good",
			value: 5
		}
	];

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Ratings</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and filter all ratings</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="filterByOrder">
										<span className="xui-mr-half">Order</span>
										<Search width="15" height="15" />
									</button>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="filterByProduct">
										<span className="xui-mr-half">Product</span>
										<Search width="15" height="15" />
									</button>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addRatingModal">
										<span className="xui-mr-half">Add Rating</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllRatings ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allRatings && allRatings.success && allRatings.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Unique ID</th>
														<th className='xui-min-w-100'>Rating</th>
														<th className='xui-min-w-150'>User</th>
														<th className='xui-min-w-150'>Tracking Number</th>
														<th className='xui-min-w-150'>Contact Fullname</th>
														<th className='xui-min-w-150'>Contact Email</th>
														<th className='xui-min-w-150'>Category</th>
														<th className='xui-min-w-200'>Product</th>
														<th className='xui-min-w-150'>Product Image</th>
														<th className='xui-min-w-150'>Quantity</th>
														<th className='xui-min-w-150'>Amount</th>
														<th className='xui-min-w-150'>Shipping Fee</th>
														<th className='xui-min-w-150'>Status</th>
														<th className='xui-min-w-300'>Created At</th>
														<th className='xui-min-w-300'>Updated At</th>
														<th className='xui-min-w-150'>Action</th>
													</tr>
												</thead>
												<tbody>
													{allRatings.data.rows.sort((a, b) => new Date(a.createdAt.date + " " + a.createdAt.time).getTime() < new Date(b.createdAt.date + " " + b.createdAt.time).getTime() ? 1 : -1).map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>#{data.unique_id}</span>
																	<span title="Copy Unique ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.unique_id); setTextCopied(data.unique_id); }}>
																		{copiedText && textCopied === data.unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className='xui-opacity-5'>
																<span className="xui-font-w-bold">{ratings.find((e) => e.value === data.rating).rate} ({data.rating})</span>
															</td>
															<td className='xui-opacity-5'>
																{
																	data.user ?
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<span>{(data.user ? data.user.firstname + (data.user.middlename ? " " + data.user.middlename + " " : " ") + data.user.lastname : allRatings.data.user.firstname + (allRatings.data.user.middlename ? " " + allRatings.data.user.middlename + " " : " ") + allRatings.data.user.lastname)}</span>
																			<span title="Copy User Unique Id" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.user ? data.user.unique_id : allRatings.data.user.unique_id); setTextCopied(data.user ? data.user.unique_id : allRatings.data.user.unique_id); }}>
																				{copiedText && textCopied === (data.user ? data.user.unique_id : allRatings.data.user.unique_id) ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																		</div> :
																		<span>{"No user"}</span>
																}
															</td>
															<td className='xui-opacity-5'>
																{
																	data.order ? 
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<span>{data.order.tracking_number}</span>
																			<span title="Copy Tracking Number" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.order.tracking_number); setTextCopied(data.order.tracking_number); }}>
																				{copiedText && textCopied === (data.order.tracking_number) ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																		</div> : <span>No Data</span>
																}
															</td>
															<td className='xui-opacity-5'>
																{
																	data.order ? 
																		<span>{data.order.contact_fullname}</span>
																		: <span>No Data</span>
																}
															</td>
															<td className='xui-opacity-5'>
																{
																	data.order ? 
																		<span>{data.order.contact_email}</span>
																		: <span>No Data</span>
																} 
															</td>
															<td className='xui-opacity-5'>
																<span>{data.product.category.name}</span>
															</td>
															{/* <td className='xui-opacity-5'>
																<span>{data.product.name} ({data.product.remaining}/{data.product.quantity})</span>
															</td> */}
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>{data.product.name} ({data.product.remaining}/{data.product.quantity})</span>
																	<span title="Copy Product Unique ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.product_unique_id); setTextCopied(data.product_unique_id); }}>
																		{copiedText && textCopied === data.product_unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className=''>
																{
																	data.product.product_images === null || !data.product.product_images ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.product.product_images[0].image} alt="Category Image" />
																			<span title="Copy Image Link" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.product.product_images[0].image); setTextCopied(data.product.product_images[0].image); }}>
																				{copiedText && textCopied === data.product.product_images[0].image ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																			<span title="View File" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.product.product_images[0].image); }}>
																				<EyeOpen width="16" height="16" />
																			</span>
																		</div>
																}
															</td>
															<td className='xui-opacity-5'>
																{
																	data.order ? 
																		<span>{data.order.quantity.toLocaleString()}</span>
																		: <span>No Data</span>
																} 
															</td>
															<td className='xui-opacity-5'>
																{
																	data.order ? 
																		<span>{data.order.amount === 0 ? "Free" : "USD " + data.order.amount.toLocaleString()}</span>
																		: <span>No Data</span>
																}
															</td>
															<td className='xui-opacity-5'>
																{
																	data.order ? 
																		<span>{data.order.shipping_fee ? data.order.shipping_fee === 0 ? "Free" : "USD " + data.order.shipping_fee.toLocaleString() : "No shipping fee"}</span>
																		: <span>No Data</span>
																} 
															</td>
															<td className=''>
																{
																	data.status === 1 ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Active</span> : ""
																}
																{
																	data.status === 0 ?
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Inactive</span> : ""
																}
															</td>
															<td className='xui-opacity-5'>
																<span>{new Date(data.createdAt).toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{new Date(data.updatedAt).toLocaleString()}</span>
															</td>
															<td className=''>
																<div className="xui-d-flex xui-grid-gap-1">
																	<button title="View Rating Full Details"
																		onClick={() => {
																			getARating(data.unique_id);
																		}} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="viewRatingModal">
																		<EyeOpenAlt width="16" height="16" />
																	</button>
																	<button title="Delete Rating" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteRatingModal">
																		<Delete width="16" height="16" />
																	</button>
																</div>
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorRatings || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllRatings ?
								<Loading width="12" height="12" /> :
								(
									allRatings && allRatings.success && allRatings.data.rows.length !== 0 ?
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
												</select></span> of {allRatings ? allRatings.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousRatings}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextRatings}>
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
			<section className='xui-modal' xui-modal="filterByOrder" id="filterByOrder">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetOrderFilterParameters()} xui-modal-close="filterByOrder">
						<Close width="24" height="24" />
					</div>
					<h1>Filter Ratings By Order</h1>
					<form className="xui-form" onSubmit={continueFilterByOrder}>
						<div className="xui-form-box">
							<label>Order Unique Id</label>
							<input className="xui-font-sz-90" type="text" value={filterByOrderUniqueId} onChange={handleFilterByOrderUniqueId} required placeholder="Enter/Paste Order Unique Id"></input>
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
			<section className='xui-modal' xui-modal="filterByProduct" id="filterByProduct">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetProductFilterParameters()} xui-modal-close="filterByProduct">
						<Close width="24" height="24" />
					</div>
					<h1>Filter Ratings By Product</h1>
					<form className="xui-form" onSubmit={continueFilterByProduct}>
						<div className="xui-form-box">
							<label>Product Unique Id</label>
							<input className="xui-font-sz-90" type="text" value={filterByProductUniqueId} onChange={handleFilterByProductUniqueId} required placeholder="Enter/Paste Product Unique Id"></input>
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
			<section className='xui-modal' xui-modal="viewRatingModal" id="viewRatingModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-1000 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="viewRatingModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewRating ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewRating && viewRating.success ?
									<>
										<center>
											<h1>Rating Details</h1>
											<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">
												<div className='xui-d-inline-flex xui-flex-ai-center'>
													<span>#{viewRating.data?.unique_id}</span>
													<span title="Copy Rating ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(viewRating.data?.unique_id); setTextCopied(viewRating.data?.unique_id); }}>
														{copiedText && textCopied === viewRating.data?.unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
													</span>
												</div>
											</p>
										</center>
										<div className="xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-md-grid-col-2 xui-grid-gap-1">
											<div className="xui-w-200 xui-h-200 xui-m-1-half xui-mb-6">
												{/* {
													viewRating.data.product.product_images === null || !viewRating.data.product.product_images ?
														<center>No image</center> :
														<img className="xui-img-200 xui-max-h-200" src={viewRating.data.product.product_images[0].image} alt={viewRating.data.product.name + " Image"} />
												} */}
												{
													viewRating.data.user ?
														<>
															{
																viewRating.data.user.profile_image === null || !viewRating.data.user.profile_image ?
																	<center>No image</center> :
																	<img className="xui-img-200 xui-max-h-200 xui-bdr-rad-circle" src={viewRating.data.user.profile_image} alt={viewRating.data.user.firstname + (viewRating.data.user.middlename ? " " + viewRating.data.user.middlename + " " : " ") + viewRating.data.user.lastname + " Profile Image"} />
															}
														</> :
														<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">No user</p>
												}
												<div className="xui-mb-4">
												</div>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">Product Images Below</p>
												<center>
													<p className="xui-opacity-4 xui-font-sz-200 xui-m-half">⬇️</p>
												</center>
											</div>
											<div className="xui-m-1-half xui-lg-ml--10 xui-md-ml--7">
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half" style={{ textDecoration: "underline" }}>User Details: </p>
												{
													viewRating.data.user ?
														<>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Name -</span> {viewRating.data.user.firstname + (viewRating.data.user.middlename ? " " + viewRating.data.user.middlename + " " : " ") + viewRating.data.user.lastname}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Email -</span> {viewRating.data.user.email}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Phone Number -</span> {viewRating.data.user.phone_number}</p>
														</> :
														<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">No user</p>
												}
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">Fullname: <span className="xui-font-w-bold">{viewRating.data.fullname}</span> </p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">Rating: <span className="xui-font-w-bold">{ratings.find((e) => e.value === viewRating.data.rating).rate} ({viewRating.data.rating})</span> </p>
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half" style={{ textDecoration: "underline" }}>Description: </p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">{viewRating.data.description}</p>
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Category -</span> {viewRating.data.product.category.name}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Product -</span> {viewRating.data.product.name}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Product Price -</span> USD {viewRating.data.product.sales_price ? <>{viewRating.data.product.sales_price.toLocaleString()} <s> USD {viewRating.data.product.price.toLocaleString()}</s> </> : viewRating.data.product.price.toLocaleString()}</p>
												<hr></hr>
												{
													viewRating.data.order ?
														<>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half" style={{ textDecoration: "underline" }}>Order Details: </p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Unique Id - </span>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span> {viewRating.data.order.unique_id}</span>
																	<span title="Copy Rating ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(viewRating.data.order.unique_id); setTextCopied(viewRating.data.order.unique_id); }}>
																		{copiedText && textCopied === viewRating.data.order.unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Tracking Number -</span> {viewRating.data.order.tracking_number}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Shipping Fee -</span> USD {viewRating.data.order.shipping_fee.toLocaleString()}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Quantity -</span> {viewRating.data.order.quantity.toLocaleString()}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Amount -</span> USD {viewRating.data.order.amount.toLocaleString()}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Payment Method -</span> {viewRating.data.order.payment_method}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Paid -</span> {
																viewRating.data.order.paid ?
																	<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
																	<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
															}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Shipped -</span> {
																viewRating.data.order.shipped ?
																	<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
																	<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
															}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Rating -</span> {
																viewRating.data.order.ratingd ?
																	<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
																	<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
															}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Delivery Status - </span>
																{
																	viewRating.data.order.delivery_status === "Completed" || viewRating.data.order.delivery_status === "Paid" || viewRating.data.order.delivery_status === "Shipped" || viewRating.data.order.delivery_status === "Refunded" ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>{viewRating.data.order.delivery_status}</span> : ""
																}
																{
																	viewRating.data.order.delivery_status === "Processing" || viewRating.data.order.delivery_status === "Ratingd" ?
																		<span className='xui-badge xui-badge-warning xui-font-sz-80 xui-bdr-rad-half'>{viewRating.data.order.delivery_status}</span> : ""
																}
																{
																	viewRating.data.order.delivery_status === "Shipping" || viewRating.data.order.delivery_status === "Received" || viewRating.data.order.delivery_status === "Refund" ?
																		<span className='xui-badge xui-badge-info xui-font-sz-80 xui-bdr-rad-half'>{viewRating.data.order.delivery_status}</span> : ""
																}
																{
																	viewRating.data.order.delivery_status === "Cancelled" || viewRating.data.order.delivery_status === "Refund Denied" ?
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{viewRating.data.order.delivery_status}</span> : ""
																}
															</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Created</span> - {viewRating.data.order.createdAt}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Last Updated</span> - {viewRating.data.order.updatedAt}</p>
														</>
														: <span>No order Data</span>
												}
											</div>
										</div>
										<center>
											<p className="xui-opacity-4 xui-font-sz-100 xui-py-half">Created - {viewRating.data.createdAt} | Last Updated - {viewRating.data.updatedAt}</p>
											{/* {
												viewRating.data.order.delivery_status === "Refund" ? 
													<div className="xui-m-2">
														<button title="Accept User Rating" onClick={() => { AcceptRatingSetUniqueId(viewRating.data.order.order_unique_id); AcceptRatingSetUserUniqueId(viewRating.data.user.unique_id); }} className="xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50" xui-modal-open="acceptRatingModal">
															<Check width="16" height="16" />
														</button>
														<button title="Deny User Rating" onClick={() => { DenyRatingSetUniqueId(viewRating.data.order.order_unique_id); DenyRatingSetUserUniqueId(viewRating.data.user.unique_id); }} className="xui-ml-3 xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="denyRatingModal">
															<Close width="16" height="16" />
														</button>
													</div> : null
											} */}
										</center>
										{
											viewRating.data.product.product_images === null || !viewRating.data.product.product_images ?
												<center>No image</center> :
												<>
													<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-md-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
														{
															thumbnailImages.map((image, index) => (
																<div>
																	<img key={index} className={`thumbnail-image xui-w-fluid-100 xui-lg-h-200 xui-h-100 ${selectedImage === image ? 'selected' : ''}`} src={image} xui-img-src={image} alt={viewRating.data.product.name + ` Image ${index + 1}`} onClick={() => handleThumbnailClick(image)} />
																	<p className="xui-opacity-4 xui-font-sz-100 xui-m-half xui-cursor-pointer xui-text-dc-underline" onClick={() => {
																		showPreview(image);
																	}}><span className="xui-font-w-bold">Click to view</span></p>
																</div>
															))
														}
													</div>
												</>
										}
									</> :
									<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
										<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
											<center className="xui-text-red">
												<Close width="100" height="100" />
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewRating}</h3>
											</center>
										</div>
									</div>
							)
					}
				</div>
			</section>
			<section className='xui-modal' xui-modal="addRatingModal" id="addRatingModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addRatingModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Rating</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddRating}>
						<div className="xui-form-box xui-mt-2">
							<label>Product Unique Id</label>
							<input className="xui-font-sz-90" type="text" value={productUniqueId} onChange={handleProductUniqueId} required placeholder="Enter/Paste product unique id "></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Fullname</label>
							<input className="xui-font-sz-90" type="text" value={fullname} onChange={handleFullname} required placeholder="Enter fullname"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Rating - {rating ? ratings.find((e) => e.value === parseInt(rating)).rate + " (" + rating + ")" : <span className="xui-text-red">None</span> }</label>
							{/* <input className="xui-font-sz-90" type="number" min={1} max={5} value={rating} onChange={handleRating} required placeholder="Enter rating of product"></input> */}
							<input className="xui-font-sz-90" type="range" title={rating} min={1} max={5} value={rating} onChange={handleRating} required placeholder="Choose rating of product"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Description</label>
							<textarea type={"text"} required placeholder={"Enter description"} value={description} onChange={handleDescription}></textarea>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddRating} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Rating</span>
								{
									loadingAddRating ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddRating}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddRating}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="deleteRatingModal" id="deleteRatingModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Rating</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteRating}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteRating}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteRating} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteRating ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteRating ? "" : "deleteRatingModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
		</>
	);

};