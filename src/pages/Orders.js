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
import { 
	getOrders, getOrdersViaUser, getOrder, getOrdersViaDeliveryStatus, getOrdersViaDisputed, getOrdersViaPaid, 
	getOrdersViaProduct, getOrdersViaShipped, getOrdersViaTracking 
} from "../api/orders";
import { useUpdateOrderPaid, useUpdateOrderCancelled, useUpdateOrderCompleted, useUpdateOrderInTransit, useUpdateOrderShipped } from "../hooks/useOrders";
import Loading from "../icons/Loading";
import Filter from "../icons/Filter";
import EyeOpen from "../icons/EyeOpen";
import Search from "../icons/Search";
import EyeOpenAlt from "../icons/EyeOpenAlt";

export default function Orders() {
	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const [currentFunction, setCurrentFunction] = useState("getAllOrders");

	const {
		errorUpdateOrderPaid, handleUpdateOrderPaid, loadingUpdateOrderPaid, removeUpdateOrderPaidModal,
		setRemoveUpdateOrderPaidModal, setTrackingNumber: UpdateOrderPaidSetTrackingNumber, successUpdateOrderPaid,
	} = useUpdateOrderPaid();

	const {
		errorUpdateOrderInTransit, handleUpdateOrderInTransit, loadingUpdateOrderInTransit, removeUpdateOrderInTransitModal,
		setRemoveUpdateOrderInTransitModal, setTrackingNumber: UpdateOrderInTransitSetTrackingNumber, successUpdateOrderInTransit,
	} = useUpdateOrderInTransit();

	const {
		errorUpdateOrderShipped, handleUpdateOrderShipped, loadingUpdateOrderShipped, removeUpdateOrderShippedModal,
		setRemoveUpdateOrderShippedModal, setTrackingNumber: UpdateOrderShippedSetTrackingNumber, successUpdateOrderShipped,
	} = useUpdateOrderShipped();

	const {
		errorUpdateOrderCompleted, handleUpdateOrderCompleted, loadingUpdateOrderCompleted, removeUpdateOrderCompletedModal,
		setRemoveUpdateOrderCompletedModal, setTrackingNumber: UpdateOrderCompletedSetTrackingNumber, successUpdateOrderCompleted,
	} = useUpdateOrderCompleted();

	const {
		errorUpdateOrderCancelled, handleUpdateOrderCancelled, loadingUpdateOrderCancelled, removeUpdateOrderCancelledModal,
		setRemoveUpdateOrderCancelledModal, setTrackingNumber: UpdateOrderCancelledSetTrackingNumber, successUpdateOrderCancelled,
	} = useUpdateOrderCancelled();

	const [filterByUserUniqueId, setFilterByUserUniqueId] = useState("");
	const [removeUserFilterModal, setRemoveUserFilterModal] = useState(null);

	const [filterByProductUniqueId, setFilterByProductUniqueId] = useState("");
	const [removeProductFilterModal, setRemoveProductFilterModal] = useState(null);

	const [filterByTrackingNumber, setFilterByTrackingNumber] = useState("");
	const [removeTrackingNumberFilterModal, setRemoveTrackingNumberFilterModal] = useState(null);

	const [filterByDeliveryStatus, setFilterByDeliveryStatus] = useState("");
	const [removeDeliveryStatusFilterModal, setRemoveDeliveryStatusFilterModal] = useState(null);

	const [filterByPaid, setFilterByPaid] = useState("");
	const [removePaidFilterModal, setRemovePaidFilterModal] = useState(null);

	const [filterByShipped, setFilterByShipped] = useState("");
	const [removeShippedFilterModal, setRemoveShippedFilterModal] = useState(null);

	const [filterByDisputed, setFilterByDisputed] = useState("");
	const [removeDisputedFilterModal, setRemoveDisputedFilterModal] = useState(null);

	const showPreview = function (file) {
		const preview = file;

		window.open(preview, "_blank");
	};

	const [allOrders, setAllOrders] = useState(null);
	const [errorOrders, setErrorOrders] = useState(null);
	const [loadingAllOrders, setLoadingAllOrders] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleFilterByUserUniqueId = (e) => { e.preventDefault(); setFilterByUserUniqueId(e.target.value); };
	const handleFilterByProductUniqueId = (e) => { e.preventDefault(); setFilterByProductUniqueId(e.target.value); };
	const handleFilterByTrackingNumber = (e) => { e.preventDefault(); setFilterByTrackingNumber(e.target.value); };
	const handleFilterByDeliveryStatus = (e) => { e.preventDefault(); setFilterByDeliveryStatus(e.target.value); };
	const handleFilterByPaid = (e) => { e.preventDefault(); setFilterByPaid(e.target.value); if (e.target.value === "null") resetPaidFilterParameters(); else continueFilterByPaid(e); };
	const handleFilterByShipped = (e) => { e.preventDefault(); setFilterByShipped(e.target.value); if (e.target.value === "null") resetShippedFilterParameters(); else continueFilterByShipped(e); };
	const handleFilterByDisputed = (e) => { e.preventDefault(); setFilterByDisputed(e.target.value); if (e.target.value === "null") resetDisputedFilterParameters(); else continueFilterByDisputed(e); };

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); ordersBySize(e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); ordersByPage(parseInt(e.target.value), size); };

	const resetUserFilterParameters = () => {
		setFilterByUserUniqueId("");
		setCurrentFunction("getAllOrders");
	};

	const continueFilterByUser = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllUserOrders");
		getAllUserOrders(filterByUserUniqueId, page, size);
		setRemoveUserFilterModal(true);
	};

	const resetProductFilterParameters = () => {
		setFilterByProductUniqueId("");
		setCurrentFunction("getAllOrders");
	};

	const continueFilterByProduct = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllProductOrders");
		getAllProductOrders(filterByProductUniqueId, page, size);
		setRemoveProductFilterModal(true);
	};

	const resetTrackingNumberFilterParameters = () => {
		setFilterByTrackingNumber("");
		setCurrentFunction("getAllOrders");
	};

	const continueFilterByTrackingNumber = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllTrackingNumberOrders");
		getAllTrackingNumberOrders(filterByTrackingNumber, page, size);
		setRemoveTrackingNumberFilterModal(true);
	};

	const resetDeliveryStatusFilterParameters = () => {
		setFilterByDeliveryStatus("");
		setCurrentFunction("getAllOrders");
	};

	const continueFilterByDeliveryStatus = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllDeliveryStatusOrders");
		getAllDeliveryStatusOrders(filterByDeliveryStatus, page, size);
		setRemoveDeliveryStatusFilterModal(true);
	};

	const resetPaidFilterParameters = () => {
		setFilterByPaid("");
		setCurrentFunction("getAllOrders");
		getAllOrders();
	};

	const continueFilterByPaid = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllPaidOrders");
		getAllPaidOrders(e.target.value, page, size);
	};

	const resetShippedFilterParameters = () => {
		setFilterByShipped("");
		setCurrentFunction("getAllOrders");
		getAllOrders();
	};

	const continueFilterByShipped = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllShippedOrders");
		getAllShippedOrders(e.target.value, page, size);
	};

	const resetDisputedFilterParameters = () => {
		setFilterByDisputed("");
		setCurrentFunction("getAllOrders");
		getAllOrders();
	};

	const continueFilterByDisputed = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllDisputedOrders");
		getAllDisputedOrders(e.target.value, page, size);
	};

	async function callLastOrderFunction() {
		switch (currentFunction) {
			case "getAllOrders":
				getAllOrders(page, size);
				break;
			case "getAllUserOrders":
				getAllUserOrders(filterByUserUniqueId, page, size);
				break;
			case "getAllProductOrders":
				getAllProductOrders(filterByProductUniqueId, page, size);
				break;
			case "getAllTrackingNumberOrders":
				getAllTrackingNumberOrders(filterByTrackingNumber, page, size);
				break;
			case "getAllDeliveryStatusOrders":
				getAllDeliveryStatusOrders(filterByDeliveryStatus, page, size);
				break;
			case "getAllPaidOrders":
				getAllPaidOrders(filterByPaid, page, size);
				break;
			case "getAllShippedOrders":
				getAllShippedOrders(filterByShipped, page, size);
				break;
			case "getAllDisputedOrders":
				getAllDisputedOrders(filterByDisputed, page, size);
				break;
			// default:
			// 	getAllOrders(page, size);
		}
	};

	async function ordersBySize(size) {
		switch (currentFunction) {
			case "getAllOrders":
				getAllOrders(page, size);
				break;
			case "getAllUserOrders":
				getAllUserOrders(filterByUserUniqueId, page, size);
				break;
			case "getAllProductOrders":
				getAllProductOrders(filterByProductUniqueId, page, size);
				break;
			case "getAllTrackingNumberOrders":
				getAllTrackingNumberOrders(filterByTrackingNumber, page, size);
				break;
			case "getAllDeliveryStatusOrders":
				getAllDeliveryStatusOrders(filterByDeliveryStatus, page, size);
				break;
			case "getAllPaidOrders":
				getAllPaidOrders(filterByPaid, page, size);
				break;
			case "getAllShippedOrders":
				getAllShippedOrders(filterByShipped, page, size);
				break;
			case "getAllDisputedOrders":
				getAllDisputedOrders(filterByDisputed, page, size);
				break;
			default:
				getAllOrders(page, size);
		}
	};

	async function ordersByPage(page) {
		switch (currentFunction) {
			case "getAllOrders":
				getAllOrders(page, size);
				break;
			case "getAllUserOrders":
				getAllUserOrders(filterByUserUniqueId, page, size);
				break;
			case "getAllProductOrders":
				getAllProductOrders(filterByProductUniqueId, page, size);
				break;
			case "getAllTrackingNumberOrders":
				getAllTrackingNumberOrders(filterByTrackingNumber, page, size);
				break;
			case "getAllDeliveryStatusOrders":
				getAllDeliveryStatusOrders(filterByDeliveryStatus, page, size);
				break;
			case "getAllPaidOrders":
				getAllPaidOrders(filterByPaid, page, size);
				break;
			case "getAllShippedOrders":
				getAllShippedOrders(filterByShipped, page, size);
				break;
			case "getAllDisputedOrders":
				getAllDisputedOrders(filterByDisputed, page, size);
				break;
			default:
				getAllOrders(page, size);
		}
	};

	async function previousOrders() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) {
			switch (currentFunction) {
				case "getAllOrders":
					getAllOrders(page - 1, size);
					break;
				case "getAllUserOrders":
					getAllUserOrders(filterByUserUniqueId, page - 1, size);
					break;
				case "getAllProductOrders":
					getAllProductOrders(filterByProductUniqueId, page - 1, size);
					break;
				case "getAllTrackingNumberOrders":
					getAllTrackingNumberOrders(filterByTrackingNumber, page - 1, size);
					break;
				case "getAllDeliveryStatusOrders":
					getAllDeliveryStatusOrders(filterByDeliveryStatus, page - 1, size);
					break;
				case "getAllPaidOrders":
					getAllPaidOrders(filterByPaid, page - 1, size);
					break;
				case "getAllShippedOrders":
					getAllShippedOrders(filterByShipped, page - 1, size);
					break;
				case "getAllDisputedOrders":
					getAllDisputedOrders(filterByDisputed, page - 1, size);
					break;
				default:
					getAllOrders(page - 1, size);
			}
		};
	};

	async function nextOrders() {
		if (page < allOrders.data.pages) setPage(page + 1);
		if (page < allOrders.data.pages) {
			switch (currentFunction) {
				case "getAllOrders":
					getAllOrders(page + 1, size);
					break;
				case "getAllUserOrders":
					getAllUserOrders(filterByUserUniqueId, page + 1, size);
					break;
				case "getAllProductOrders":
					getAllProductOrders(filterByProductUniqueId, page + 1, size);
					break;
				case "getAllTrackingNumberOrders":
					getAllTrackingNumberOrders(filterByTrackingNumber, page + 1, size);
					break;
				case "getAllDeliveryStatusOrders":
					getAllDeliveryStatusOrders(filterByDeliveryStatus, page + 1, size);
					break;
				case "getAllPaidOrders":
					getAllPaidOrders(filterByPaid, page + 1, size);
					break;
				case "getAllShippedOrders":
					getAllShippedOrders(filterByShipped, page + 1, size);
					break;
				case "getAllDisputedOrders":
					getAllDisputedOrders(filterByDisputed, page + 1, size);
					break;
				default:
					getAllOrders(page + 1, size);
			}
		};
	};

	async function getAllOrders(_page, _size) {
		setLoadingAllOrders(true);
		const response = await getOrders(cookie, (_page || page), (_size || size));
		setAllOrders(response.data);
		if (response.error) setErrorOrders(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllOrders(false);
	};

	async function getAllUserOrders(user_unique_id, _page, _size) {
		setLoadingAllOrders(true);
		const response = await getOrdersViaUser(cookie, (_page || page), (_size || size), ({ user_unique_id: user_unique_id }));
		setAllOrders(response.data);
		if (response.error) setErrorOrders(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllOrders(false);
	};

	async function getAllProductOrders(product_unique_id, _page, _size) {
		setLoadingAllOrders(true);
		const response = await getOrdersViaProduct(cookie, (_page || page), (_size || size), ({ product_unique_id: product_unique_id }));
		setAllOrders(response.data);
		if (response.error) setErrorOrders(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllOrders(false);
	};
	
	async function getAllTrackingNumberOrders(tracking_number, _page, _size) {
		setLoadingAllOrders(true);
		const response = await getOrdersViaTracking(cookie, (_page || page), (_size || size), ({ tracking_number: tracking_number }));
		setAllOrders(response.data);
		if (response.error) setErrorOrders(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllOrders(false);
	};

	async function getAllDeliveryStatusOrders(delivery_status, _page, _size) {
		setLoadingAllOrders(true);
		const response = await getOrdersViaDeliveryStatus(cookie, (_page || page), (_size || size), ({ delivery_status: delivery_status }));
		setAllOrders(response.data);
		if (response.error) setErrorOrders(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllOrders(false);
	};

	async function getAllPaidOrders(paid, _page, _size) {
		setLoadingAllOrders(true);
		const response = await getOrdersViaPaid(cookie, (_page || page), (_size || size), ({ paid: paid }));
		setAllOrders(response.data);
		if (response.error) setErrorOrders(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllOrders(false);
	};

	async function getAllShippedOrders(shipped, _page, _size) {
		setLoadingAllOrders(true);
		const response = await getOrdersViaShipped(cookie, (_page || page), (_size || size), ({ shipped: shipped }));
		setAllOrders(response.data);
		if (response.error) setErrorOrders(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllOrders(false);
	};

	async function getAllDisputedOrders(disputed, _page, _size) {
		setLoadingAllOrders(true);
		const response = await getOrdersViaDisputed(cookie, (_page || page), (_size || size), ({ disputed: disputed }));
		setAllOrders(response.data);
		if (response.error) setErrorOrders(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllOrders(false);
	};

	useEffect(() => {
		if (allOrders === null) {
			callLastOrderFunction();
		}
	}, [allOrders]);

	const [loadingViewOrder, setLoadingViewOrder] = useState(false)
	const [errorViewOrder, setErrorViewOrder] = useState(null)
	const [viewOrder, setViewOrder] = useState(null)

	async function getAnOrder(unique_id) {
		setLoadingViewOrder(true)
		const response = await getOrder(cookie, { unique_id });
		if (!response.err) {
			setViewOrder(response.data);
			setSelectedImage(response.data.data.product.product_images ? response.data.data.product.product_images[0].image : "");
			setThumbnailImages(response.data.data.product.product_images ? response.data.data.product.product_images.map(image => image.image) : []);
		} else { setErrorViewOrder(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewOrder(false)
	};

	if (removeUserFilterModal) {
		const modalResponse = document.querySelector("#filterByUser");
		modalResponse.setAttribute("display", false);
		callLastOrderFunction();
		setRemoveUserFilterModal(null);
	}
	if (removeProductFilterModal) {
		const modalResponse = document.querySelector("#filterByProduct");
		modalResponse.setAttribute("display", false);
		callLastOrderFunction();
		setRemoveProductFilterModal(null);
	}
	if (removeTrackingNumberFilterModal) {
		const modalResponse = document.querySelector("#filterByTrackingNumber");
		modalResponse.setAttribute("display", false);
		callLastOrderFunction();
		setRemoveTrackingNumberFilterModal(null);
	}
	if (removeDeliveryStatusFilterModal) {
		const modalResponse = document.querySelector("#filterByDeliveryStatus");
		modalResponse.setAttribute("display", false);
		callLastOrderFunction();
		setRemoveDeliveryStatusFilterModal(null);
	}

	if (removeUpdateOrderPaidModal) {
		const modalResponse = document.querySelector("#updateOrderPaidModal");
		modalResponse.setAttribute("display", false);
		const modalResponse2 = document.querySelector("#viewOrderModal");
		modalResponse2.setAttribute("display", false);
		callLastOrderFunction();
		setRemoveUpdateOrderPaidModal(null);
	}
	if (removeUpdateOrderInTransitModal) {
		const modalResponse = document.querySelector("#updateOrderInTransitModal");
		modalResponse.setAttribute("display", false);
		const modalResponse2 = document.querySelector("#viewOrderModal");
		modalResponse2.setAttribute("display", false);
		callLastOrderFunction();
		setRemoveUpdateOrderInTransitModal(null);
	}
	if (removeUpdateOrderShippedModal) {
		const modalResponse = document.querySelector("#updateOrderShippedModal");
		modalResponse.setAttribute("display", false);
		const modalResponse2 = document.querySelector("#viewOrderModal");
		modalResponse2.setAttribute("display", false);
		callLastOrderFunction();
		setRemoveUpdateOrderShippedModal(null);
	}
	if (removeUpdateOrderCompletedModal) {
		const modalResponse = document.querySelector("#updateOrderCompletedModal");
		modalResponse.setAttribute("display", false);
		const modalResponse2 = document.querySelector("#viewOrderModal");
		modalResponse2.setAttribute("display", false);
		callLastOrderFunction();
		setRemoveUpdateOrderCompletedModal(null);
	}
	if (removeUpdateOrderCancelledModal) {
		const modalResponse = document.querySelector("#updateOrderCancelledModal");
		modalResponse.setAttribute("display", false);
		const modalResponse2 = document.querySelector("#viewOrderModal");
		modalResponse2.setAttribute("display", false);
		callLastOrderFunction();
		setRemoveUpdateOrderCancelledModal(null);
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

	const pageSelectArray = new Array(allOrders ? allOrders.data.pages : 0).fill(0);

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
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Orders</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and filter all orders</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half xui-cursor-pointer' xui-modal-open="filterByUser">
										<Filter width="16" height="16" />
										<span className="xui-font-w-bold xui-font-sz-80 xui-ml-half">Filter By User</span>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half xui-cursor-pointer' xui-modal-open="filterByProduct">
										<Filter width="16" height="16" />
										<span className="xui-font-w-bold xui-font-sz-80 xui-ml-half">Filter By Product</span>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half xui-cursor-pointer' xui-modal-open="filterByTrackingNumber">
										<Filter width="16" height="16" />
										<span className="xui-font-w-bold xui-font-sz-80 xui-ml-half">Filter By Tracking Number</span>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half xui-cursor-pointer' xui-modal-open="filterByDeliveryStatus">
										<Filter width="16" height="16" />
										<span className="xui-font-w-bold xui-font-sz-80 xui-ml-half">Filter By Delivery Status</span>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half'>
										<Filter width="16" height="16" />
										<select value={filterByPaid} onChange={handleFilterByPaid} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80 xui-ml-half'>
											<option selected value={"null"}>Filter By Paid</option> 
											<option value={"true"}>TRUE</option>
											<option value={"false"}>FALSE</option>
										</select>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half'>
										<Filter width="16" height="16" />
										<select value={filterByShipped} onChange={handleFilterByShipped} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80 xui-ml-half'>
											<option selected value={"null"}>Filter By Shipped</option>
											<option value={"true"}>TRUE</option>
											<option value={"false"}>FALSE</option>
										</select>
									</div>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<div className='xui-d-inline-flex xui-flex-ai-center xui-ml-1-half'>
										<Filter width="16" height="16" />
										<select value={filterByDisputed} onChange={handleFilterByDisputed} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80 xui-ml-half'>
											<option selected value={"null"}>Filter By Disputed</option>
											<option value={"true"}>TRUE</option>
											<option value={"false"}>FALSE</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						{
							loadingAllOrders ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allOrders && allOrders.success && allOrders.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Unique ID</th>
														<th className='xui-min-w-150'>User</th>
														<th className='xui-min-w-150'>Contact Fullname</th>
														<th className='xui-min-w-150'>Contact Email</th>
														<th className='xui-min-w-150'>Category</th>
														<th className='xui-min-w-200'>Product</th>
														<th className='xui-min-w-150'>Product Image</th>
														<th className='xui-min-w-150'>Tracking Number</th>
														<th className='xui-min-w-150'>Quantity</th>
														<th className='xui-min-w-150'>Amount</th>
														<th className='xui-min-w-150'>Shipping Fee</th>
														<th className='xui-min-w-150'>Payment Method</th>
														<th className='xui-min-w-150'>Paid</th>
														<th className='xui-min-w-150'>Shipped</th>
														<th className='xui-min-w-150'>Disputed</th>
														<th className='xui-min-w-150'>Delivery Status</th>
														<th className='xui-min-w-150'>Status</th>
														<th className='xui-min-w-300'>Created At</th>
														<th className='xui-min-w-300'>Updated At</th>
														<th className='xui-min-w-100'>Action</th>
													</tr>
												</thead>
												<tbody>
													{allOrders.data.rows.map((data, i) => (
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
																			<span>{(data.user ? data.user.firstname + (data.user.middlename ? " " + data.user.middlename + " " : " ") + data.user.lastname : allOrders.data.user.firstname + (allOrders.data.user.middlename ? " " + allOrders.data.user.middlename + " " : " ") + allOrders.data.user.lastname)}</span>
																			<span title="Copy User Unique Id" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.user ? data.user.unique_id : allOrders.data.user.unique_id); setTextCopied(data.user ? data.user.unique_id : allOrders.data.user.unique_id); }}>
																				{copiedText && textCopied === (data.user ? data.user.unique_id : allOrders.data.user.unique_id) ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																		</div> : 
																		<span>{"No user"}</span>
																}
															</td>
															<td className='xui-opacity-5'>
																<span>{data.contact_fullname}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.contact_email}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.product.category.name}</span>
															</td>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>{data.product.name} ({data.product.remaining}/{data.product.quantity})</span>
																	<span title="Copy Product Unique Id" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.product.unique_id); setTextCopied(data.product.unique_id); }}>
																		{copiedText && textCopied === (data.product.unique_id) ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
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
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>{data.tracking_number}</span>
																	<span title="Copy Tracking Number" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.tracking_number); setTextCopied(data.tracking_number); }}>
																		{copiedText && textCopied === (data.tracking_number) ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.quantity.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.amount === 0 ? "Free" : "USD " + data.amount.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.shipping_fee ? data.shipping_fee === 0 ? "Free" : "USD " + data.shipping_fee.toLocaleString() : "No shipping fee"}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.payment_method}</span>
															</td>
															<td className=''>
																{
																	data.paid ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
																}
															</td>
															<td className=''>
																{
																	data.shipped ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
																}
															</td>
															<td className=''>
																{
																	data.disputed ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
																}
															</td>
															<td className=''>
																{
																	data.delivery_status === "Completed" || data.delivery_status === "Paid" || data.delivery_status === "Shipped" || data.delivery_status === "Refunded" ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>{data.delivery_status}</span> : ""
																}
																{
																	data.delivery_status === "Processing" || data.delivery_status === "Disputed" ?
																		<span className='xui-badge xui-badge-warning xui-font-sz-80 xui-bdr-rad-half'>{data.delivery_status}</span> : ""
																}
																{
																	data.delivery_status === "Shipping" || data.delivery_status === "Received" || data.delivery_status === "Refund" ?
																		<span className='xui-badge xui-badge-info xui-font-sz-80 xui-bdr-rad-half'>{data.delivery_status}</span> : ""
																}
																{
																	data.delivery_status === "Cancelled" || data.delivery_status === "Refund Denied" ?
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{data.delivery_status}</span> : ""
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
																	<button title="View Order Full Details"
																		onClick={() => {
																			getAnOrder(data.unique_id);
																		}} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="viewOrderModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorOrders || "No data found!"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllOrders ?
								<Loading width="12" height="12" /> :
								(
									allOrders && allOrders.success && allOrders.data.rows.length !== 0 ?
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
												</select></span> of {allOrders ? allOrders.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousOrders}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextOrders}>
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
					<h1>Filter Orders By User</h1>
					<form className="xui-form" onSubmit={continueFilterByUser}>
						<div className="xui-form-box">
							<label>User Unique Id</label>
							<input className="xui-font-sz-90" type="text" value={filterByUserUniqueId} onChange={handleFilterByUserUniqueId} required placeholder="Enter/Paste User Unique Id"></input>
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
					<h1>Filter Orders By Product</h1>
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
			<section className='xui-modal' xui-modal="filterByTrackingNumber" id="filterByTrackingNumber">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetTrackingNumberFilterParameters()} xui-modal-close="filterByTrackingNumber">
						<Close width="24" height="24" />
					</div>
					<h1>Filter Orders By Tracking Number</h1>
					<form className="xui-form" onSubmit={continueFilterByTrackingNumber}>
						<div className="xui-form-box">
							<label>Tracking Number</label>
							<input className="xui-font-sz-90" type="text" value={filterByTrackingNumber} onChange={handleFilterByTrackingNumber} required placeholder="Enter/Paste Tracking Number"></input>
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
			<section className='xui-modal' xui-modal="filterByDeliveryStatus" id="filterByDeliveryStatus">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetDeliveryStatusFilterParameters()} xui-modal-close="filterByDeliveryStatus">
						<Close width="24" height="24" />
					</div>
					<h1>Filter Orders By Delivery Status</h1>
					<form className="xui-form" onSubmit={continueFilterByDeliveryStatus}>
						<div className="xui-form-box">
							<label>Delivery Status</label>
							<select value={filterByDeliveryStatus} onChange={handleFilterByDeliveryStatus} className='psc-select-rows-per-page xui-font-w-normal xui-font-sz-80'>
								{
									!filterByDeliveryStatus ?
										<option selected disabled value={""}>Filter By Delivery Status</option> :
										<option value={""}>Select to Reset</option>
								}
								<option value={"Cancelled"}>Cancelled</option>
								<option value={"Completed"}>Completed</option>
								<option value={"Processing"}>Processing</option>
								<option value={"Paid"}>Paid</option>
								<option value={"Shipped"}>Shipped</option>
								<option value={"Shipping"}>Shipping</option>
								<option value={"Received"}>Received</option>
								<option value={"Disputed"}>Disputed</option>
								<option value={"Refund"}>Refund</option>
								<option value={"Refunded"}>Refunded</option>
								<option value={"Refund Denied"}>Refund Denied</option>
							</select>
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
			<section className='xui-modal' xui-modal="viewOrderModal" id="viewOrderModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-1000 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="viewOrderModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewOrder ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewOrder && viewOrder.success ?
									<>
										<center>
											<h1>Order Details</h1>
											<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">
												<div className='xui-d-inline-flex xui-flex-ai-center'>
													<span>#{viewOrder.data?.unique_id}</span>
													<span title="Copy Order ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(viewOrder.data?.unique_id); setTextCopied(viewOrder.data?.unique_id); }}>
														{copiedText && textCopied === viewOrder.data?.unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
													</span>
												</div>
											</p>
										</center>
										<div className="xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-md-grid-col-2 xui-grid-gap-1">
											<div className="xui-w-200 xui-h-200 xui-m-1-half xui-mb-6">
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">User</p>
												{
													viewOrder.data.user ?
														<>
															{
																viewOrder.data.user.profile_image === null || !viewOrder.data.user.profile_image ?
																	<center>No image</center> :
																	<img className="xui-img-200 xui-max-h-200 xui-bdr-rad-circle" src={viewOrder.data.user.profile_image} alt={viewOrder.data.user.firstname + (viewOrder.data.user.middlename ? " " + viewOrder.data.user.middlename + " " : " ") + viewOrder.data.user.lastname + " Profile Image"} />
															}
														</> :
														<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">No user</p>
												}
												<div className="xui-mb-4"></div>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">Product Images Below</p>
												<center>
													<p className="xui-opacity-4 xui-font-sz-200 xui-m-half">⬇️</p>
												</center>
											</div>
											<div className="xui-m-1-half xui-lg-ml--10 xui-md-ml--7">
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half" style={{ textDecoration: "underline"}}>User Details: </p>
												{
													viewOrder.data.user ? 
													<>
														<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Name -</span> {viewOrder.data.user.firstname + (viewOrder.data.user.middlename ? " " + viewOrder.data.user.middlename + " " : " ") + viewOrder.data.user.lastname}</p>
														<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Email -</span> {viewOrder.data.user.email}</p>
														<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Phone Number -</span> {viewOrder.data.user.phone_number}</p>
													</> : 
													<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">No user</p>
												}
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half" style={{ textDecoration: "underline" }}>Contact Details: </p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Name -</span> {viewOrder.data.contact_fullname}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Email -</span> {viewOrder.data.contact_email}</p>
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Category -</span> {viewOrder.data.product.category.name}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Product -</span> {viewOrder.data.product.name}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Product Price -</span> USD {viewOrder.data.product.sales_price ? <>{viewOrder.data.product.sales_price.toLocaleString()} <s> USD {viewOrder.data.product.price.toLocaleString()}</s> </> : viewOrder.data.product.price.toLocaleString()}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Remaining / Quantity (Max Quantity) -</span> {viewOrder.data.product.remaining.toLocaleString()} / {viewOrder.data.product.quantity.toLocaleString()} ({viewOrder.data.product.max_quantity.toLocaleString()})</p>
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half" style={{ textDecoration: "underline" }}>Shipping Details: </p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Name -</span> {viewOrder.data.shipping_firstname} {viewOrder.data.shipping_lastname}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Address -</span> {viewOrder.data.shipping_address}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">City, State, Zip Code -</span> {viewOrder.data.shipping_city}, {viewOrder.data.shipping_state}, {viewOrder.data.shipping_zip_code}</p>
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half" style={{ textDecoration: "underline" }}>Billing Details: </p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Name -</span> {viewOrder.data.billing_firstname} {viewOrder.data.billing_lastname}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Address -</span> {viewOrder.data.billing_address}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">City, State, Zip Code -</span> {viewOrder.data.billing_city}, {viewOrder.data.billing_state}, {viewOrder.data.billing_zip_code}</p>
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half" style={{ textDecoration: "underline" }}>Order Details: </p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Tracking Number -</span> {viewOrder.data.tracking_number}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Shipping Fee -</span> USD {viewOrder.data.shipping_fee.toLocaleString()}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Quantity -</span> {viewOrder.data.quantity.toLocaleString()}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Amount -</span> USD {viewOrder.data.amount.toLocaleString()}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Gateway -</span> {viewOrder.data.gateway}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Payment Method -</span> {viewOrder.data.payment_method}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Paid -</span> {
													viewOrder.data.paid ?
														<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
														<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
												}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Shipped -</span> {
													viewOrder.data.shipped ?
														<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
														<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
												}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Disputed -</span> {
													viewOrder.data.disputed ?
														<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Yes</span> :
														<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>No</span>
												}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Delivery Status - </span> 
													{
														viewOrder.data.delivery_status === "Completed" || viewOrder.data.delivery_status === "Paid" || viewOrder.data.delivery_status === "Shipped" || viewOrder.data.delivery_status === "Refunded" ?
															<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>{viewOrder.data.delivery_status}</span> : ""
													}
													{
														viewOrder.data.delivery_status === "Processing" || viewOrder.data.delivery_status === "Disputed" ?
															<span className='xui-badge xui-badge-warning xui-font-sz-80 xui-bdr-rad-half'>{viewOrder.data.delivery_status}</span> : ""
													}
													{
														viewOrder.data.delivery_status === "Shipping" || viewOrder.data.delivery_status === "Received" || viewOrder.data.delivery_status === "Refund" ?
															<span className='xui-badge xui-badge-info xui-font-sz-80 xui-bdr-rad-half'>{viewOrder.data.delivery_status}</span> : ""
													}
													{
														viewOrder.data.delivery_status === "Cancelled" || viewOrder.data.delivery_status === "Refund Denied" ?
															<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{viewOrder.data.delivery_status}</span> : ""
													}
												</p>
											</div>
										</div>
										<center>
											<p className="xui-opacity-4 xui-font-sz-90 xui-m-half">Created - {new Date(viewOrder.data.createdAt).toLocaleString()} | Last Updated - {new Date(viewOrder.data.updatedAt).toLocaleString()}</p>
											<div className="xui-m-2">
												{
													viewOrder.data.delivery_status === "Processing" ?
														<button title="Update User Orders Paid 💸" onClick={() => { UpdateOrderPaidSetTrackingNumber(viewOrder.data.tracking_number); }} className="xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50 xui-mr-2" xui-modal-open="updateOrderPaidModal">
															<Check width="16" height="16" />
														</button> : null
												}
												{
													viewOrder.data.delivery_status === "Paid" ?
														<button title="Update User Orders In Transit 🚚" onClick={() => { UpdateOrderInTransitSetTrackingNumber(viewOrder.data.tracking_number); }} className="xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50 xui-mr-2" xui-modal-open="updateOrderInTransitModal">
															<Check width="16" height="16" />
														</button> : null
												}
												{
													viewOrder.data.delivery_status === "Shipping" ?
														<button title="Update User Orders Shipped 📍" onClick={() => { UpdateOrderShippedSetTrackingNumber(viewOrder.data.tracking_number); }} className="xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50 xui-mr-2" xui-modal-open="updateOrderShippedModal">
															<Check width="16" height="16" />
														</button> : null
												}
												{
													viewOrder.data.delivery_status === "Shipped" ?
														<button title="Update User Orders Completed ✅" onClick={() => { UpdateOrderCompletedSetTrackingNumber(viewOrder.data.tracking_number); }} className="xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50 xui-mr-2" xui-modal-open="updateOrderCompletedModal">
															<Check width="16" height="16" />
														</button> : null
												}
												{
													viewOrder.data.delivery_status === "Processing" ?
														<button title="Update User Orders Cancelled ❌" onClick={() => { UpdateOrderCancelledSetTrackingNumber(viewOrder.data.tracking_number); }} className="xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50 xui-mr-2" xui-modal-open="updateOrderCancelledModal">
															<Close width="16" height="16" />
														</button> : null
												}
											</div>
										</center>
										{
											viewOrder.data.product.product_images === null || !viewOrder.data.product.product_images ?
												<center>No image</center> :
												<>
													<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-md-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2 xui-mt-2'>
														{
															thumbnailImages.map((image, index) => (
																<div>
																	<img key={index} className={`thumbnail-image xui-w-fluid-100 xui-lg-h-200 xui-h-100 ${selectedImage === image ? 'selected' : ''}`} src={image} xui-img-src={image} alt={viewOrder.data.product.name + ` Image ${index + 1}`} onClick={() => handleThumbnailClick(image)} />
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewOrder}</h3>
											</center>
										</div>
									</div>
							)
					}
				</div>
			</section>
			<section className='xui-modal' xui-modal="updateOrderPaidModal" id="updateOrderPaidModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Update User Orders Paid</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Orders status with tracking number - {viewOrder ? viewOrder.data.tracking_number : "XXXX"} will be changed to paid.</p>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateOrderPaid}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateOrderPaid}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleUpdateOrderPaid} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingUpdateOrderPaid ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingUpdateOrderPaid ? "" : "updateOrderPaidModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="updateOrderInTransitModal" id="updateOrderInTransitModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Update User Orders In Transit</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Orders status with tracking number - {viewOrder ? viewOrder.data.tracking_number : "XXXX"} will be changed to in transit.</p>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateOrderInTransit}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateOrderInTransit}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleUpdateOrderInTransit} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingUpdateOrderInTransit ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingUpdateOrderInTransit ? "" : "updateOrderInTransitModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="updateOrderShippedModal" id="updateOrderShippedModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Update User Orders Shipped</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Orders status with tracking number - {viewOrder ? viewOrder.data.tracking_number : "XXXX"} will be changed to shipped.</p>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateOrderShipped}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateOrderShipped}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleUpdateOrderShipped} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingUpdateOrderShipped ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingUpdateOrderShipped ? "" : "updateOrderShippedModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="updateOrderCompletedModal" id="updateOrderCompletedModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Update User Orders Completed</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Orders status with tracking number - {viewOrder ? viewOrder.data.tracking_number : "XXXX"} will be changed to completed.</p>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateOrderCompleted}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateOrderCompleted}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleUpdateOrderCompleted} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingUpdateOrderCompleted ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingUpdateOrderCompleted ? "" : "updateOrderCompletedModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="updateOrderCancelledModal" id="updateOrderCancelledModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Update User Orders Cancelled</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Orders status with tracking number - {viewOrder ? viewOrder.data.tracking_number : "XXXX"} will be changed to cancelled.</p>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateOrderCancelled}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateOrderCancelled}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleUpdateOrderCancelled} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingUpdateOrderCancelled ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingUpdateOrderCancelled ? "" : "updateOrderCancelledModal"}>
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