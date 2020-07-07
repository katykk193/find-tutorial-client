import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../config';

import withAdmin from '../../withAdmin';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const Create = ({ user, token }) => {
	const [state, setState] = useState({
		name: '',
		content: '',
		success: '',
		error: '',
		formData: process.browser && new FormData(),
		buttonText: 'Create',
		imageUploadText: 'Upload image'
	});

	const {
		name,
		content,
		success,
		error,
		formData,
		buttonText,
		imageUploadText
	} = state;

	const handleChange = (name) => (e) => {
		const value = name === 'image' ? e.target.files[0] : e.target.value;
		const imageName =
			name === 'image' ? e.target.files[0].name : 'Upload image';
		formData.set(name, value);
		setState({
			...state,
			[name]: value,
			error: '',
			success: '',
			imageUploadText: imageName
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: 'Creating' });
		try {
			const response = await axios.post(`${API}/category`, formData, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			setState({
				...state,
				name: '',
				content: '',
				formData: '',
				buttonText: 'Created',
				imageUploadText: 'Upload image',
				success: `${response.data.name} is created`
			});
		} catch (err) {
			setState({
				...state,
				name: '',
				buttonText: 'Create',
				error: err.response.data.error
			});
		}
	};

	const createCategoryForm = () => (
		<form className="w-full max-w-sm" onSubmit={handleSubmit}>
			<h1 className="mt-4 mb-5 sm:mb-20 text-2xl md:text-5xl text-purple-400 font-bold">
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
				<textarea
					value={content}
					onChange={handleChange('content')}
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
					required
				/>
			</div>
			<div className="w-full mt-4">
				<label className="text-gray-600 hover:text-white hover:bg-gray-600 py-2 px-4 rounded cursor-pointer">
					{imageUploadText}
					<input
						onChange={handleChange('image')}
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
