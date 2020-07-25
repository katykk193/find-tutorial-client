import { useState, useEffect } from 'react';
import axios from 'axios';
import withUser from '../../withUser';
import { isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const Update = ({ oldLink, token }) => {
	const [state, setState] = useState({
		title: oldLink.title,
		url: oldLink.url,
		categories: oldLink.categories,
		loadedCategories: [],
		success: '',
		error: '',
		type: oldLink.type,
		medium: oldLink.medium,
		buttonText: 'Update'
	});

	const {
		title,
		url,
		categories,
		loadedCategories,
		success,
		error,
		type,
		medium,
		buttonText
	} = state;

	useEffect(() => {
		loadCategories();
	}, [success]);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/categories`);
		setState({ ...state, loadedCategories: response.data });
	};

	const handleTitleChange = (e) => {
		setState({ ...state, title: e.target.value, error: '', success: '' });
	};
	const handleURLChange = (e) => {
		setState({ ...state, url: e.target.value, error: '', success: '' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		let dynamicUpdateUrl = '';
		if (isAuth && isAuth().role === 'admin') {
			dynamicUpdateUrl = `${API}/link/admin/${oldLink._id}`;
		} else {
			dynamicUpdateUrl = `${API}/link/${oldLink._id}`;
		}
		setState({ ...state, buttonText: 'Updating' });
		try {
			const response = await axios.put(
				dynamicUpdateUrl,
				{
					title,
					url,
					categories,
					type,
					medium
				},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			setState({
				...state,
				success: 'Link is updated',
				buttonText: 'Update'
			});
		} catch (err) {
			setState({
				...state,
				error: err.response ? err.response.data.error : err.toString(),
				buttonText: 'Update'
			});
		}
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

	const handleTypeClick = (e) => {
		setState({ ...state, type: e.target.value, success: '', error: '' });
	};

	const handleMediumClick = (e) => {
		setState({ ...state, medium: e.target.value, success: '', error: '' });
	};

	const showCategories = () => {
		return (
			loadedCategories &&
			loadedCategories.map(({ _id, name }) => (
				<div key={_id}>
					<input
						type="checkbox"
						checked={categories.includes(_id)}
						onChange={handleToggle(_id)}
					/>
					<label>{name}</label>
				</div>
			))
		);
	};

	const showTypes = () => (
		<div className="ml-5">
			<div>
				<label>
					<input
						type="radio"
						onChange={handleTypeClick}
						checked={type === 'free'}
						value="free"
						name="type"
					/>
					Free
				</label>
			</div>
			<div>
				<label>
					<input
						type="radio"
						onChange={handleTypeClick}
						checked={type === 'paid'}
						value="paid"
						name="type"
					/>
					Paid
				</label>
			</div>
		</div>
	);

	const showMedium = () => (
		<div className="ml-5">
			<div>
				<label>
					<input
						type="radio"
						onChange={handleMediumClick}
						checked={medium === 'video'}
						value="video"
						name="medium"
					/>
					Video
				</label>
			</div>
			<div>
				<label>
					<input
						type="radio"
						onChange={handleMediumClick}
						checked={medium === 'book'}
						value="book"
						name="medium"
					/>
					Book
				</label>
			</div>
		</div>
	);

	const submitLinkForm = () => (
		<form className="w-full px-16" onSubmit={handleSubmit}>
			<h1 className="mt-4 mb-5 sm:mb-5 text-2xl md:text-5xl text-purple-400 font-bold">
				Update Link/URL
			</h1>
			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}
			<div>
				<label>Category</label>
				<ul className="h-24 ml-5 overflow-scroll">
					{showCategories()}
				</ul>
			</div>
			<div>
				<label>Type</label>
				{showTypes()}
			</div>
			<div>
				<label>Medium</label>
				{showMedium()}
			</div>
			<div className="w-full mt-4">
				<label className="text-gray-600">Title</label>
				<input
					value={title}
					onChange={handleTitleChange}
					type="text"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
				/>
			</div>
			<div className="w-full mt-4">
				<label className="text-gray-600">URL</label>
				<input
					value={url}
					onChange={handleURLChange}
					type="url"
					className="shadow-xl appearance-none border rounded w-full py-2 px-3 text-gray-700"
				/>
			</div>
			<div className="w-full mt-8 items-start">
				<button
					disabled={!token}
					className="shadow-xl bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded"
				>
					{isAuth() || token ? buttonText : 'Login to update'}
				</button>
			</div>
		</form>
	);

	return <>{submitLinkForm()}</>;
};

Update.getInitialProps = async ({ req, query, token }) => {
	const response = await axios.get(`${API}/link/${query.id}`);
	return { oldLink: response.data, token };
};

export default withUser(Update);
