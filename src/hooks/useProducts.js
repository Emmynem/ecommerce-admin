import { useState } from "react";
import useCookie from "./useCookie";
import { config } from "../config";
import { 
	addProduct, addProductImages, deleteProduct, deleteProductImage, editProductCategory, editProductDescription, editProductName, 
	editProductPrices, editProductSpecification, editProductStock
} from "../api/products";
import { uploadFiles } from "../api/clouder";

const useAddProduct = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingAddProduct, setLoadingAddProduct] = useState(false);
	const [removeAddProductModal, setRemoveAddProductModal] = useState(null);
	const [productUniqueId, setProductUniqueId] = useState(null);
	const [categoryUniqueId, setCategoryUniqueId] = useState(null);
	const [name, setName] = useState(null);
	const [description, setDescription] = useState(null);
	const [specification, setSpecification] = useState(null);
	const [quantity, setQuantity] = useState(null);
	const [maxQuantity, setMaxQuantity] = useState(null);
	const [price, setPrice] = useState(null);
	const [salesPrice, setSalesPrice] = useState(null);
	
	const [errorAddProduct, setErrorAddProduct] = useState(null);
	const [successAddProduct, setSuccessAddProduct] = useState(null);

	const handleCategoryUniqueId = (e) => { e.preventDefault(); setCategoryUniqueId(e.target.value); };
	const handleName = (e) => { e.preventDefault(); setName(e.target.value); };
	const handleDescription = (e) => { e.preventDefault(); setDescription(e.target.value); };
	const handleSpecification = (e) => { e.preventDefault(); setSpecification(e.target.value); };
	const handleQuantity = (e) => { e.preventDefault(); setQuantity(e.target.value); };
	const handleMaxQuantity = (e) => { e.preventDefault(); setMaxQuantity(e.target.value); };
	const handlePrice = (e) => { e.preventDefault(); setPrice(e.target.value); };
	const handleSalesPrice = (e) => { e.preventDefault(); setSalesPrice(e.target.value); };
	
	const handleAddProduct = (e) => {
		e.preventDefault();

		if (!loadingAddProduct) {
			if (!categoryUniqueId) {
				setErrorAddProduct(null);
				setSuccessAddProduct(null);
				setErrorAddProduct("Category Unique Id is required");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (!name) {
				setErrorAddProduct("Name is required");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (name.length < 3) {
				setErrorAddProduct("Name minimum characters - 3");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (name.length > 200) {
				setErrorAddProduct("Name maximum characters - 200");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (!description) {
				setErrorAddProduct("Description is required");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (description.length < 3) {
				setErrorAddProduct("Description minimum characters - 3");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (!specification) {
				setErrorAddProduct("Specification is required");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (!quantity) {
				setErrorAddProduct("Quantity is required");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (parseInt(quantity) < 1) {
				setErrorAddProduct("Quantity minimum is 1");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (!maxQuantity) {
				setErrorAddProduct("Max Quantity is required");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (parseInt(maxQuantity) < 1) {
				setErrorAddProduct("Max Quantity minimum is 1");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (!price) {
				setErrorAddProduct("Price is required");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (parseInt(price) < 0) {
				setErrorAddProduct("Price minimum is 1");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else if (salesPrice && parseInt(salesPrice) < 0) {
				setErrorAddProduct("Sales Price minimum is 1");
				setTimeout(function () {
					setErrorAddProduct(null);
				}, 2500)
			} else {
				setLoadingAddProduct(true);

				const addProductRes = addProduct(cookie, {
					category_unique_id: categoryUniqueId,
					name: name,
					description: description,
					specification: specification,
					quantity: quantity,
					max_quantity: maxQuantity,
					price: price,
					sales_price: !salesPrice || salesPrice === 0 ? undefined : salesPrice,
				})

				addProductRes.then(res => {
					setLoadingAddProduct(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorAddProduct(error);
							setTimeout(function () {
								setErrorAddProduct(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorAddProduct(error);
							setTimeout(function () {
								setErrorAddProduct(null);
							}, 2000)
						}
					} else {
						setErrorAddProduct(null);
						setSuccessAddProduct(`Product added successfully!`);

						setProductUniqueId(res.data.data.unique_id);

						setTimeout(function () {
							setSuccessAddProduct(null);
							setRemoveAddProductModal(true);
							setCategoryUniqueId(null);
							setName(null);
							setDescription(null);
							setSpecification(null);
							setQuantity(null);
							setMaxQuantity(null);
							setPrice(null);
							setSalesPrice(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingAddProduct(false);
				})

			}
		}
	};

	return {
		cookie, categoryUniqueId, name, description, specification, quantity, maxQuantity, price, salesPrice, productUniqueId, 
		loadingAddProduct, setRemoveAddProductModal, errorAddProduct, successAddProduct, handleAddProduct, removeAddProductModal, 
		handleCategoryUniqueId, handleName, handleDescription, handleSpecification, handleQuantity, handleMaxQuantity, handlePrice, handleSalesPrice, 
		setName, setDescription, setSpecification, setQuantity, setMaxQuantity, setPrice, setSalesPrice, setCategoryUniqueId
	};
};

const useUpdateProductCategory = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateProductCategory, setLoadingUpdateProductCategory] = useState(false);
	const [removeUpdateProductCategoryModal, setRemoveUpdateProductCategoryModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [categoryUniqueId, setCategoryUniqueId] = useState(null);

	const [errorUpdateProductCategory, setErrorUpdateProductCategory] = useState(null);
	const [successUpdateProductCategory, setSuccessUpdateProductCategory] = useState(null);

	const handleCategoryUniqueId = (e) => { e.preventDefault(); setCategoryUniqueId(e.target.value); };

	const handleUpdateProductCategory = (e) => {
		e.preventDefault();

		if (!loadingUpdateProductCategory) {
			if (!uniqueId) {
				setErrorUpdateProductCategory(null);
				setSuccessUpdateProductCategory(null);
				setErrorUpdateProductCategory("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateProductCategory(null);
				}, 2500)
			} else if (!categoryUniqueId) {
				setErrorUpdateProductCategory("Category is required");
				setTimeout(function () {
					setErrorUpdateProductCategory(null);
				}, 2500)
			} else if (categoryUniqueId.length > 200) {
				setErrorUpdateProductCategory("Category maximum characters - 200");
				setTimeout(function () {
					setErrorUpdateProductCategory(null);
				}, 2500)
			} else {
				setLoadingUpdateProductCategory(true);

				const editProductCategoryRes = editProductCategory(cookie, {
					unique_id: uniqueId,
					category_unique_id: categoryUniqueId
				})

				editProductCategoryRes.then(res => {
					setLoadingUpdateProductCategory(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateProductCategory(error);
							setTimeout(function () {
								setErrorUpdateProductCategory(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateProductCategory(error);
							setTimeout(function () {
								setErrorUpdateProductCategory(null);
							}, 2000)
						}
					} else {
						setErrorUpdateProductCategory(null);
						setSuccessUpdateProductCategory(`Product category edited!`);

						setTimeout(function () {
							setSuccessUpdateProductCategory(null);
							setRemoveUpdateProductCategoryModal(true);
							setUniqueId(null);
							setCategoryUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateProductCategory(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateProductCategory, removeUpdateProductCategoryModal, errorUpdateProductCategory, successUpdateProductCategory, handleUpdateProductCategory,
		setRemoveUpdateProductCategoryModal, setUniqueId, setCategoryUniqueId, categoryUniqueId, handleCategoryUniqueId
	};
};

const useUpdateProductName = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateProductName, setLoadingUpdateProductName] = useState(false);
	const [removeUpdateProductNameModal, setRemoveUpdateProductNameModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [name, setName] = useState(null);

	const [errorUpdateProductName, setErrorUpdateProductName] = useState(null);
	const [successUpdateProductName, setSuccessUpdateProductName] = useState(null);

	const handleName = (e) => { e.preventDefault(); setName(e.target.value); };

	const handleUpdateProductName = (e) => {
		e.preventDefault();

		if (!loadingUpdateProductName) {
			if (!uniqueId) {
				setErrorUpdateProductName(null);
				setSuccessUpdateProductName(null);
				setErrorUpdateProductName("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateProductName(null);
				}, 2500)
			} else if (!name) {
				setErrorUpdateProductName("Name is required");
				setTimeout(function () {
					setErrorUpdateProductName(null);
				}, 2500)
			} else if (name.length > 200) {
				setErrorUpdateProductName("Name maximum characters - 200");
				setTimeout(function () {
					setErrorUpdateProductName(null);
				}, 2500)
			} else {
				setLoadingUpdateProductName(true);

				const editProductNameRes = editProductName(cookie, {
					unique_id: uniqueId,
					name
				})

				editProductNameRes.then(res => {
					setLoadingUpdateProductName(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateProductName(error);
							setTimeout(function () {
								setErrorUpdateProductName(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateProductName(error);
							setTimeout(function () {
								setErrorUpdateProductName(null);
							}, 2000)
						}
					} else {
						setErrorUpdateProductName(null);
						setSuccessUpdateProductName(`Product name edited!`);

						setTimeout(function () {
							setSuccessUpdateProductName(null);
							setRemoveUpdateProductNameModal(true);
							setUniqueId(null);
							setName(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateProductName(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateProductName, removeUpdateProductNameModal, errorUpdateProductName, successUpdateProductName, handleUpdateProductName,
		setRemoveUpdateProductNameModal, setUniqueId, setName, name, handleName
	};
};

const useUpdateProductDescription = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateProductDescription, setLoadingUpdateProductDescription] = useState(false);
	const [removeUpdateProductDescriptionModal, setRemoveUpdateProductDescriptionModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [description, setDescription] = useState(null);

	const [errorUpdateProductDescription, setErrorUpdateProductDescription] = useState(null);
	const [successUpdateProductDescription, setSuccessUpdateProductDescription] = useState(null);

	const handleDescription = (e) => { e.preventDefault(); setDescription(e.target.value); };

	const handleUpdateProductDescription = (e) => {
		e.preventDefault();

		if (!loadingUpdateProductDescription) {
			if (!uniqueId) {
				setErrorUpdateProductDescription(null);
				setSuccessUpdateProductDescription(null);
				setErrorUpdateProductDescription("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateProductDescription(null);
				}, 2500)
			} else if (!description) {
				setErrorUpdateProductDescription("Description is required");
				setTimeout(function () {
					setErrorUpdateProductDescription(null);
				}, 2500)
			} else if (description.length < 3) {
				setErrorUpdateProductDescription("Description minimum characters - 3");
				setTimeout(function () {
					setErrorUpdateProductDescription(null);
				}, 2500)
			} else {
				setLoadingUpdateProductDescription(true);

				const editProductDescriptionRes = editProductDescription(cookie, {
					unique_id: uniqueId,
					description
				})

				editProductDescriptionRes.then(res => {
					setLoadingUpdateProductDescription(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateProductDescription(error);
							setTimeout(function () {
								setErrorUpdateProductDescription(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateProductDescription(error);
							setTimeout(function () {
								setErrorUpdateProductDescription(null);
							}, 2000)
						}
					} else {
						setErrorUpdateProductDescription(null);
						setSuccessUpdateProductDescription(`Product description edited!`);

						setTimeout(function () {
							setSuccessUpdateProductDescription(null);
							setRemoveUpdateProductDescriptionModal(true);
							setUniqueId(null);
							setDescription(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateProductDescription(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateProductDescription, removeUpdateProductDescriptionModal, errorUpdateProductDescription, successUpdateProductDescription, handleUpdateProductDescription,
		setRemoveUpdateProductDescriptionModal, setUniqueId, setDescription, description, handleDescription
	};
};

const useUpdateProductSpecification = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateProductSpecification, setLoadingUpdateProductSpecification] = useState(false);
	const [removeUpdateProductSpecificationModal, setRemoveUpdateProductSpecificationModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [specification, setSpecification] = useState(null);

	const [errorUpdateProductSpecification, setErrorUpdateProductSpecification] = useState(null);
	const [successUpdateProductSpecification, setSuccessUpdateProductSpecification] = useState(null);

	const handleSpecification = (e) => { e.preventDefault(); setSpecification(e.target.value); };

	const handleUpdateProductSpecification = (e) => {
		e.preventDefault();

		if (!loadingUpdateProductSpecification) {
			if (!uniqueId) {
				setErrorUpdateProductSpecification(null);
				setSuccessUpdateProductSpecification(null);
				setErrorUpdateProductSpecification("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateProductSpecification(null);
				}, 2500)
			} else if (!specification) {
				setErrorUpdateProductSpecification("Specification is required");
				setTimeout(function () {
					setErrorUpdateProductSpecification(null);
				}, 2500)
			} else {
				setLoadingUpdateProductSpecification(true);

				const editProductSpecificationRes = editProductSpecification(cookie, {
					unique_id: uniqueId,
					specification
				})

				editProductSpecificationRes.then(res => {
					setLoadingUpdateProductSpecification(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateProductSpecification(error);
							setTimeout(function () {
								setErrorUpdateProductSpecification(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateProductSpecification(error);
							setTimeout(function () {
								setErrorUpdateProductSpecification(null);
							}, 2000)
						}
					} else {
						setErrorUpdateProductSpecification(null);
						setSuccessUpdateProductSpecification(`Product specification edited!`);

						setTimeout(function () {
							setSuccessUpdateProductSpecification(null);
							setRemoveUpdateProductSpecificationModal(true);
							setUniqueId(null);
							setSpecification(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateProductSpecification(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateProductSpecification, removeUpdateProductSpecificationModal, errorUpdateProductSpecification, successUpdateProductSpecification, handleUpdateProductSpecification,
		setRemoveUpdateProductSpecificationModal, setUniqueId, setSpecification, specification, handleSpecification
	};
};

const useUpdateProductPrices = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateProductPrices, setLoadingUpdateProductPrices] = useState(false);
	const [removeUpdateProductPricesModal, setRemoveUpdateProductPricesModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [price, setPrice] = useState(null);
	const [salesPrice, setSalesPrice] = useState(null);

	const [errorUpdateProductPrices, setErrorUpdateProductPrices] = useState(null);
	const [successUpdateProductPrices, setSuccessUpdateProductPrices] = useState(null);

	const handlePrice = (e) => { e.preventDefault(); setPrice(e.target.value); };
	const handleSalesPrice = (e) => { e.preventDefault(); setSalesPrice(e.target.value); };

	const handleUpdateProductPrices = (e) => {
		e.preventDefault();

		if (!loadingUpdateProductPrices) {
			if (!uniqueId) {
				setErrorUpdateProductPrices(null);
				setSuccessUpdateProductPrices(null);
				setErrorUpdateProductPrices("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateProductPrices(null);
				}, 2500)
			} else if (!price) {
				setErrorUpdateProductPrices("Price is required");
				setTimeout(function () {
					setErrorUpdateProductPrices(null);
				}, 2500)
			} else if (parseInt(price) < 0) {
				setErrorUpdateProductPrices("Price minimum is 1");
				setTimeout(function () {
					setErrorUpdateProductPrices(null);
				}, 2500)
			} else if (salesPrice && parseInt(salesPrice) < 0) {
				setErrorUpdateProductPrices("Sales Price minimum is 1");
				setTimeout(function () {
					setErrorUpdateProductPrices(null);
				}, 2500)
			} else {
				setLoadingUpdateProductPrices(true);

				const editProductPricesRes = editProductPrices(cookie, {
					unique_id: uniqueId,
					price: price,
					sales_price: !salesPrice || salesPrice === 0 ? undefined : salesPrice,
				})

				editProductPricesRes.then(res => {
					setLoadingUpdateProductPrices(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateProductPrices(error);
							setTimeout(function () {
								setErrorUpdateProductPrices(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateProductPrices(error);
							setTimeout(function () {
								setErrorUpdateProductPrices(null);
							}, 2000)
						}
					} else {
						setErrorUpdateProductPrices(null);
						setSuccessUpdateProductPrices(`Product prices edited!`);

						setTimeout(function () {
							setSuccessUpdateProductPrices(null);
							setRemoveUpdateProductPricesModal(true);
							setUniqueId(null);
							setPrice(null);
							setSalesPrice(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateProductPrices(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateProductPrices, removeUpdateProductPricesModal, errorUpdateProductPrices, successUpdateProductPrices, handleUpdateProductPrices,
		setRemoveUpdateProductPricesModal, setUniqueId, setPrice, setSalesPrice, price, salesPrice, handlePrice, handleSalesPrice
	};
};

const useUpdateProductStock = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingUpdateProductStock, setLoadingUpdateProductStock] = useState(false);
	const [removeUpdateProductStockModal, setRemoveUpdateProductStockModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);
	const [quantity, setQuantity] = useState(null);
	const [maxQuantity, setMaxQuantity] = useState(null);

	const [errorUpdateProductStock, setErrorUpdateProductStock] = useState(null);
	const [successUpdateProductStock, setSuccessUpdateProductStock] = useState(null);

	const handleQuantity = (e) => { e.preventDefault(); setQuantity(e.target.value); };
	const handleMaxQuantity = (e) => { e.preventDefault(); setMaxQuantity(e.target.value); };

	const handleUpdateProductStock = (e) => {
		e.preventDefault();

		if (!loadingUpdateProductStock) {
			if (!uniqueId) {
				setErrorUpdateProductStock(null);
				setSuccessUpdateProductStock(null);
				setErrorUpdateProductStock("Unique ID is required");
				setTimeout(function () {
					setErrorUpdateProductStock(null);
				}, 2500)
			} else if (!quantity) {
				setErrorUpdateProductStock("Quantity is required");
				setTimeout(function () {
					setErrorUpdateProductStock(null);
				}, 2500)
			} else if (parseInt(quantity) < 1) {
				setErrorUpdateProductStock("Quantity minimum is 1");
				setTimeout(function () {
					setErrorUpdateProductStock(null);
				}, 2500)
			} else if (!maxQuantity) {
				setErrorUpdateProductStock("Max Quantity is required");
				setTimeout(function () {
					setErrorUpdateProductStock(null);
				}, 2500)
			} else if (parseInt(maxQuantity) < 1) {
				setErrorUpdateProductStock("Max Quantity minimum is 1");
				setTimeout(function () {
					setErrorUpdateProductStock(null);
				}, 2500)
			} else {
				setLoadingUpdateProductStock(true);

				const editProductStockRes = editProductStock(cookie, {
					unique_id: uniqueId,
					quantity: quantity,
					max_quantity: maxQuantity,
				})

				editProductStockRes.then(res => {
					setLoadingUpdateProductStock(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorUpdateProductStock(error);
							setTimeout(function () {
								setErrorUpdateProductStock(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorUpdateProductStock(error);
							setTimeout(function () {
								setErrorUpdateProductStock(null);
							}, 2000)
						}
					} else {
						setErrorUpdateProductStock(null);
						setSuccessUpdateProductStock(`Product stock edited!`);

						setTimeout(function () {
							setSuccessUpdateProductStock(null);
							setRemoveUpdateProductStockModal(true);
							setUniqueId(null);
							setQuantity(null);
							setMaxQuantity(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingUpdateProductStock(false);
				})

			}
		}
	};

	return {
		cookie, loadingUpdateProductStock, removeUpdateProductStockModal, errorUpdateProductStock, successUpdateProductStock, handleUpdateProductStock,
		setRemoveUpdateProductStockModal, setUniqueId, setQuantity, setMaxQuantity, quantity, maxQuantity, handleQuantity, handleMaxQuantity
	};
};

const useUploadProductImages = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingProductImages, setLoadingProductImages] = useState(false);
	const [uniqueId, setUniqueId] = useState(null);
	const [removeProductImagesModal, setRemoveProductImagesModal] = useState(null);
	const [selectedProductImages, setSelectedProductImages] = useState([]);
	const [uploadingProductImagesPercentage, setUploadingProductImagesPercentage] = useState(0);

	const [errorProductImages, setErrorProductImages] = useState(null);
	const [successProductImages, setSuccessProductImages] = useState(null);

	const allowed_extensions = ["image/png", "image/PNG", "image/jpg", "image/JPG", "image/jpeg", "image/JPEG", "image/webp", "image/WEBP"];
	const maximum_file_size = 20 * 1024 * 1024;

	const filterBytes = (bytes) => {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
	};

	const handleUploadProductImages = (e) => {
		e.preventDefault();

		if (!loadingProductImages) {
			if (!uniqueId) {
				setErrorProductImages(null);
				setSuccessProductImages(null);
				setErrorProductImages("Unique ID is required");
				setTimeout(function () {
					setErrorProductImages(null);
				}, 2000)
			} 
			// else if (!allowed_extensions.includes(selectedProductImages.type)) {
			// 	setErrorProductImages("Invalid image format (.png, .jpg, .jpeg & .webp)");
			// 	setTimeout(function () {
			// 		setErrorProductImages(null);
			// 	}, 2000)
			// } else if (selectedProductImages.size > maximum_file_size) {
			// 	setErrorProductImages("File too large (max 20mb)");
			// 	setTimeout(function () {
			// 		setErrorProductImages(null);
			// 	}, 2000)
			// } 
			else {
				setLoadingProductImages(true);

				const files = document.getElementById('productImages').files;
				const formdata = new FormData();
				formdata.append("file_path", "products");
				for (let i = 0; i < files.length; i++) {
					formdata.append('files', files[i]);
				}
				formdata.append("cloudinary_name", config.cloudy_name);
				formdata.append("cloudinary_key", config.cloudy_key);
				formdata.append("cloudinary_secret", config.cloudy_secret);

				const uploadFilesRes = uploadFiles(formdata)

				uploadFilesRes.then(res => {
					setLoadingProductImages(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorProductImages(error);
							setTimeout(function () {
								setErrorProductImages(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorProductImages(error);
							setTimeout(function () {
								setErrorProductImages(null);
							}, 2000)
						}
					} else {
						setErrorProductImages(null);
						setUploadingProductImagesPercentage(0);
						setSuccessProductImages(`Product Images Uploaded!`);

						const addProductImagesRes = addProductImages(cookie, {
							product_unique_id: uniqueId, product_images: res.data.data
						})

						addProductImagesRes.then(res => {
							if (res.err) {
								if (!res.error.response.data.success) {
									const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
									setUploadingProductImagesPercentage(0);
									setLoadingProductImages(false);
									setErrorProductImages(error);
									setTimeout(function () {
										setErrorProductImages(null);
									}, 2000)
								} else {
									const error = `${res.error.code} - ${res.error.message}`;
									setUploadingProductImagesPercentage(0);
									setLoadingProductImages(false);
									setErrorProductImages(error);
									setTimeout(function () {
										setErrorProductImages(null);
									}, 2000)
								}
							} else {
								setErrorProductImages(null);
								setUploadingProductImagesPercentage(0);
								setSuccessProductImages(`Product Images saved successfully!`);

								setTimeout(function () {
									setLoadingProductImages(false);
									setSuccessProductImages(null);
									setRemoveProductImagesModal(true);
									// setUniqueId(null);
									document.getElementById("productImages").value = "";
								}, 3000)
							}
						}).catch(err => {
							setUploadingProductImagesPercentage(0);
							setLoadingProductImages(false);
						})
					}
				}).catch(err => {
					setUploadingProductImagesPercentage(0);
					setLoadingProductImages(false);
				})
			}
		}
	};

	return {
		cookie, loadingProductImages, errorProductImages, successProductImages, handleUploadProductImages, uniqueId, setSelectedProductImages,
		setUniqueId, uploadingProductImagesPercentage, selectedProductImages, removeProductImagesModal, setRemoveProductImagesModal
	};
};

const useDeleteProduct = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingDeleteProduct, setLoadingDeleteProduct] = useState(false);
	const [removeDeleteProductModal, setRemoveDeleteProductModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteProduct, setErrorDeleteProduct] = useState(null);
	const [successDeleteProduct, setSuccessDeleteProduct] = useState(null);

	const handleDeleteProduct = () => {

		if (!loadingDeleteProduct) {
			if (!uniqueId) {
				setErrorDeleteProduct(null);
				setSuccessDeleteProduct(null);
				setErrorDeleteProduct("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteProduct(null);
				}, 2500)
			} else {
				setLoadingDeleteProduct(true);

				const deleteProductRes = deleteProduct(cookie, {
					unique_id: uniqueId
				})

				deleteProductRes.then(res => {
					setLoadingDeleteProduct(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteProduct(error);
							setTimeout(function () {
								setErrorDeleteProduct(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteProduct(error);
							setTimeout(function () {
								setErrorDeleteProduct(null);
							}, 2000)
						}
					} else {
						setErrorDeleteProduct(null);
						setSuccessDeleteProduct(`Product deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteProduct(null);
							setRemoveDeleteProductModal(true);
							// setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteProduct(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteProduct, removeDeleteProductModal, errorDeleteProduct, successDeleteProduct, handleDeleteProduct,
		setRemoveDeleteProductModal, setUniqueId, uniqueId
	};
};

const useDeleteProductImage = () => {

	const { cookie } = useCookie(config.key, "");

	const [loadingDeleteProductImage, setLoadingDeleteProductImage] = useState(false);
	const [removeDeleteProductImageModal, setRemoveDeleteProductImageModal] = useState(null);
	const [uniqueId, setUniqueId] = useState(null);

	const [errorDeleteProductImage, setErrorDeleteProductImage] = useState(null);
	const [successDeleteProductImage, setSuccessDeleteProductImage] = useState(null);

	const handleDeleteProductImage = () => {

		if (!loadingDeleteProductImage) {
			if (!uniqueId) {
				setErrorDeleteProductImage(null);
				setSuccessDeleteProductImage(null);
				setErrorDeleteProductImage("Unique ID is required");
				setTimeout(function () {
					setErrorDeleteProductImage(null);
				}, 2500)
			} else {
				setLoadingDeleteProductImage(true);

				const deleteProductImageRes = deleteProductImage(cookie, {
					unique_id: uniqueId
				})

				deleteProductImageRes.then(res => {
					setLoadingDeleteProductImage(false);
					if (res.err) {
						if (!res.error.response.data.success) {
							const error = `${res.error.response.status !== 422 ? res.error.response.data.message : res.error.response.data.data[0].msg}`;
							setErrorDeleteProductImage(error);
							setTimeout(function () {
								setErrorDeleteProductImage(null);
							}, 2000)
						} else {
							const error = `${res.error.code} - ${res.error.message}`;
							setErrorDeleteProductImage(error);
							setTimeout(function () {
								setErrorDeleteProductImage(null);
							}, 2000)
						}
					} else {
						setErrorDeleteProductImage(null);
						setSuccessDeleteProductImage(`Product Image deleted successfully!`);

						setTimeout(function () {
							setSuccessDeleteProductImage(null);
							setRemoveDeleteProductImageModal(true);
							// setUniqueId(null);
						}, 2500)
					}
				}).catch(err => {
					setLoadingDeleteProductImage(false);
				})

			}
		}
	};

	return {
		cookie, loadingDeleteProductImage, removeDeleteProductImageModal, errorDeleteProductImage, successDeleteProductImage, handleDeleteProductImage,
		setRemoveDeleteProductImageModal, setUniqueId, uniqueId
	};
};

export {
	useAddProduct, useUpdateProductCategory, useUpdateProductName, useUpdateProductDescription, useUpdateProductSpecification, 
	useUpdateProductPrices, useUpdateProductStock, useUploadProductImages, useDeleteProduct, useDeleteProductImage 
};
