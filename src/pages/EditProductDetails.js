import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import BundledEditor from '../BundledEditor';
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { getProducts, getProduct } from "../api/products";
import { getCategories } from "../api/categories";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import {
	useUpdateProductCategory, useUpdateProductDescription, useUpdateProductName,
	useUpdateProductPrices, useUpdateProductSpecification, useUpdateProductStock,
} from "../hooks/useProducts";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function EditProductDetails() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const unique_id = searchParams.get("unique_id");

	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorSpecificationRef = useRef(null);
	const editorDescriptionRef = useRef(null);

	const [showConfirmUpdateProductSpecification, setShowConfirmUpdateProductSpecification] = useState(false);
	const [showConfirmUpdateProductDescription, setShowConfirmUpdateProductDescription] = useState(false);

	const [categories, setCategories] = useState(null);

	const {
		categoryUniqueId: UpdateProductCategoryUniqueId, errorUpdateProductCategory, handleCategoryUniqueId: UpdateProductHandleCategoryUniqueId, handleUpdateProductCategory,
		loadingUpdateProductCategory, removeUpdateProductCategoryModal, setCategoryUniqueId: UpdateProductCategorySetCategoryUniqueId, setRemoveUpdateProductCategoryModal,
		setUniqueId: UpdateProductCategorySetUniqueId, successUpdateProductCategory
	} = useUpdateProductCategory();

	const {
		name: UpdateProductName, errorUpdateProductName, handleName: UpdateProductHandleName, handleUpdateProductName, loadingUpdateProductName,
		removeUpdateProductNameModal, setName: UpdateProductSetName, setRemoveUpdateProductNameModal, setUniqueId: UpdateProductNameSetUniqueId, successUpdateProductName
	} = useUpdateProductName();

	const {
		description: UpdateProductDescription, errorUpdateProductDescription, handleDescription: UpdateProductHandleDescription, handleUpdateProductDescription, loadingUpdateProductDescription,
		removeUpdateProductDescriptionModal, setDescription: UpdateProductSetDescription, setRemoveUpdateProductDescriptionModal, setUniqueId: UpdateProductDescriptionSetUniqueId, successUpdateProductDescription
	} = useUpdateProductDescription();

	const {
		specification: UpdateProductSpecification, errorUpdateProductSpecification, handleSpecification: UpdateProductHandleSpecification, handleUpdateProductSpecification, loadingUpdateProductSpecification,
		removeUpdateProductSpecificationModal, setSpecification: UpdateProductSetSpecification, setRemoveUpdateProductSpecificationModal, setUniqueId: UpdateProductSpecificationSetUniqueId, successUpdateProductSpecification
	} = useUpdateProductSpecification();

	const {
		price: UpdateProductPrice, salesPrice: UpdateProductSalesPrice, errorUpdateProductPrices, handlePrice: UpdateProductHandlePrice, handleSalesPrice: UpdateProductHandleSalesPrice, handleUpdateProductPrices, loadingUpdateProductPrices,
		removeUpdateProductPricesModal, setPrice: UpdateProductSetPrice, setSalesPrice: UpdateProductSetSalesPrice, setRemoveUpdateProductPricesModal, setUniqueId: UpdateProductPricesSetUniqueId, successUpdateProductPrices
	} = useUpdateProductPrices();

	const {
		quantity: UpdateProductQuantity, maxQuantity: UpdateProductMaxQuantity, errorUpdateProductStock, handleQuantity: UpdateProductHandleQuantity, handleMaxQuantity: UpdateProductHandleMaxQuantity, handleUpdateProductStock, loadingUpdateProductStock,
		removeUpdateProductStockModal, setQuantity: UpdateProductSetQuantity, setMaxQuantity: UpdateProductSetMaxQuantity, setRemoveUpdateProductStockModal, setUniqueId: UpdateProductStockSetUniqueId, successUpdateProductStock
	} = useUpdateProductStock();


	const setSpecificationContents = () => {
		if (editorSpecificationRef.current) {
			UpdateProductHandleSpecification(editorSpecificationRef.current.getContent());
		}
	};

	const setDescriptionContents = () => {
		if (editorDescriptionRef.current) {
			UpdateProductHandleDescription(editorDescriptionRef.current.getContent());
		}
	};

	const [loadingViewProduct, setLoadingViewProduct] = useState(false)
	const [errorViewProduct, setErrorViewProduct] = useState(null)
	const [viewProduct, setViewProduct] = useState(null)

	async function getAProduct(unique_id) {
		setLoadingViewProduct(true)
		const response = await getProduct(cookie, { unique_id });
		if (!response.err) {
			setViewProduct(response.data);
			UpdateProductCategorySetUniqueId(response.data.data.unique_id);
			UpdateProductNameSetUniqueId(response.data.data.unique_id);
			UpdateProductDescriptionSetUniqueId(response.data.data.unique_id);
			UpdateProductSpecificationSetUniqueId(response.data.data.unique_id);
			UpdateProductPricesSetUniqueId(response.data.data.unique_id);
			UpdateProductStockSetUniqueId(response.data.data.unique_id); 

			UpdateProductCategorySetCategoryUniqueId(response.data.data.category_unique_id);
			UpdateProductSetName(response.data.data.name);
			UpdateProductSetDescription(response.data.data.description);
			UpdateProductSetSpecification(response.data.data.specification);
			UpdateProductSetPrice(response.data.data.price);
			UpdateProductSetSalesPrice(response.data.data.sales_price);
			UpdateProductSetQuantity(response.data.data.quantity);
			UpdateProductSetMaxQuantity(response.data.data.max_quantity);
		} else { setErrorViewProduct(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewProduct(false)
	};

	async function getAllCategories() {
		setCategories(null);
		const response = await getCategories(cookie);
		setCategories(response.data);
		if (response.error) setCategories(null);
	};

	useEffect(() => {
		if (categories === null) {
			getAllCategories();
		}
		if (viewProduct === null) {
			getAProduct(unique_id);
		}
	}, [viewProduct, categories]);

	if (removeUpdateProductCategoryModal || removeUpdateProductNameModal || removeUpdateProductDescriptionModal || removeUpdateProductPricesModal || removeUpdateProductStockModal || removeUpdateProductSpecificationModal) {
		// const modalResponse = document.querySelector("#editProductModal");
		// modalResponse.setAttribute("display", false);
		// callLastProductFunction();
		setRemoveUpdateProductCategoryModal(null);
		setRemoveUpdateProductNameModal(null);
		setRemoveUpdateProductDescriptionModal(null);
		setRemoveUpdateProductSpecificationModal(null);
		setRemoveUpdateProductPricesModal(null);
		setRemoveUpdateProductStockModal(null);
		window.location.reload(true);
	}

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						{
							loadingViewProduct ?
								<center>
									<Loading width="12" height="12" />
								</center> : (
									viewProduct && viewProduct.success ?
										<>
											<form className="xui-form" layout="2" onSubmit={handleUpdateProductCategory}>
												<div className="xui-form-box xui-mt-2">
													<label>Category</label>
													<select value={UpdateProductCategoryUniqueId} onChange={UpdateProductHandleCategoryUniqueId} className="xui-bdr-black" required>
														<option selected value={""}>Select Category</option>
														{
															categories && categories.data.rows.length !== 0 ? (
																categories.data.rows.map((item, index) => {
																	return (
																		<option key={index} value={item.unique_id}>{item.name}</option>
																	)
																})
															) : ""
														}
													</select>
													{/* {errorCategory ?? <p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorCategory}</span></p>} */}
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
											<hr></hr>
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
											<hr></hr>
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
											<hr></hr>
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
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-form-box xui-mt-2">
													<label className="">Specification</label>
													<BundledEditor
														onInit={(evt, editor) => editorSpecificationRef.current = editor}
														initialValue={UpdateProductSpecification}
														init={{
															height: 500,
															font_size_input_default_unit: "pt",
															menubar: false,
															plugins: [
																'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
																'searchreplace', 'table', 'wordcount', 'code',
															],
															toolbar: [
																'undo redo | styles | bold italic forecolor fontsizeinput | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | removeformat | table',
															],
															toolbar_mode: 'floating',
															content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
														}}
													/>
												</div>

												{
													showConfirmUpdateProductSpecification ?
														<div className="xui-m-3">
															<center>
																<h4>Confirm Edit Product Specification</h4>
																<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
															</center>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProductSpecification}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProductSpecification}</span></p>
															<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={handleUpdateProductSpecification} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">Yes</span>
																		{
																			loadingUpdateProductSpecification ?
																				<Loading width="12" height="12" />
																				: <Check width="20" height="20" />
																		}
																	</button>
																</div>
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={() => setShowConfirmUpdateProductSpecification(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">No</span>
																		<Close width="20" height="20" />
																	</button>
																</div>
															</div>
														</div> :
														<div>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProductSpecification}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProductSpecification}</span></p>
															<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
																<button onClick={() => { setSpecificationContents(); setShowConfirmUpdateProductSpecification(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
																	<span className="xui-mr-half">Save Changes</span>
																	<Arrowright width="12" height="12" />
																</button>
															</div>
														</div>

												}
											</form>
											<hr></hr>
											<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
												<div className="xui-form-box xui-mt-2">
													<label className="">Description</label>
													<BundledEditor
														onInit={(evt, editor) => editorDescriptionRef.current = editor}
														initialValue={UpdateProductDescription}
														init={{
															height: 700,
															font_size_input_default_unit: "pt",
															menubar: false,
															plugins: [
																'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
																'searchreplace', 'table', 'wordcount', 'code',
															],
															toolbar: [
																'undo redo | styles | bold italic forecolor fontsizeinput | bullist numlist outdent indent | link image | alignleft aligncenter alignright alignjustify | removeformat | table | code',
															],
															toolbar_mode: 'floating',
															content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
														}}
													/>
												</div>

												{
													showConfirmUpdateProductDescription ?
														<div className="xui-m-3">
															<center>
																<h4>Confirm Edit Product Description</h4>
																<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
															</center>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProductDescription}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProductDescription}</span></p>
															<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={handleUpdateProductDescription} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">Yes</span>
																		{
																			loadingUpdateProductDescription ?
																				<Loading width="12" height="12" />
																				: <Check width="20" height="20" />
																		}
																	</button>
																</div>
																<div className="xui-d-inline-flex xui-flex-ai-center">
																	<button onClick={() => setShowConfirmUpdateProductDescription(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
																		<span className="xui-mr-half">No</span>
																		<Close width="20" height="20" />
																	</button>
																</div>
															</div>
														</div> :
														<div>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateProductDescription}</span></p>
															<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateProductDescription}</span></p>
															<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
																<button onClick={() => { setDescriptionContents(); setShowConfirmUpdateProductDescription(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
																	<span className="xui-mr-half">Save Changes</span>
																	<Arrowright width="12" height="12" />
																</button>
															</div>
														</div>

												}
											</form>
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
					</section>
				</Content>
			</Screen>
		</>
	);

}