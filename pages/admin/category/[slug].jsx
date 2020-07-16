import dynamic from 'next/dynamic';
import { useState } from 'react';
import axios from 'axios';
import { API } from '../../../config';
import Resizer from 'react-image-file-resizer';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import withAdmin from '../../withAdmin';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const Update = ({ oldCategory, token }) => {
	const [state, setState] = useState({
		name: oldCategory.name,
		success: '',
		error: '',
		buttonText: 'Update',
		imagePreview: oldCategory.image.url,
		image: ''
	});

	const [content, setContent] = useState(oldCategory.content);

	const [imageUploadButtonName, setImageUploadButtonName] = useState(
		'Update image'
	);

	const { name, image, success, error, buttonText, imagePreview } = state;

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: '',
			success: ''
		});
	};

	const handleContent = (e) => {
		setContent(e);
		setState({ ...state, success: '', error: '' });
	};

	const handleImage = (event) => {
		let fileInput = false;
		if (event.target.files[0]) {
			fileInput = true;
		}
		setImageUploadButtonName(event.target.files[0].name);
		if (fileInput) {
			Resizer.imageFileResizer(
				event.target.files[0],
				300,
				300,
				'JPEG',
				100,
				0,
				(uri) => {
					setState({ ...state, image: uri, success: '', error: '' });
				},
				'base64'
			);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: 'Updating' });
		try {
			const response = await axios.put(
				`${API}/category/${oldCategory.slug}`,
				{ name, content, image },
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			setImageUploadButtonName('Update image');
			setContent('');
			setState({
				...state,
				name: '',
				image,
				buttonText: 'Updated',
				imagePreview: '',
				success: `${response.data.name} is updated`
			});
		} catch (err) {
			setState({
				...state,
				buttonText: 'Update',
				error: err.response ? err.response.data.error : err.toString()
			});
		}
	};

	const updateCategoryForm = () => (
		<form className="w-full px-16" onSubmit={handleSubmit}>
			<h1 className="mt-4 mb-5 sm:mb-5 text-2xl md:text-5xl text-purple-400 font-bold">
				Update category
			</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="w-full mt-4">
				<label className="text-gray-600">Name</label>
				<input
					value={name}
					onChange={handleChange('name')}
					type="text"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
					required
				/>
			</div>
			<div className="w-full mt-4">
				<label className="text-gray-600">Content</label>
				<ReactQuill
					value={content}
					onChange={handleContent}
					placeholder="Write something..."
					theme="bubble"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700 h-24"
				></ReactQuill>
			</div>
			<div className="w-full mt-4">
				<label className="text-gray-600 hover:text-white hover:bg-gray-600 py-2 px-4 rounded cursor-pointer">
					{imageUploadButtonName}
					{imagePreview && (
						<span>
							<img src={imagePreview} alt="image" height="20" />
						</span>
					)}
					<input
						onChange={handleImage}
						type="file"
						accept="image/*"
						className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
						hidden
					/>
				</label>
			</div>
			<div className="w-full mt-8 items-start">
				<button className="shadow-xl bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded">
					{buttonText}
				</button>
			</div>
		</form>
	);

	return <>{updateCategoryForm()}</>;
};

Update.getInitialProps = async ({ req, query, token }) => {
	const response = await axios.get(`${API}/category/${query.slug}`);
	return { oldCategory: response.data.category, token };
};

export default withAdmin(Update);
