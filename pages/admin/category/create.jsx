import dynamic from 'next/dynamic';
import { useState } from 'react';
import axios from 'axios';
import { API } from '../../../config';
import Resizer from 'react-image-file-resizer';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

import withAdmin from '../../withAdmin';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const Create = ({ token }) => {
	const [state, setState] = useState({
		name: '',
		success: '',
		error: '',
		buttonText: 'Create',
		image: ''
	});

	const [content, setContent] = useState('');
	const [imagePreview, setImagePreview] = useState();

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
		setContent(e);
		setState({ ...state, success: '', error: '' });
	};

	const handleImage = (event) => {
		if (event.target.files[0]) {
			setImagePreview(URL.createObjectURL(event.target.files[0]));
			Resizer.imageFileResizer(
				event.target.files[0],
				300,
				300,
				'JPEG',
				100,
				0,
				(uri) => {
					setState({
						...state,
						image: uri,
						success: '',
						error: ''
					});
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
			setContent('');
			setImagePreview('');
			setState({
				...state,
				name: '',
				image,
				buttonText: 'Created',
				success: `${response.data.name} is created`
			});
		} catch (err) {
			setState({
				...state,
				buttonText: 'Create',
				error: err.response ? err.response.data.error : err.toString()
			});
		}
	};

	const createCategoryForm = () => (
		<form
			className="bg-white p-10 my-24 mx-5 shadow-xl w-full md:w-1/2 lg:w-1/3"
			onSubmit={handleSubmit}
		>
			<h2 className="mb-4 text-2xl text-red-400 font-semibold">
				Create category
			</h2>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="w-full mt-4">
				<input
					value={name}
					onChange={handleChange('name')}
					type="text"
					placeholder="Name"
					className="shadow border appearance-none border rounded w-full py-2 px-3 text-gray-600 focus:shadow-xl"
					required
				/>
			</div>
			<div className="w-full mt-6 mb-10 text-gray-600 focus:shadow-xl">
				<ReactQuill
					value={content}
					onChange={handleContent}
					placeholder="Content..."
					theme="bubble"
					className="shadow appearance-none border rounded w-full h-24 text-gray-600 mb-3 focus:shadow-xl"
				></ReactQuill>
			</div>
			<div className="w-full mt-4">
				<label className="text-red-500 bg-pink-200 border border-pink-200 hover:border-pink-500 hover:bg-white py-2 px-4 rounded cursor-pointer">
					Upload image
					<input
						onChange={handleImage}
						type="file"
						accept="image/*"
						className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
						hidden
					/>
				</label>
				{imagePreview && (
					<div className="w-24 h-24">
						<img
							className="mt-8 mb-4 w-32"
							src={imagePreview}
							alt="upload image"
						/>
					</div>
				)}
			</div>
			<div className="w-full mt-8 items-start">
				<button className="shadow-xl btn-primary text-white font-bold py-2 px-4 rounded">
					{buttonText}
				</button>
			</div>
		</form>
	);

	return <div className="flex justify-center">{createCategoryForm()}</div>;
};

export default withAdmin(Create);
