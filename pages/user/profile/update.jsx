import { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { updateUser } from '../../../helpers/auth';
import { API } from '../../../config';
import withUser from '../../withUser';

const Profile = ({ user, token }) => {
	const [state, setState] = useState({
		name: user.name,
		email: user.email,
		password: '',
		error: '',
		success: '',
		buttonText: 'Update',
		loadedCategories: [],
		categories: user.categories
	});

	const {
		name,
		email,
		password,
		error,
		success,
		buttonText,
		loadedCategories,
		categories
	} = state;

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/categories`);
		setState({ ...state, loadedCategories: response.data });
	};

	const handleToggle = (category) => () => {
		const clickedCategory = categories.indexOf(category);
		const all = [...categories];

		if (clickedCategory === -1) {
			all.push(category);
		} else {
			all.splice(clickedCategory, 1);
		}

		setState({ ...state, categories: all, success: '', error: '' });
	};

	const showCategories = () => {
		return (
			loadedCategories &&
			loadedCategories.map(({ _id, name }) => (
				<div key={_id}>
					<input
						type="checkbox"
						onChange={handleToggle(_id)}
						checked={categories.includes(_id)}
					/>
					<label>{name}</label>
				</div>
			))
		);
	};

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: '',
			success: '',
			buttonText: 'Update'
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setState({ ...state, buttonText: 'Updating' });

		try {
			const response = await axios.put(
				`${API}/user`,
				{
					name,
					password,
					categories
				},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);

			updateUser(response.data, () => {
				setState({
					...state,
					buttonText: 'Updated',
					success: 'Profile updated successfully'
				});
			});
		} catch (err) {
			setState({
				...state,
				buttonText: 'Update',
				error: err.response ? err.response.data.error : err.toString()
			});
		}
	};

	const updateForm = () => (
		<form className="w-full max-w-sm" onSubmit={handleSubmit}>
			<h1 className="mt-4 mb-5 sm:mb-20 text-2xl sm:text-5xl text-purple-400 font-bold">
				Update Profile
			</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="w-full mt-2">
				<input
					value={name}
					onChange={handleChange('name')}
					type="text"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
					placeholder="Type your name"
					required
				/>
			</div>
			<div className="w-full mt-4">
				<input
					value={email}
					onChange={handleChange('email')}
					type="email"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
					placeholder="Type your email"
					required
					disabled
				/>
			</div>
			<div className="w-full mt-4">
				<input
					value={password}
					onChange={handleChange('password')}
					type="password"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
					placeholder="Type your password"
				/>
			</div>
			<div className="w-full mt-4">
				<label>Category</label>
				<ul className="h-24 ml-5 overflow-scroll">
					{showCategories()}
				</ul>
			</div>
			<div className="w-full mt-8 items-start">
				<button className="shadow-xl bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded">
					{buttonText}
				</button>
			</div>
		</form>
	);
	return <>{updateForm()}</>;
};

export default withUser(Profile);
