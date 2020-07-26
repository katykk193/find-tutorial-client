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
						className="mr-2"
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
		<form
			className="bg-white p-6 sm:p-10 my-6 sm:my-24 mx-5 shadow-xl w-full md:w-2/3 xl:w-1/3"
			onSubmit={handleSubmit}
		>
			<h1 className="mb-2 sm:mb-8 text-2xl text-red-400 font-semibold">
				Update Profile
			</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div className="mt-2 text-gray-600 text-sm">
				<div className="w-full sm:mt-4">
					<label className="font-semibold">Name</label>
					<input
						value={name}
						onChange={handleChange('name')}
						type="text"
						className="shadow border appearance-none border rounded w-full py-2 px-3  focus:shadow-xl"
						placeholder="Type your name"
						required
					/>
				</div>
				<div className="w-full mt-4">
					<label className="font-semibold">Email</label>
					<input
						value={email}
						onChange={handleChange('email')}
						type="email"
						className="shadow border appearance-none border rounded w-full py-2 px-3 focus:shadow-xl"
						placeholder="Type your email"
						required
						disabled
					/>
				</div>
				<div className="w-full mt-4">
					<label className="font-semibold">Password</label>
					<input
						value={password}
						onChange={handleChange('password')}
						type="password"
						className="shadow border appearance-none border rounded w-full py-2 px-3 focus:shadow-xl"
						placeholder="Type your password"
					/>
				</div>
				<div className="w-full mt-4">
					<label className="font-semibold">Category</label>
					<ul className="h-24 ml-5 overflow-scroll flex flex-col flex-wrap">
						{showCategories()}
					</ul>
				</div>
			</div>

			<div className="w-full mt-8 items-start">
				<button className="shadow-xl btn-primary text-white font-bold py-2 px-4 rounded">
					{buttonText}
				</button>
			</div>
		</form>
	);
	return <div className="flex justify-center">{updateForm()}</div>;
};

export default withUser(Profile);
