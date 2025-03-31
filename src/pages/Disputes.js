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
import { getDisputes, getDisputesViaOrder, getDispute } from "../api/disputes";
import { useAcceptOrderDispute, useDenyOrderDispute } from "../hooks/useOrders";
import Loading from "../icons/Loading";
import Filter from "../icons/Filter";
import EyeOpen from "../icons/EyeOpen";
import Search from "../icons/Search";
import EyeOpenAlt from "../icons/EyeOpenAlt";

export default function Disputes() {
	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const [currentFunction, setCurrentFunction] = useState("getAllDisputes");

	const {
		errorAcceptOrderDispute, handleAcceptOrderDispute, loadingAcceptOrderDispute, removeAcceptOrderDisputeModal, 
		setRemoveAcceptOrderDisputeModal, setUniqueId: AcceptDisputeSetUniqueId, setUserUniqueId: AcceptDisputeSetUserUniqueId, 
		successAcceptOrderDispute
	} = useAcceptOrderDispute();

	const {
		errorDenyOrderDispute, handleDenyOrderDispute, loadingDenyOrderDispute, removeDenyOrderDisputeModal,
		setRemoveDenyOrderDisputeModal, setUniqueId: DenyDisputeSetUniqueId, setUserUniqueId: DenyDisputeSetUserUniqueId,
		successDenyOrderDispute, feedback, handleFeedback, setFeedback
	} = useDenyOrderDispute();

	const [filterByOrderUniqueId, setFilterByOrderUniqueId] = useState("");
	const [removeOrderFilterModal, setRemoveOrderFilterModal] = useState(null);

	const showPreview = function (file) {
		const preview = file;

		window.open(preview, "_blank");
	};

	const [allDisputes, setAllDisputes] = useState(null);
	const [errorDisputes, setErrorDisputes] = useState(null);
	const [loadingAllDisputes, setLoadingAllDisputes] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleFilterByOrderUniqueId = (e) => { e.preventDefault(); setFilterByOrderUniqueId(e.target.value); };

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); disputesBySize(e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); disputesByPage(parseInt(e.target.value), size); };

	const resetOrderFilterParameters = () => {
		setFilterByOrderUniqueId("");
		setCurrentFunction("getAllDisputes");
	};

	const continueFilterByOrder = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllOrderDisputes");
		getAllOrderDisputes(filterByOrderUniqueId, page, size);
		setRemoveOrderFilterModal(true);
	};

	async function callLastDisputeFunction() {
		switch (currentFunction) {
			case "getAllDisputes":
				getAllDisputes(page, size);
				break;
			case "getAllOrderDisputes":
				getAllOrderDisputes(filterByOrderUniqueId, page, size);
				break;
			// default:
			// 	getAllDisputes(page, size);
		}
	};

	async function disputesBySize(size) {
		switch (currentFunction) {
			case "getAllDisputes":
				getAllDisputes(page, size);
				break;
			case "getAllOrderDisputes":
				getAllOrderDisputes(filterByOrderUniqueId, page, size);
				break;
			default:
				getAllDisputes(page, size);
		}
	};

	async function disputesByPage(page) {
		switch (currentFunction) {
			case "getAllDisputes":
				getAllDisputes(page, size);
				break;
			case "getAllOrderDisputes":
				getAllOrderDisputes(filterByOrderUniqueId, page, size);
				break;
			default:
				getAllDisputes(page, size);
		}
	};

	async function previousDisputes() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) {
			switch (currentFunction) {
				case "getAllDisputes":
					getAllDisputes(page - 1, size);
					break;
				case "getAllOrderDisputes":
					getAllOrderDisputes(filterByOrderUniqueId, page - 1, size);
					break;
				default:
					getAllDisputes(page - 1, size);
			}
		};
	};

	async function nextDisputes() {
		if (page < allDisputes.data.pages) setPage(page + 1);
		if (page < allDisputes.data.pages) {
			switch (currentFunction) {
				case "getAllDisputes":
					getAllDisputes(page + 1, size);
					break;
				case "getAllOrderDisputes":
					getAllOrderDisputes(filterByOrderUniqueId, page + 1, size);
					break;
				default:
					getAllDisputes(page + 1, size);
			}
		};
	};

	async function getAllDisputes(_page, _size) {
		setLoadingAllDisputes(true);
		const response = await getDisputes(cookie, (_page || page), (_size || size));
		setAllDisputes(response.data);
		if (response.error) setErrorDisputes(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllDisputes(false);
	};

	async function getAllOrderDisputes(order_unique_id, _page, _size) {
		setLoadingAllDisputes(true);
		const response = await getDisputesViaOrder(cookie, (_page || page), (_size || size), ({ order_unique_id: order_unique_id }));
		setAllDisputes(response.data);
		if (response.error) setErrorDisputes(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllDisputes(false);
	};

	useEffect(() => {
		if (allDisputes === null) {
			callLastDisputeFunction();
		}
	}, [allDisputes]);

	const [loadingViewDispute, setLoadingViewDispute] = useState(false)
	const [errorViewDispute, setErrorViewDispute] = useState(null)
	const [viewDispute, setViewDispute] = useState(null)

	async function getADispute(unique_id) {
		setLoadingViewDispute(true)
		const response = await getDispute(cookie, { unique_id });
		if (!response.err) {
			setViewDispute(response.data);
			setSelectedImage(response.data.data.order.product.product_images ? response.data.data.order.product.product_images[0].image : "");
			setThumbnailImages(response.data.data.order.product.product_images ? response.data.data.order.product.product_images.map(image => image.image) : []);
		} else { setErrorViewDispute(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewDispute(false)
	};

	if (removeOrderFilterModal) {
		const modalResponse = document.querySelector("#filterByOrder");
		modalResponse.setAttribute("display", false);
		callLastDisputeFunction();
		setRemoveOrderFilterModal(null);
	}

	if (removeAcceptOrderDisputeModal) {
		const modalResponse = document.querySelector("#acceptDisputeModal");
		modalResponse.setAttribute("display", false);
		callLastDisputeFunction();
		setRemoveAcceptOrderDisputeModal(null);
	}
	if (removeDenyOrderDisputeModal) {
		const modalResponse = document.querySelector("#denyDisputeModal");
		modalResponse.setAttribute("display", false);
		callLastDisputeFunction();
		setRemoveDenyOrderDisputeModal(null);
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

	const pageSelectArray = new Array(allDisputes ? allDisputes.data.pages : 0).fill(0);

	const [selectedImage, setSelectedImage] = useState("");
	const [thumbnailImages, setThumbnailImages] = useState([]);
	const handleThumbnailClick = (image) => {
		setSelectedImage(image);
	};

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Disputes</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and filter all disputes</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="filterByOrder">
										<span className="xui-mr-half">Search</span>
										<Search width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllDisputes ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allDisputes && allDisputes.success && allDisputes.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Unique ID</th>
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
														<th className='xui-min-w-100'>Action</th>
													</tr>
												</thead>
												<tbody>
													{allDisputes.data.rows.sort((a, b) => new Date(a.createdAt.date + " " + a.createdAt.time).getTime() < new Date(b.createdAt.date + " " + b.createdAt.time).getTime() ? 1 : -1).map((data, i) => (
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
																{
																	data.user ?
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<span>{(data.user ? data.user.firstname + (data.user.middlename ? " " + data.user.middlename + " " : " ") + data.user.lastname : allDisputes.data.user.firstname + (allDisputes.data.user.middlename ? " " + allDisputes.data.user.middlename + " " : " ") + allDisputes.data.user.lastname)}</span>
																			<span title="Copy User Unique Id" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.user ? data.user.unique_id : allDisputes.data.user.unique_id); setTextCopied(data.user ? data.user.unique_id : allDisputes.data.user.unique_id); }}>
																				{copiedText && textCopied === (data.user ? data.user.unique_id : allDisputes.data.user.unique_id) ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																		</div> :
																		<span>{"No user"}</span>
																}
															</td>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>{data.order.tracking_number}</span>
																	<span title="Copy Tracking Number" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.order.tracking_number); setTextCopied(data.order.tracking_number); }}>
																		{copiedText && textCopied === (data.order.tracking_number) ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.order.contact_fullname}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.order.contact_email}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.order.product.category.name}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.order.product.name} ({data.order.product.remaining}/{data.order.product.quantity})</span>
															</td>
															<td className=''>
																{
																	data.order.product.product_images === null || !data.order.product.product_images ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.order.product.product_images[0].image} alt="Category Image" />
																			<span title="Copy Image Link" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.order.product.product_images[0].image); setTextCopied(data.order.product.product_images[0].image); }}>
																				{copiedText && textCopied === data.order.product.product_images[0].image ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																			<span title="View File" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.order.product.product_images[0].image); }}>
																				<EyeOpen width="16" height="16" />
																			</span>
																		</div>
																}
															</td>
															<td className='xui-opacity-5'>
																<span>{data.order.quantity.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.order.amount === 0 ? "Free" : "USD " + data.order.amount.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.order.shipping_fee ? data.order.shipping_fee === 0 ? "Free" : "USD " + data.order.shipping_fee.toLocaleString() : "No shipping fee"}</span>
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
																	<button title="View Dispute Full Details"
																		onClick={() => {
																			getADispute(data.unique_id);
																		}} className="xui-d-inline-flex xui-flex-ai-center xui-btn xui-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="viewDisputeModal">
																		<EyeOpenAlt width="20" height="20" />
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorDisputes || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllDisputes ?
								<Loading width="12" height="12" /> :
								(
									allDisputes && allDisputes.success && allDisputes.data.rows.length !== 0 ?
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
												</select></span> of {allDisputes ? allDisputes.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousDisputes}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextDisputes}>
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
					<h1>Filter Disputes By Order</h1>
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
			<section className='xui-modal' xui-modal="viewDisputeModal" id="viewDisputeModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-1000 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="viewDisputeModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewDispute ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewDispute && viewDispute.success ?
									<>
										<center>
											<h1>Dispute Details</h1>
											<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">
												<div className='xui-d-inline-flex xui-flex-ai-center'>
													<span>#{viewDispute.data?.unique_id}</span>
													<span title="Copy Dispute ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(viewDispute.data?.unique_id); setTextCopied(viewDispute.data?.unique_id); }}>
														{copiedText && textCopied === viewDispute.data?.unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
													</span>
												</div>
											</p>
										</center>
										<div className="xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-md-grid-col-2 xui-grid-gap-1">
											<div className="xui-w-200 xui-h-200 xui-m-1-half xui-mb-6">
												{/* {
													viewDispute.data.order.product.product_images === null || !viewDispute.data.order.product.product_images ?
														<center>No image</center> :
														<img className="xui-img-200 xui-max-h-200" src={viewDispute.data.order.product.product_images[0].image} alt={viewDispute.data.order.product.name + " Image"} />
												} */}
												{
													viewDispute.data.user ?
														<>
															{
																viewDispute.data.user.profile_image === null || !viewDispute.data.user.profile_image ?
																	<center>No image</center> :
																	<img className="xui-img-200 xui-max-h-200 xui-bdr-rad-circle" src={viewDispute.data.user.profile_image} alt={viewDispute.data.user.firstname + (viewDispute.data.user.middlename ? " " + viewDispute.data.user.middlename + " " : " ") + viewDispute.data.user.lastname + " Profile Image"} />
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
													viewDispute.data.user ?
														<>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Name -</span> {viewDispute.data.user.firstname + (viewDispute.data.user.middlename ? " " + viewDispute.data.user.middlename + " " : " ") + viewDispute.data.user.lastname}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Email -</span> {viewDispute.data.user.email}</p>
															<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Phone Number -</span> {viewDispute.data.user.phone_number}</p>
														</> :
														<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">No user</p>
												}
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Category -</span> {viewDispute.data.order.product.category.name}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Product -</span> {viewDispute.data.order.product.name}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Product Price -</span> USD {viewDispute.data.order.product.sales_price ? <>{viewDispute.data.order.product.sales_price.toLocaleString()} <s> USD {viewDispute.data.order.product.price.toLocaleString()}</s> </> : viewDispute.data.order.product.price.toLocaleString()}</p>
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half" style={{ textDecoration: "underline" }}>Order Details: </p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Unique Id - </span> 
													<div className='xui-d-inline-flex xui-flex-ai-center'>
														<span> {viewDispute.data.order.unique_id}</span>
														<span title="Copy Dispute ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(viewDispute.data.order.unique_id); setTextCopied(viewDispute.data.order.unique_id); }}>
															{copiedText && textCopied === viewDispute.data.order.unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
														</span>
													</div>
												</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Tracking Number -</span> {viewDispute.data.order.tracking_number}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Shipping Fee -</span> USD {viewDispute.data.order.shipping_fee.toLocaleString()}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Quantity -</span> {viewDispute.data.order.quantity.toLocaleString()}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Amount -</span> USD {viewDispute.data.order.amount.toLocaleString()}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Payment Method -</span> {viewDispute.data.order.payment_method}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Paid -</span> {
													viewDispute.data.order.paid ?
														<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
														<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
												}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Shipped -</span> {
													viewDispute.data.order.shipped ?
														<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
														<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
												}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Disputed -</span> {
													viewDispute.data.order.disputed ?
														<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
														<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
												}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Delivery Status - </span>
													{
														viewDispute.data.order.delivery_status === "Completed" || viewDispute.data.order.delivery_status === "Paid" || viewDispute.data.order.delivery_status === "Shipped" || viewDispute.data.order.delivery_status === "Refunded" ?
															<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>{viewDispute.data.order.delivery_status}</span> : ""
													}
													{
														viewDispute.data.order.delivery_status === "Processing" || viewDispute.data.order.delivery_status === "Disputed" ?
															<span className='xui-badge xui-badge-warning xui-font-sz-80 xui-bdr-rad-half'>{viewDispute.data.order.delivery_status}</span> : ""
													}
													{
														viewDispute.data.order.delivery_status === "Shipping" || viewDispute.data.order.delivery_status === "Received" || viewDispute.data.order.delivery_status === "Refund" ?
															<span className='xui-badge xui-badge-info xui-font-sz-80 xui-bdr-rad-half'>{viewDispute.data.order.delivery_status}</span> : ""
													}
													{
														viewDispute.data.order.delivery_status === "Cancelled" || viewDispute.data.order.delivery_status === "Refund Denied" ?
															<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{viewDispute.data.order.delivery_status}</span> : ""
													}
												</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Created</span> - {viewDispute.data.order.createdAt}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Last Updated</span> - {viewDispute.data.order.updatedAt}</p>
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half" style={{ textDecoration: "underline" }}>Message: </p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">{viewDispute.data.message}</p>
											</div>
										</div>
										<center>
											<p className="xui-opacity-4 xui-font-sz-100 xui-py-half">Created - {viewDispute.data.createdAt} | Last Updated - {viewDispute.data.updatedAt}</p>
											{/* {
												viewDispute.data.order.delivery_status === "Refund" ? 
													<div className="xui-m-2">
														<button title="Accept User Dispute" onClick={() => { AcceptDisputeSetUniqueId(viewDispute.data.order.order_unique_id); AcceptDisputeSetUserUniqueId(viewDispute.data.user.unique_id); }} className="xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50" xui-modal-open="acceptDisputeModal">
															<Check width="16" height="16" />
														</button>
														<button title="Deny User Dispute" onClick={() => { DenyDisputeSetUniqueId(viewDispute.data.order.order_unique_id); DenyDisputeSetUserUniqueId(viewDispute.data.user.unique_id); }} className="xui-ml-3 xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="denyDisputeModal">
															<Close width="16" height="16" />
														</button>
													</div> : null
											} */}
										</center>
										{
											viewDispute.data.order.product.product_images === null || !viewDispute.data.order.product.product_images ?
												<center>No image</center> :
												<>
													<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-md-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
														{
															thumbnailImages.map((image, index) => (
																<div>
																	<img key={index} className={`thumbnail-image xui-w-fluid-100 xui-lg-h-200 xui-h-100 ${selectedImage === image ? 'selected' : ''}`} src={image} xui-img-src={image} alt={viewDispute.data.order.product.name + ` Image ${index + 1}`} onClick={() => handleThumbnailClick(image)} />
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewDispute}</h3>
											</center>
										</div>
									</div>
							)
					}
				</div>
			</section>
			<section className='xui-modal' xui-modal="acceptDisputeModal" id="acceptDisputeModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Accept User Dispute</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAcceptOrderDispute}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAcceptOrderDispute}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleAcceptOrderDispute} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingAcceptOrderDispute ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingAcceptOrderDispute ? "" : "acceptDisputeModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="denyDisputeModal" id="denyDisputeModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Deny User Dispute</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<form className="xui-form xui-mt-2">
						<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
							<label>Feedback</label>
							<textarea type={"text"} maxLength={500} placeholder={"Drop a feedback message"} value={feedback} onChange={handleFeedback}></textarea>
						</div>
						<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDenyOrderDispute}</span></p>
						<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDenyOrderDispute}</span></p>
					</form>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDenyOrderDispute} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDenyOrderDispute ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDenyOrderDispute ? "" : "denyDisputeModal"}>
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