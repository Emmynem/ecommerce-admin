import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAddProduct } from "../hooks/useProducts";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function AddProduct() {
	const navigate = useNavigate();

	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const editorSpecificationRef = useRef(null);
	const editorDescriptionRef = useRef(null);

	const [showConfirmAddProduct, setShowConfirmAddProduct] = useState(false);

	const [categories, setCategories] = useState(null);

	const {
		categoryUniqueId, description, errorAddProduct, handleAddProduct, handleCategoryUniqueId, handleDescription, handleMaxQuantity,
		handleName, handlePrice, handleQuantity, handleSalesPrice, handleSpecification, loadingAddProduct, maxQuantity, name, price,
		productUniqueId, quantity, removeAddProductModal, salesPrice, setCategoryUniqueId, setDescription, setMaxQuantity, setName, setPrice,
		setQuantity, setRemoveAddProductModal, setSalesPrice, setSpecification, specification, successAddProduct
	} = useAddProduct();

	const setSpecificationContents = () => {
		if (editorSpecificationRef.current) {
			handleSpecification(editorSpecificationRef.current.getContent());
		}
	};

	const setDescriptionContents = () => {
		if (editorDescriptionRef.current) {
			handleDescription(editorDescriptionRef.current.getContent());
		}
	};

	async function getAllCategories() {
		setCategories(null);
		const response = await getCategories(cookie, 1, 100);
		setCategories(response.data);
		if (response.error) setCategories(null);
	};

	useEffect(() => {
		if (categories === null) {
			getAllCategories();
		}
	}, [categories]);

	if (removeAddProductModal) {
		setRemoveAddProductModal(null);
		setTimeout(function () {
			navigate(`/internal/products`);
		}, 1500)
	}

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>Create new Product</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half"></p>
							</div>
						</div>
						<form className="xui-form" layout="2" onSubmit={handleAddProduct}>
							<div className="xui-form-box xui-mt-1">
								<label>Category</label>
								<select onChange={handleCategoryUniqueId} value={categoryUniqueId} required>
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
							</div>
							<div className="xui-form-box xui-mt-2">
								<label>Name</label>
								<input className="xui-font-sz-90" type="text" value={name} onChange={handleName} required placeholder="Enter name of product"></input>
							</div>
							<div className='xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-grid-gap-1 xui-lg-grid-gap-2'>
								<div className="xui-form-box xui-mt-2">
									<label>Quantity</label>
									<input className="xui-font-sz-90" type="number" min={0} value={quantity} onChange={handleQuantity} required placeholder="Enter quantity of product"></input>
								</div>
								<div className="xui-form-box xui-mt-2">
									<label>Max Quantity</label>
									<input className="xui-font-sz-90" type="number" min={0} value={maxQuantity} onChange={handleMaxQuantity} required placeholder="Enter max quantity of product before multiplying shipping"></input>
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
							<div className="xui-form-box xui-mt-2">
								<label className="">Specification</label>
								<BundledEditor
									onInit={(evt, editor) => editorSpecificationRef.current = editor}
									initialValue={specification}
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
							<div className="xui-form-box xui-mt-2">
								<label className="">Description</label>
								<BundledEditor
									onInit={(evt, editor) => editorDescriptionRef.current = editor}
									initialValue={description}
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
								showConfirmAddProduct ?
									<div className="xui-m-3">
										<center>
											<h4>Confirm Add Product</h4>
											<p className="xui-opacity-5 xui-font-sz-90 xui-m-half">Are you sure you want to continue with this action?</p>
										</center>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddProduct}</span></p>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddProduct}</span></p>
										<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
											<div className="xui-d-inline-flex xui-flex-ai-center">
												<button onClick={handleAddProduct} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Yes</span>
													{
														loadingAddProduct ?
															<Loading width="12" height="12" />
															: <Check width="20" height="20" />
													}
												</button>
											</div>
											<div className="xui-d-inline-flex xui-flex-ai-center">
												<button onClick={() => setShowConfirmAddProduct(false)} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">No</span>
													<Close width="20" height="20" />
												</button>
											</div>
										</div>
									</div> :
									<div>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddProduct}</span></p>
										<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddProduct}</span></p>
										<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
											<button disabled={categoryUniqueId && categoryUniqueId.length < 2 || !quantity || !maxQuantity || !price} onClick={() => { setSpecificationContents(); setDescriptionContents(); setShowConfirmAddProduct(true); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
												<span className="xui-mr-half">Save Product</span>
											</button>
										</div>
									</div>
							}
						</form>
					</section>
				</Content>
			</Screen>
		</>
	);

}