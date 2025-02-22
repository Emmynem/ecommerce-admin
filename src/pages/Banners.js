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
import { getBanners, getBanner } from "../api/banners";
import Loading from "../icons/Loading";
import Delete from "../icons/Delete";
import { useAddBanner, useDeleteBanner, useUpdateBannerDetails, useUploadBannerImage } from "../hooks/useBanners";
import Edit from "../icons/Edit";
import EyeOpen from "../icons/EyeOpen";

export default function Banners() {
	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);

	const {
		errorAddBanner, handleAddBanner, handleName, loadingAddBanner, name, removeAddBannerModal, selectedAddBanner, setName,
		setRemoveAddBannerModal, setSelectedAddBanner, successAddBanner, uploadingAddBannerPercentage, handleLink, link, setLink
	} = useAddBanner();

	const {
		errorUpdateBannerDetails, handleName: handleNameEdit, handleUpdateBannerDetails, loadingUpdateBannerDetails,
		name: nameEdit, link: linkEdit, removeUpdateBannerDetailsModal, setName: setNameEdit, setRemoveUpdateBannerDetailsModal,
		setUniqueId: EditUniqueIdDetails, successUpdateBannerDetails, setLink: setLinkEdit, handleLink: handleLinkEdit
	} = useUpdateBannerDetails();

	const {
		errorBannerImage, handleUploadBannerImage, loadingBannerImage, removeBannerImageModal, selectedBannerImage, setRemoveBannerImageModal,
		setSelectedBannerImage, setUniqueId: UploadBannerImageUniqueId, successBannerImage, uploadingBannerImagePercentage
	} = useUploadBannerImage();

	const {
		errorDeleteBanner, handleDeleteBanner, loadingDeleteBanner, removeDeleteBannerModal, setUniqueId: DeleteUniqueId,
		setRemoveDeleteBannerModal, successDeleteBanner
	} = useDeleteBanner();

	const handleSelectAddBanner = (e) => {
		const el = e.target.files[0];
		setSelectedAddBanner("");
		setSelectedAddBanner(el);
	};

	const handleSelectBannerImage = (e) => {
		const el = e.target.files[0];
		setSelectedBannerImage("");
		setSelectedBannerImage(el);
	};

	const getFileExtension = (filename) => {
		let lastDot = filename.lastIndexOf('.');
		let ext = filename.substring(lastDot + 1);
		return ext;
	};

	const getFileNameAlone = (filename) => {
		let _filename = filename.split("/");
		return _filename[_filename.length - 1];
	};

	const showPreview = function (file) {
		const preview = file;

		window.open(preview, "_blank");
	};

	const [allBanner, setAllBanner] = useState(null);
	const [errorBanner, setErrorBanner] = useState(null);
	const [loadingAllBanner, setLoadingAllBanner] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllBanners(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllBanners(parseInt(e.target.value), size); };

	async function previousBanner() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllBanners(page - 1, size);
	};

	async function nextBanner() {
		if (page < allBanner.data.pages) setPage(page + 1);
		if (page < allBanner.data.pages) getAllBanners(page + 1, size);
	};

	async function getAllBanners(_page, _size) {
		setAllBanner(null);
		setLoadingAllBanner(true);
		const response = await getBanners(cookie, (_page || page), (_size || size));
		setAllBanner(response.data);
		if (response.error) setErrorBanner(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg);
		setLoadingAllBanner(false);
	};

	useEffect(() => {
		if (allBanner === null) {
			getAllBanners();
		}
	}, [allBanner]);

	const [loadingViewBanner, setLoadingViewBanner] = useState(false)
	const [errorViewBanner, setErrorViewBanner] = useState(null)
	const [viewBanner, setViewBanner] = useState(null)

	async function getABanner(unique_id) {
		setLoadingViewBanner(true)
		const response = await getBanner(cookie, { unique_id });
		if (!response.err) {
			setViewBanner(response.data);
			setNameEdit(response.data.data.name);
			setLinkEdit(response.data.data.link);
		} else { setErrorViewBanner(response.response_code === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message) }
		setLoadingViewBanner(false)
	};

	if (removeAddBannerModal) {
		const modalResponse = document.querySelector("#addBannerModal");
		modalResponse.setAttribute("display", false);
		getAllBanners();
		setRemoveAddBannerModal(null);
	}
	if (removeUpdateBannerDetailsModal) {
		const modalResponse = document.querySelector("#editBannerModal");
		modalResponse.setAttribute("display", false);
		getAllBanners();
		setRemoveUpdateBannerDetailsModal(null);
	}
	if (removeBannerImageModal) {
		const modalResponse = document.querySelector("#editBannerModal");
		modalResponse.setAttribute("display", false);
		getAllBanners();
		setRemoveBannerImageModal(null);
	}
	if (removeDeleteBannerModal) {
		const modalResponse = document.querySelector("#deleteBannerModal");
		modalResponse.setAttribute("display", false);
		getAllBanners();
		setRemoveDeleteBannerModal(null);
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

	const pageSelectArray = new Array(allBanner ? allBanner.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Banners</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all banners</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="addBannerModal">
										<span className="xui-mr-half">Add Banner</span>
										<Plus width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllBanner ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allBanner && allBanner.success && allBanner.data.rows.length !== 0 ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-150'>Name</th>
														<th className='xui-min-w-150'>Link</th>
														<th className='xui-min-w-150'>Image</th>
														<th className='xui-min-w-250'>Created At</th>
														<th className='xui-min-w-250'>Updated At</th>
														<th className='xui-min-w-150'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allBanner.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.name}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.link}</span>
															</td>
															<td className=''>
																{
																	data.image === null ?
																		<span>No image</span> :
																		<div className='xui-d-inline-flex xui-flex-ai-center'>
																			<img className="xui-img-50" src={data.image} alt="Banner Image" />
																			<span title="Copy Image Link" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.image); setTextCopied(data.image); }}>
																				{copiedText && textCopied === data.image ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																			</span>
																			<span title="View File" className="xui-cursor-pointer xui-mx-1" onClick={() => { showPreview(data.image); }}>
																				<EyeOpen width="16" height="16" />
																			</span>
																		</div>
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
																	<button title="Edit Banner" onClick={() => { UploadBannerImageUniqueId(data.unique_id); EditUniqueIdDetails(data.unique_id); getABanner(data.unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="editBannerModal">
																		<Edit width="20" height="20" />
																	</button>
																	<button title="Delete Banner" onClick={() => { DeleteUniqueId(data.unique_id); }} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="deleteBannerModal">
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
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorBanner || "No data found"}</h3>
												</center>
											</div>
										</div>
								)
						}
						{/* {
							loadingAllBanner ?
								<Loading width="12" height="12" /> :
								(
									allBanner && allBanner.success && allBanner.data.rows.length !== 0 ?
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
												</select></span> of {allBanner ? allBanner.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousBanner}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextBanner}>
													<Arrowright width="18" height="18" />
												</div>
											</div>
										</div> :
										""
								)
						} */}
					</section>
				</Content>
			</Screen>
			<section className='xui-modal' xui-modal="deleteBannerModal" id="deleteBannerModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Delete Banner</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorDeleteBanner}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successDeleteBanner}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleDeleteBanner} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingDeleteBanner ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingDeleteBanner ? "" : "deleteBannerModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="addBannerModal" id="addBannerModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="addBannerModal">
						<Close width="24" height="24" />
					</div>
					<h1>Create new Banner</h1>
					<form className="xui-form" layout="2" onSubmit={handleAddBanner}>
						<div className="xui-form-box xui-mt-2">
							<label>Name</label>
							<input className="xui-font-sz-90" type="text" value={name} onChange={handleName} required placeholder="Enter name of banner"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Link</label>
							<input className="xui-font-sz-90" type="url" value={link} onChange={handleLink} required placeholder="Enter link of banner"></input>
						</div>
						<div className="xui-form-box xui-mt-2">
							<label>Image</label>
							<input onChange={handleSelectAddBanner} type={"file"} accept=".png, .jpg, .jpeg, .heic, .webp" id="image" required />
						</div>
						{
							uploadingAddBannerPercentage > 0 ?
								<>
									<label htmlFor="uploader">Uploading</label>
									<progress className="xui-h-30" value={uploadingAddBannerPercentage} id="uploader" max="100">{uploadingAddBannerPercentage + "%"}</progress><br /><br></br>
								</> :
								""
						}
						<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
							<button disabled={loadingAddBanner} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Save Banner</span>
								{
									loadingAddBanner ?
										<Loading width="12" height="12" />
										: <Arrowright width="12" height="12" />
								}
							</button>
						</div>
					</form>

					{loadingAddBanner && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorAddBanner}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successAddBanner}</span></p>
				</div>
			</section>
			<section className='xui-modal' xui-modal="editBannerModal" id="editBannerModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-800 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="editBannerModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewBanner ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewBanner && viewBanner.success ?
									<>
										<h1>Edit Banner</h1>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<div className="xui-form-box xui-mt-2">
													<label>Name</label>
													<input className="xui-font-sz-90" type="text" value={nameEdit} onChange={handleNameEdit} required placeholder="Enter name of banner"></input>
												</div>
												<div className="xui-form-box xui-mt-2">
													<label>Link</label>
													<input className="xui-font-sz-90" type="url" value={linkEdit} onChange={handleLinkEdit} required placeholder="Enter link of banner"></input>
												</div>
												<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
													<button onClick={handleUpdateBannerDetails} disabled={loadingUpdateBannerDetails} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
														<span className="xui-mr-half">Save Changes</span>
														{
															loadingUpdateBannerDetails ?
																<Loading width="12" height="12" />
																: <Check width="12" height="12" />
														}
													</button>
												</div>
												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorUpdateBannerDetails}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successUpdateBannerDetails}</span></p>
											</div>
										</form>
										<form className="xui-form xui-mt-2" layout="2" onSubmit={(e) => e.preventDefault()}>
											<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
												<label>Image</label>
												<div className="xui-d-flex xui-flex-ai-center">
													{
														viewBanner.data.image ?
															getFileExtension(viewBanner.data.image) === "pdf" || getFileExtension(viewBanner.data.image) === "PDF" ?
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span className="xui-font-sz-120 xui-text-center xui-mt-1 xui-mx-auto xui-w-fluid-80" style={{ wordBreak: "break-word" }}>{getFileNameAlone(viewBanner.data.image)}</span>
																	<span title="View File" className="xui-cursor-pointer xui-mr-1" onClick={() => { showPreview(viewBanner.data.image); }}>
																		<EyeOpen width="20" height="20" />
																	</span>
																</div> :
																<img className="xui-img-200" src={viewBanner.data.image} alt="Banner Image" />
															: null
													}
													<input onChange={handleSelectBannerImage} className='xui-my-2' type={"file"} accept=".png, .jpg, .jpeg, .heic, .webp" id="editImage" required />
												</div>
												{
													uploadingBannerImagePercentage > 0 ?
														<>
															<label htmlFor="uploader">Uploading</label>
															<progress className="xui-h-30" value={uploadingBannerImagePercentage} id="uploader" max="100">{uploadingBannerImagePercentage + "%"}</progress><br /><br></br>
														</> :
														""
												}

												{loadingBannerImage && <p className="xui-font-sz-80 xui-my-1 xui-text-blue"><span className="xui-font-w-bold psc-text-blue">Uploading ... Please wait...</span></p>}

												<p className="xui-font-sz-80 xui-my-1 xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorBannerImage}</span></p>
												<p className="xui-font-sz-80 xui-my-1 xui-text-green"><span className="xui-font-w-bold psc-text-red">{successBannerImage}</span></p>
											</div>
											<div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
												<button disabled={loadingBannerImage} onClick={handleUploadBannerImage} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
													<span className="xui-mr-half">Save Changes</span>
													{
														loadingBannerImage ?
															<Loading width="12" height="12" />
															: <Arrowright width="12" height="12" />
													}
												</button>
											</div>
										</form>
									</> :
									<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
										<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
											<center className="xui-text-red">
												<Close width="100" height="100" />
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewBanner}</h3>
											</center>
										</div>
									</div>
							)
					}
				</div>
			</section>
		</>
	);

}
