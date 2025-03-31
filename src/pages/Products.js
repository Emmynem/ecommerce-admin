import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
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
import { getCategories } from "../api/categories";
import { getProducts, getProductsViaCategory, getProduct, searchProducts } from "../api/products";
import { 
	useDeleteProduct, useDeleteProductImage, useUploadProductImages,
	// useAddProduct, useUpdateProductCategory, useUpdateProductDescription, useUpdateProductName, 
	// useUpdateProductPrices, useUpdateProductSpecification, useUpdateProductStock, 
} from "../hooks/useProducts";
import Loading from "../icons/Loading";
import Filter from "../icons/Filter";
import EyeOpen from "../icons/EyeOpen";
import Search from "../icons/Search";
import EyeOpenAlt from "../icons/EyeOpenAlt";
import Image from "../icons/Image";
import Edit from "../icons/Edit";
import Delete from "../icons/Delete";

export default function Products() {
	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const [currentFunction, setCurrentFunction] = useState("getAllProducts");

	// const {
	// 	categoryUniqueId, description, errorAddProduct, handleAddProduct, handleCategoryUniqueId, handleDescription, handleMaxQuantity, 
	// 	handleName, handlePrice, handleQuantity, handleSalesPrice, handleSpecification, loadingAddProduct, maxQuantity, name, price, 
	// 	productUniqueId, quantity, removeAddProductModal, salesPrice, setCategoryUniqueId, setDescription, setMaxQuantity, setName, setPrice, 
	// 	setQuantity, setRemoveAddProductModal, setSalesPrice, setSpecification, specification, successAddProduct
	// } = useAddProduct();

	const {
		errorProductImages, handleUploadProductImages, loadingProductImages, removeProductImagesModal, selectedProductImages, setRemoveProductImagesModal, 
		setSelectedProductImages, setUniqueId: UploadProductImagesSetProductUniqueId, successProductImages, uniqueId: UploadProductImagesProductUniqueId, uploadingProductImagesPercentage
	} = useUploadProductImages();

	// const {
	// 	categoryUniqueId: UpdateProductCategoryUniqueId, errorUpdateProductCategory, handleCategoryUniqueId: UpdateProductHandleCategoryUniqueId, handleUpdateProductCategory, 
	// 	loadingUpdateProductCategory, removeUpdateProductCategoryModal, setCategoryUniqueId: UpdateProductCategorySetCategoryUniqueId, setRemoveUpdateProductCategoryModal, 
	// 	setUniqueId: UpdateProductCategorySetUniqueId, successUpdateProductCategory
	// } = useUpdateProductCategory();

	// const {
	// 	name: UpdateProductName, errorUpdateProductName, handleName: UpdateProductHandleName, handleUpdateProductName, loadingUpdateProductName, 
	// 	removeUpdateProductNameModal, setName: UpdateProductSetName, setRemoveUpdateProductNameModal, setUniqueId: UpdateProductNameSetUniqueId, successUpdateProductName
	// } = useUpdateProductName();

	// const {
	// 	description: UpdateProductDescription, errorUpdateProductDescription, handleDescription: UpdateProductHandleDescription, handleUpdateProductDescription, loadingUpdateProductDescription, 
	// 	removeUpdateProductDescriptionModal, setDescription: UpdateProductSetDescription, setRemoveUpdateProductDescriptionModal, setUniqueId: UpdateProductDescriptionSetUniqueId, successUpdateProductDescription
	// } = useUpdateProductDescription();

	// const {
	// 	specification: UpdateProductSpecification, errorUpdateProductSpecification, handleSpecification: UpdateProductHandleSpecification, handleUpdateProductSpecification, loadingUpdateProductSpecification, 
	// 	removeUpdateProductSpecificationModal, setSpecification: UpdateProductSetSpecification, setRemoveUpdateProductSpecificationModal, setUniqueId: UpdateProductSpecificationSetUniqueId, successUpdateProductSpecification
	// } = useUpdateProductSpecification();

	// const {
	// 	price: UpdateProductPrice, salesPrice: UpdateProductSalesPrice, errorUpdateProductPrices, handlePrice: UpdateProductHandlePrice, handleSalesPrice: UpdateProductHandleSalesPrice, handleUpdateProductPrices, loadingUpdateProductPrices, 
	// 	removeUpdateProductPricesModal, setPrice: UpdateProductSetPrice, setSalesPrice: UpdateProductSetSalesPrice, setRemoveUpdateProductPricesModal, setUniqueId: UpdateProductPricesSetUniqueId, successUpdateProductPrices
	// } = useUpdateProductPrices();

	// const {
	// 	quantity: UpdateProductQuantity, maxQuantity: UpdateProductMaxQuantity, errorUpdateProductStock, handleQuantity: UpdateProductHandleQuantity, handleMaxQuantity: UpdateProductHandleMaxQuantity, handleUpdateProductStock, loadingUpdateProductStock, 
	// 	removeUpdateProductStockModal, setQuantity: UpdateProductSetQuantity, setMaxQuantity: UpdateProductSetMaxQuantity, setRemoveUpdateProductStockModal, setUniqueId: UpdateProductStockSetUniqueId, successUpdateProductStock
	// } = useUpdateProductStock();

	const {
		errorDeleteProduct, handleDeleteProduct, loadingDeleteProduct, removeDeleteProductModal, setRemoveDeleteProductModal, uniqueId: DeleteProductUniqueId, setUniqueId: DeleteProductSetUniqueId, successDeleteProduct
	} = useDeleteProduct();

	const {
		errorDeleteProductImage, handleDeleteProductImage, loadingDeleteProductImage, removeDeleteProductImageModal, setRemoveDeleteProductImageModal, uniqueId: DeleteProductImageUniqueId, setUniqueId: DeleteProductImageSetUniqueId, successDeleteProductImage
	} = useDeleteProductImage();

	const [filterByCategoryUniqueId, setFilterByCategoryUniqueId] = useState("");
	const [removeCategoryFilterModal, setRemoveCategoryFilterModal] = useState(null);

	const [searchProduct, setSearchProduct] = useState("");
	const [removeSearchProductModal, setRemoveSearchProductModal] = useState(null);

	// No need for this ever again, check hook for new way for multiple images
	const handleSelectProductImages = (e) => {
		let el = e.target.files;
		setSelectedProductImages([]);
		setSelectedProductImages(el);
	};

	const showPreview = function (file) {
		const preview = file;

		window.open(preview, "_blank");
	};

	const [selectedImage, setSelectedImage] = useState("");
	const [thumbnailImages, setThumbnailImages] = useState([]);
	const handleThumbnailClick = (image) => {
		setSelectedImage(image);
	};

	const [allCategory, setAllCategory] = useState(null);
	const [errorCategory, setErrorCategory] = useState(null);

	const [allProducts, setAllProducts] = useState(null);
	const [errorProducts, setErrorProducts] = useState(null);
	const [loadingAllProducts, setLoadingAllProducts] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleFilterByCategoryUniqueId = (e) => { e.preventDefault(); setFilterByCategoryUniqueId(e.target.value); };
	const handleSearchProduct = (e) => { e.preventDefault(); setSearchProduct(e.target.value); };

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); productsBySize(e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); productsByPage(parseInt(e.target.value), size); };

	const resetCategoryFilterParameters = () => {
		setFilterByCategoryUniqueId("");
		setCurrentFunction("getAllProducts");
	};

	const continueCategoryFilterByCategory = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("getAllCategoryProducts");
		getAllCategoryProducts(filterByCategoryUniqueId, page, size);
		setRemoveCategoryFilterModal(true);
	};

	const resetSearchProductParameters = () => {
		setSearchProduct("");
		setCurrentFunction("getAllProducts");
	};

	const continueSearchProduct = (e) => {
		e.preventDefault();

		setPage(1);
		setCurrentFunction("searchAllProducts");
		searchAllProducts(searchProduct, page, size);
		setRemoveSearchProductModal(true);
	};

	async function callLastProductFunction() {
		switch (currentFunction) {
			case "getAllProducts":
				getAllProducts(page, size);
				break;
			case "getAllCategoryProducts":
				getAllCategoryProducts(filterByCategoryUniqueId, page, size);
				break;
			case "searchAllProducts":
				searchAllProducts(searchProduct, page, size);
				break;
			// default:
			// 	getAllProducts(page, size);
		}
	};

	async function productsBySize(size) {
		switch (currentFunction) {
			case "getAllProducts":
				getAllProducts(page, size);
				break;
			case "getAllCategoryProducts":
				getAllCategoryProducts(filterByCategoryUniqueId, page, size);
				break;
			case "searchAllProducts":
				searchAllProducts(searchProduct, page, size);
				break;
			default:
				getAllProducts(page, size);
		}
	};

	async function productsByPage(page) {
		switch (currentFunction) {
			case "getAllProducts":
				getAllProducts(page, size);
				break;
			case "getAllCategoryProducts":
				getAllCategoryProducts(filterByCategoryUniqueId, page, size);
				break;
			case "searchAllProducts":
				searchAllProducts(searchProduct, page, size);
				break;
			default:
				getAllProducts(page, size);
		}
	};

	async function previousProducts() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) {
			switch (currentFunction) {
				case "getAllProducts":
					getAllProducts(page - 1, size);
					break;
				case "getAllCategoryProducts":
					getAllCategoryProducts(filterByCategoryUniqueId, page - 1, size);
					break;
				case "searchAllProducts":
					searchAllProducts(searchProduct, page - 1, size);
					break;
				default:
					getAllProducts(page - 1, size);
			}
		};
	};

	async function nextProducts() {
		if (page < allProducts.data.pages) setPage(page + 1);
		if (page < allProducts.data.pages) {
			switch (currentFunction) {
				case "getAllProducts":
					getAllProducts(page + 1, size);
					break;
				case "getAllCategoryProducts":
					getAllCategoryProducts(filterByCategoryUniqueId, page + 1, size);
					break;
				case "searchAllProducts":
					searchAllProducts(searchProduct, page + 1, size);
					break;
				default:
					getAllProducts(page + 1, size);
			}
		};
	};

	async function getAllCategories(_page, _size) {
		setAllCategory(null);
		const response = await getCategories(cookie, (_page || page), (_size || size));
		setAllCategory(response.data);
		if (response.error) setErrorCategory(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
	};

	async function getAllProducts(_page, _size) {
		setAllProducts(null);
		setLoadingAllProducts(true);
		const response = await getProducts(cookie, (_page || page), (_size || size));
		setAllProducts(response.data);
		if (response.error) setErrorProducts(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllProducts(false);
	};

	async function getAllCategoryProducts(category_unique_id, _page, _size) {
		setAllProducts(null);
		setLoadingAllProducts(true);
		const response = await getProductsViaCategory(cookie, (_page || page), (_size || size), ({ category_unique_id: category_unique_id }));
		setAllProducts(response.data);
		if (response.error) setErrorProducts(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllProducts(false);
	};

	async function searchAllProducts(search, _page, _size) {
		setAllProducts(null);
		setLoadingAllProducts(true);
		const response = await searchProducts(cookie, (_page || page), (_size || size), ({ search: search }));
		setAllProducts(response.data);
		if (response.error) setErrorProducts(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllProducts(false);
	};

	useEffect(() => {
		if (allProducts === null) {
			callLastProductFunction();
		} 
		if (allCategory === null) {
			getAllCategories(1, 50);
		}
	}, [allProducts]);

	const [loadingViewProduct, setLoadingViewProduct] = useState(false)
	const [errorViewProduct, setErrorViewProduct] = useState(null)
	const [viewProduct, setViewProduct] = useState(null)

	async function getAProduct(unique_id) {
		setLoadingViewProduct(true)
		setThumbnailImages([]);
		const response = await getProduct(cookie, { unique_id });
		if (!response.err) {
			setViewProduct(response.data);
			// UpdateProductCategorySetCategoryUniqueId(response.data.data.category_unique_id);
			// UpdateProductSetName(response.data.data.name);
			// UpdateProductSetDescription(response.data.data.description);
			// UpdateProductSetSpecification(response.data.data.specification);
			// UpdateProductSetPrice(response.data.data.price);
			// UpdateProductSetSalesPrice(response.data.data.sales_price);
			// UpdateProductSetQuantity(response.data.data.quantity);
			// UpdateProductSetMaxQuantity(response.data.data.max_quantity);
			setSelectedImage(response.data.data.product_images && response.data.data.product_images.length > 0 ? response.data.data.product_images[0].image : "");
			setThumbnailImages(response.data.data.product_images && response.data.data.product_images.length > 0 ? response.data.data.product_images.map(image => image.image) : []);
		} else { setErrorViewProduct(response.response_code === 422 ? response.error.response.data.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewProduct(false)
	};

	if (removeCategoryFilterModal) {
		const modalResponse = document.querySelector("#filterByCategory");
		modalResponse.setAttribute("display", false);
		callLastProductFunction();
		setRemoveCategoryFilterModal(null);
	}
	if (removeSearchProductModal) {
		const modalResponse = document.querySelector("#searchProduct");
		modalResponse.setAttribute("display", false);
		callLastProductFunction();
		setRemoveSearchProductModal(null);
	}
	// if (removeAddProductModal) {
	// 	const modalResponse = document.querySelector("#addProductModal");
	// 	modalResponse.setAttribute("display", false);
	// 	callLastProductFunction();
	// 	setRemoveAddProductModal(null);
	// }
	// if (removeUpdateProductCategoryModal || removeUpdateProductNameModal || removeUpdateProductDescriptionModal || removeUpdateProductPricesModal || removeUpdateProductStockModal) {
	// 	// const modalResponse = document.querySelector("#editProductModal");
	// 	// modalResponse.setAttribute("display", false);
	// 	// callLastProductFunction();
	// 	setRemoveUpdateProductCategoryModal(null);
	// 	setRemoveUpdateProductNameModal(null);
	// 	setRemoveUpdateProductDescriptionModal(null);
	// 	setRemoveUpdateProductSpecificationModal(null);
	// 	setRemoveUpdateProductPricesModal(null);
	// 	setRemoveUpdateProductStockModal(null);
	// }
	if (removeProductImagesModal) {
		// const modalResponse = document.querySelector("#viewProductImagesModal");
		// modalResponse.setAttribute("display", false);
		// callLastProductFunction();
		getAProduct(UploadProductImagesProductUniqueId)
		setRemoveProductImagesModal(null);
		// UploadProductImagesSetProductUniqueId(null);
	}
	if (removeDeleteProductImageModal) {
		const modalResponse = document.querySelector("#deleteProductImageModal");
		modalResponse.setAttribute("display", false);
		// callLastProductFunction();
		getAProduct(UploadProductImagesProductUniqueId);
		setRemoveDeleteProductImageModal(null);
		DeleteProductImageSetUniqueId(null);
	}
	if (removeDeleteProductModal) {
		const modalResponse = document.querySelector("#deleteProductModal");
		modalResponse.setAttribute("display", false);
		callLastProductFunction();
		setRemoveDeleteProductModal(null);
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

	const pageSelectArray = new Array(allProducts ? allProducts.data.pages : 0).fill(0);

	const getObjectValues = (obj) => {
		let values = [];
		Object.keys(obj).some((key) => {
			values.push(<span id={obj[key]}><b>{key}</b> : {obj[key].length > 300 ? obj[key].slice(0, 200) + " ..." : obj[key]}<br></br></span>)
		});
		return values;
	};

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Products</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and filter all products</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<Link to={`/internal/product/add`} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80">
										<span className="xui-mr-half">Add Product</span>
										<Plus width="15" height="15" />
									</Link>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="filterByCategory">
										<span className="xui-mr-half">Filter by Category</span>
										<Filter width="15" height="15" />
									</button>
								</div>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="searchProduct">
										<span className="xui-mr-half">Search</span>
										<Search width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllProducts ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allProducts && allProducts.success && allProducts.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Unique ID</th>
														<th className='xui-min-w-150'>Category</th>
														<th className='xui-min-w-200'>Product</th>
														<th className='xui-min-w-200'>Stripped</th>
														<th className='xui-min-w-200'>Product Price</th>
														<th className='xui-min-w-150'>Product Image</th>
														<th className='xui-min-w-150'>Views</th>
														<th className='xui-min-w-150'>Favorites</th>
														<th className='xui-min-w-150'>Status</th>
														<th className='xui-min-w-300'>Created At</th>
														<th className='xui-min-w-300'>Updated At</th>
														<th className='xui-min-w-250'>Action</th>
													</tr>
												</thead>
												<tbody>
													{allProducts.data.rows.map((data, i) => (
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
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>{data.category.name}</span>
																	<span title="Copy Category Unique ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.category.unique_id); setTextCopied(data.category.unique_id); }}>
																		{copiedText && textCopied === data.category.unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.name} ({data.remaining}/{data.quantity})</span>
															</td>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>{data.stripped}</span>
																	<span title="Copy Stripped" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.stripped); setTextCopied(data.stripped); }}>
																		{copiedText && textCopied === data.stripped ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className='xui-opacity-5'>
																<span><b>USD {data.sales_price ? <>{data.sales_price.toLocaleString()} <s> USD {data.price.toLocaleString()}</s> </> : data.price.toLocaleString()}</b></span>
															</td>
															<td className=''>
																{
																	data.product_images === null || !data.product_images || data.product_images.length === 0 ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.product_images[0].image} alt="Category Image" />
																			<span title="Copy Image Link" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.product_images[0].image); setTextCopied(data.product_images[0].image); }}>
																				{copiedText && textCopied === data.product_images[0].image ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																			<span title="View File" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.product_images[0].image); }}>
																				<EyeOpen width="16" height="16" />
																			</span>
																		</div>
																}
															</td>
															<td className='xui-opacity-5'>
																<span>{data.views.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.favorites.toLocaleString()}</span>
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
																	<button title="View Product Full Details"
																		onClick={() => {
																			getAProduct(data.unique_id);
																		}} className="xui-d-inline-flex xui-flex-ai-center xui-btn xui-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="viewProductModal">
																		<EyeOpenAlt width="20" height="20" />
																	</button>
																	<Link to={`/internal/product/edit/details?unique_id=${data.unique_id}`} className="xui-text-dc-none xui-d-inline-flex xui-flex-ai-center xui-btn xui-btn-blue xui-bdr-rad-half xui-font-sz-50">
																		<Edit width="20" height="20" />
																	</Link>
																	<button title="Product Images"
																		onClick={() => {
																			UploadProductImagesSetProductUniqueId(data.unique_id);
																			getAProduct(data.unique_id)
																		}}
																		className="xui-d-inline-flex xui-flex-ai-center xui-btn xui-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="viewProductImagesModal">
																		<Image width="20" height="20" />
																	</button>
																	<button title="Delete Product" onClick={() => { DeleteProductSetUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteProductModal">
																		<Delete width="20" height="20" />
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorProducts || "No data found!"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllProducts ?
								<Loading width="12" height="12" /> :
								(
									allProducts && allProducts.success && allProducts.data.rows.length !== 0 ?
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
												</select></span> of {allProducts ? allProducts.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousProducts}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextProducts}>
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
			<section className='xui-modal' xui-modal="filterByCategory" id="filterByCategory">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetCategoryFilterParameters()} xui-modal-close="filterByCategory">
						<Close width="24" height="24" />
					</div>
					<h1>Filter Products By Category</h1>
					<form className="xui-form" onSubmit={continueCategoryFilterByCategory}>
						<div className="xui-form-box">
							<label>Category</label>
							<select value={filterByCategoryUniqueId} onChange={handleFilterByCategoryUniqueId} className="xui-bdr-black" required>
								<option selected value={""}>Select Category</option>
								{
									allCategory && allCategory.success && allCategory.data.rows.length !== 0 ? (
										allCategory.data.rows.map((item, index) => {
											return (
												<option key={index} value={item.unique_id}>{item.name}</option>
											)
										})
									) : ""
								}
							</select>
							{errorCategory ?? <p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCategory}</span></p>}
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
			<section className='xui-modal' xui-modal="searchProduct" id="searchProduct">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" onClick={() => resetSearchProductParameters()} xui-modal-close="searchProduct">
						<Close width="24" height="24" />
					</div>
					<h1>Search for Product</h1>
					<form className="xui-form" onSubmit={continueSearchProduct}>
						<div className="xui-form-box">
							<label>Search Keyword</label>
							<input className="xui-font-sz-90" type="text" value={searchProduct} onChange={handleSearchProduct} required placeholder="Enter search keyword"></input>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-70">
								<Search width="16" height="16" />
								<span className="xui-ml-half">Search</span>
							</button>
						</div>
					</form>
				</div>
			</section>
			<section className='xui-modal' xui-modal="viewProductModal" id="viewProductModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-1000 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="viewProductModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewProduct ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewProduct && viewProduct.success ?
									<>
										<center>
											<h1>Product Details</h1>
											<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">
												<div className='xui-d-inline-flex xui-flex-ai-center'>
													<span>#{viewProduct.data.unique_id}</span>
													<span title="Copy Product ID" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(viewProduct.data.unique_id); setTextCopied(viewProduct.data.unique_id); }}>
														{copiedText && textCopied === viewProduct.data.unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
													</span>
												</div>
											</p>
										</center>
										{/* <div className="xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-md-grid-col-2 xui-grid-gap-1">
											<div className="xui-w-200 xui-h-200 xui-m-1-half xui-mb-6">
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">Product Images Below</p>
												<center>
													<p className="xui-opacity-4 xui-font-sz-200 xui-m-half">⬇️</p>
												</center>
											</div>
										</div> */}
										<div className="xui-m-1-half ">
											<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Category -</span> {viewProduct.data.category.name}</p>
											<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Name -</span> {viewProduct.data.name} ({viewProduct.data.stripped})</p>
											<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Price -</span> USD {viewProduct.data.sales_price ? <>{viewProduct.data.sales_price.toLocaleString()} <s> USD {viewProduct.data.price.toLocaleString()}</s> </> : viewProduct.data.price.toLocaleString()}</p>
											<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Remaining / Quantity (Max Quantity) -</span> {viewProduct.data.remaining.toLocaleString()} / {viewProduct.data.quantity.toLocaleString()} ({viewProduct.data.max_quantity.toLocaleString()})</p>
											<hr></hr>
											<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Specification: </span></p>
											<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">
												{/* <span className="xui-font-w-bold">
													{
														getObjectValues(viewProduct.data.specification).map(val => {
															return val;
														})
													}
													{viewProduct.data.specification}
												</span> */}
												<div data-color-mode="light">
													<MarkdownPreview source={viewProduct.data.specification} />
												</div>
											</p>
											<hr></hr>
											<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Views -</span> {viewProduct.data.views.toLocaleString()}</p>
											<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Favorites -</span> {viewProduct.data.favorites.toLocaleString()}</p>
											<hr></hr>
											<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Description: </span></p>
											<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">
												<div data-color-mode="light">
													<MarkdownPreview source={viewProduct.data.description} />
												</div>
											</p>
											<hr></hr>
											<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Status - </span> 
												{
													viewProduct.data.status === 1 ?
														<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Active</span> : ""
												}
												{
													viewProduct.data.status === 0 ?
														<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Inactive</span> : ""
												}
											</p>
										</div>
										<center>
											<p className="xui-opacity-4 xui-font-sz-90 xui-m-half">Created - {new Date(viewProduct.data.createdAt).toLocaleString()} | Last Updated - {new Date(viewProduct.data.updatedAt).toLocaleString()}</p>
											{/* {
												viewProduct.data.status === 2 ?
													<div className="xui-m-2">
														<button title="Publish User Product" onClick={() => { PublishProductSetUniqueId(viewProduct.data.unique_id); PublishProductSetUserUniqueId(viewProduct.data.user_unique_id); }} className="xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50" xui-modal-open="publishProductModal">
															<Check width="16" height="16" />
														</button>
													</div> : null
											}
											{
												viewProduct.data.status === 1 ?
													<div className="xui-m-2">
														<button title="Unpublish User Product" onClick={() => { PublishProductSetUniqueId(viewProduct.data.unique_id); PublishProductSetUserUniqueId(viewProduct.data.user_unique_id); }} className="xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="publishProductModal">
															<Close width="16" height="16" />
														</button>
													</div> : null
											} */}
										</center>
										<center className="xui-mt-3">
											<p className="xui-font-sz-100 xui-m-half">Product Images Below</p>
											<p className="xui-opacity-4 xui-font-sz-200 xui-m-half">⬇️</p>
										</center>
										{
											viewProduct.data.product_images === null || !viewProduct.data.product_images ?
												<center>No image</center> :
												<>
													<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-md-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mt-2 xui-mb-2'>
														{
															thumbnailImages.map((image, index) => (
																<div>
																	<img key={index} className={`thumbnail-image xui-w-fluid-100 xui-lg-h-200 xui-h-100 ${selectedImage === image ? 'selected' : ''}`} src={image} xui-img-src={image} alt={viewProduct.data.name + ` Image ${index + 1}`} onClick={() => handleThumbnailClick(image)} />
																	<div className='xui-text-center xui-d-grid xui-grid-col-2 xui-lg-grid-col-2 xui-md-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
																		<div>
																			<p className="xui-opacity-4 xui-font-sz-100 xui-m-half xui-cursor-pointer xui-text-dc-underline" onClick={() => {
																				showPreview(image);
																			}}><span className="xui-font-w-bold">Click to view</span></p>
																		</div>
																		<div>
																			<p className="xui-opacity-4 xui-font-sz-100 xui-m-half xui-text-red xui-cursor-pointer xui-text-dc-underline" onClick={() => { DeleteProductImageSetUniqueId(viewProduct.data.product_images.find((val) => { return val.image === image; }).unique_id) }} xui-modal-open="deleteProductImageModal"><span className="xui-font-w-bold">Delete</span></p>
																		</div>
																	</div>
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
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewProduct}</h3>
											</center>
										</div>
									</div>
							)
					}
				</div>
			</section>
			<section className='xui-modal' xui-modal="viewProductImagesModal" id="viewProductImagesModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-1000 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="viewProductImagesModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewProduct ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								<>
									{
										!viewProduct || (viewProduct.data.product_images === null || !viewProduct.data.product_images) ?
											<center>No images found</center> :
											<>
												<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-3 xui-md-grid-col-3 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mt-2 xui-mb-2'>
													{
														thumbnailImages.map((image, index) => (
															<div>
																<img key={index} className={`thumbnail-image xui-w-fluid-100 xui-lg-h-200 xui-h-100 ${selectedImage === image ? 'selected' : ''}`} src={image} xui-img-src={image} alt={viewProduct.data.name + ` Image ${index + 1}`} onClick={() => handleThumbnailClick(image)} />
																<div className='xui-text-center xui-d-grid xui-grid-col-2 xui-lg-grid-col-2 xui-md-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2 xui-mb-2'>
																	<div>
																		<p className="xui-opacity-4 xui-font-sz-100 xui-m-half xui-cursor-pointer xui-text-dc-underline" onClick={() => {
																			showPreview(image);
																		}}><span className="xui-font-w-bold">Click to view</span></p>
																	</div>
																	<div>
																		<p className="xui-opacity-4 xui-font-sz-100 xui-m-half xui-text-red xui-cursor-pointer xui-text-dc-underline" onClick={() => { DeleteProductImageSetUniqueId(viewProduct.data.product_images.find((val) => { return val.image === image; }).unique_id) }} xui-modal-open="deleteProductImageModal"><span className="xui-font-w-bold">Delete</span></p>
																	</div>
																</div>
															</div>
														))
													}
												</div>
											</>
									}
								</>
							)
					}

					<form className="xui-form" layout="2" onSubmit={handleUploadProductImages}>
						<div className="xui-form-box xui-mt-2">
							<label>Images (max 10 files)</label>
							<input className="xui-font-sz-90" type={"file"} multiple accept=".png, .jpg, .jpeg, .heic, .webp" id="productImages" 
							// onChange={handleSelectProductImages} // No need for this ever again, check hook for new way for multiple images
							required></input>
						</div>
						{
							uploadingProductImagesPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingProductImagesPercentage} id="uploader" max="100">{uploadingProductImagesPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}

						{ loadingProductImages && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

						<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorProductImages}</span></p>
						<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successProductImages}</span></p>

						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingProductImages} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Images</span>
								{
									loadingProductImages ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>
				</div>
			</section>
			<section className='xui-modal' xui-modal="deleteProductImageModal" id="deleteProductImageModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Product Image</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteProductImage}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteProductImage}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteProductImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteProductImage ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteProductImage ? "" : "deleteProductImageModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			{/* <section className='xui-modal' xui-modal="addProductModal" id="addProductModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-1100 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addProductModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Product</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddProduct}>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
							<div className="xui-form-box xui-mt-2">
								<label>Category</label>
								<select value={categoryUniqueId} onChange={handleCategoryUniqueId} className="xui-bdr-black" required>
									<option selected value={""}>Select Category</option>
									{
										allCategory && allCategory.success && allCategory.data.rows.length !== 0 ? (
											allCategory.data.rows.map((item, index) => {
												return (
													<option key={index} value={item.unique_id}>{item.name}</option>
												)
											})
										) : ""
									}
								</select>
								{ errorCategory ?? <p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCategory}</span></p> }
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>Name</label>
								<input className="xui-font-sz-90" type="text" value={name} onChange={handleName} required placeholder="Enter name of product"></input>
							</div>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
							<div className="xui-form-box xui-mt-2">
								<label>Description</label>
								<textarea type={"text"} maxLength={500} placeholder={"Enter product description"} value={description} onChange={handleDescription}></textarea>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>Specification</label>
								<textarea type={"text"} maxLength={500} placeholder={"Enter product specifications. E.g. Color: Red, Model: Type-C etc."} value={specification} onChange={handleSpecification}></textarea>
							</div>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
							<div className="xui-form-box xui-mt-2">
								<label>Quantity</label>
								<input className="xui-font-sz-90" type="number" value={quantity} onChange={handleQuantity} required placeholder="Enter quantity of product"></input>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>Max Quantity</label>
								<input className="xui-font-sz-90" type="number" value={maxQuantity} onChange={handleMaxQuantity} required placeholder="Enter max quantity of product before multiplying shipping"></input>
							</div>
						</div>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
							<div className="xui-form-box xui-mt-2">
								<label>Price (USD)</label>
								<input className="xui-font-sz-90" type="number" min={0} value={price} onChange={handlePrice} required placeholder="Enter price of product"></input>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>Sales Price (USD) [Optional]</label>
								<input className="xui-font-sz-90" type="number" min={0} value={salesPrice} onChange={handleSalesPrice} placeholder="Enter sales price of product"></input>
							</div>
						</div>
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddProduct} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Product</span>
								{
									loadingAddProduct ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddProduct}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddProduct}</span></p>
				</div>
			</section> */}
			{/* <section className='xui-modal' xui-modal="editProductModal" id="editProductModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-1100 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editProductModal">
						<Close width="24" height="24" />
					</div>
					<h1>Edit Product</h1>
					<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
						<form className="xui-form" layout="2" onSubmit={handleUpdateProductCategory}>
							<div className="xui-form-box xui-mt-2">
								<label>Category</label>
								<select value={UpdateProductCategoryUniqueId} onChange={UpdateProductHandleCategoryUniqueId} className="xui-bdr-black" required>
									<option selected value={""}>Select Category</option>
									{
										allCategory && allCategory.success && allCategory.data.rows.length !== 0 ? (
											allCategory.data.rows.map((item, index) => {
												return (
													<option key={index} value={item.unique_id}>{item.name}</option>
												)
											})
										) : ""
									}
								</select>
								{ errorCategory ?? <p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCategory}</span></p> }
							</div>

							<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProductCategory}</span></p>
							<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProductCategory}</span></p>
							
							<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
								<button disabled={loadingUpdateProductCategory} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
									<span className="xui-mr-half">Save Changes</span>
									{
										loadingUpdateProductCategory ?
											<Loading width="12" height="12" />
											: <Arrowright width="12" height="12" />
									}
								</button>
							</div>
						</form>
						<form className="xui-form" layout="2" onSubmit={handleUpdateProductName}>
							<div className="xui-form-box xui-mt-2">
								<label>Name</label>
								<input className="xui-font-sz-90" type="text" value={UpdateProductName} onChange={UpdateProductHandleName} required placeholder="Enter name of product"></input>
							</div>

							<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProductName}</span></p>
							<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProductName}</span></p>
							
							<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
								<button disabled={loadingUpdateProductName} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
									<span className="xui-mr-half">Save Changes</span>
									{
										loadingUpdateProductName ?
											<Loading width="12" height="12" />
											: <Arrowright width="12" height="12" />
									}
								</button>
							</div>
						</form>
					</div>
					<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
						<form className="xui-form" layout="2" onSubmit={handleUpdateProductDescription}>
							<div className="xui-form-box xui-mt-2">
								<label>Description</label>
								<textarea type={"text"} maxLength={500} placeholder={"Enter product description"} value={UpdateProductDescription} onChange={UpdateProductHandleDescription}></textarea>
							</div>

							<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProductDescription}</span></p>
							<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProductDescription}</span></p>

							<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
								<button disabled={loadingUpdateProductDescription} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
									<span className="xui-mr-half">Save Changes</span>
									{
										loadingUpdateProductDescription ?
											<Loading width="12" height="12" />
											: <Arrowright width="12" height="12" />
									}
								</button>
							</div>
						</form>
						<form className="xui-form" layout="2" onSubmit={handleUpdateProductSpecification}>
							<div className="xui-form-box xui-mt-2">
								<label>Specification</label>
								<textarea type={"text"} maxLength={500} placeholder={"Enter product specifications. E.g. Color: Red, Model: Type-C etc."} value={UpdateProductSpecification} onChange={UpdateProductHandleSpecification}></textarea>
							</div>

							<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProductSpecification}</span></p>
							<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProductSpecification}</span></p>

							<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
								<button disabled={loadingUpdateProductSpecification} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
									<span className="xui-mr-half">Save Changes</span>
									{
										loadingUpdateProductSpecification ?
											<Loading width="12" height="12" />
											: <Arrowright width="12" height="12" />
									}
								</button>
							</div>
						</form>
					</div>
					<form className="xui-form" layout="2" onSubmit={handleUpdateProductStock}>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
							<div className="xui-form-box xui-mt-2">
								<label>Quantity</label>
								<input className="xui-font-sz-90" type="number" value={UpdateProductQuantity} onChange={UpdateProductHandleQuantity} required placeholder="Enter quantity of product"></input>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>Max Quantity</label>
								<input className="xui-font-sz-90" type="number" value={UpdateProductMaxQuantity} onChange={UpdateProductHandleMaxQuantity} required placeholder="Enter max quantity of product before multiplying shipping"></input>
							</div>
						</div>

						<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProductStock}</span></p>
						<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProductStock}</span></p>

						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingUpdateProductStock} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Changes</span>
								{
									loadingUpdateProductStock ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>
					<form className="xui-form" layout="2" onSubmit={handleUpdateProductPrices}>
						<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
							<div className="xui-form-box xui-mt-2">
								<label>Price (USD)</label>
								<input className="xui-font-sz-90" type="number" min={0} value={UpdateProductPrice} onChange={UpdateProductHandlePrice} required placeholder="Enter price of product"></input>
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>Sales Price (USD) [Optional]</label>
								<input className="xui-font-sz-90" type="number" min={0} value={UpdateProductSalesPrice} onChange={UpdateProductHandleSalesPrice} placeholder="Enter sales price of product"></input>
							</div>
						</div>

						<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProductPrices}</span></p>
						<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProductPrices}</span></p>
						
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingUpdateProductPrices} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Changes</span>
								{
									loadingUpdateProductPrices ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>
				</div>
			</section> */}
			<section className='xui-modal' xui-modal="deleteProductModal" id="deleteProductModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Product</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteProduct}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteProduct}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteProduct} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteProduct ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteProduct ? "" : "deleteProductModal"}>
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