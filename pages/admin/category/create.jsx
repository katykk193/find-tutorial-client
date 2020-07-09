import dynamic from 'next/dynamic';
import { useState } from 'react';
import axios from 'axios';
import { API } from '../../../config';
import Resizer from 'react-image-file-resizer';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import withAdmin from '../../withAdmin';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const Create = ({ user, token }) => {
	const [state, setState] = useState({
		name: '',
		success: '',
		error: '',
		buttonText: 'Create',
		image: ''
	});

	const [content, setContent] = useState('');

	const [imageUploadButtonName, setImageUploadButtonName] = useState(
		'Upload image'
	);

	const { name, image, success, error, buttonText } = state;

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: '',
			success: ''
		});
	};

	const handleContent = (e) => {
		console.log(e);
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
		setState({ ...state, buttonText: 'Creating' });
		try {
			const response = await axios.post(
				`${API}/category`,
				{ name, content, image },
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			setimageUploadButtonName('Upload image');
			setState({
				...state,
				name: '',
				content: '',
				image,
				buttonText: 'Created',
				success: `${response.data.name} is created`
			});
		} catch (err) {
			setState({
				...state,
				buttonText: 'Create',
				error: err.response.data.error
			});
		}
	};

	const createCategoryForm = () => (
		<form className="w-full px-16" onSubmit={handleSubmit}>
			<h1 className="mt-4 mb-5 sm:mb-5 text-2xl md:text-5xl text-purple-400 font-bold">
				Create category
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

	return <>{createCategoryForm()}</>;
};

export default withAdmin(Create);
