import { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie, isAuth } from '../../../helpers/auth';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';

const Create = ({ token }) => {
	const [state, setState] = useState({
		title: '',
		url: '',
		categories: [],
		loadedCategories: [],
		success: '',
		error: '',
		type: '',
		medium: '',
		buttonText: 'Post'
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
		setState({ ...state, buttonText: 'Posting' });
		try {
			const response = await axios.post(
				`${API}/link`,
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
				title: '',
				url: '',
				success: 'Link is created',
				error: '',
				loadedCategories: [],
				categories: [],
				type: '',
				medium: '',
				buttonText: 'Post'
			});
		} catch (err) {
			setState({
				...state,
				error: err.response ? err.response.data.error : err.onString(),
				buttonText: 'Post'
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
					<input type="checkbox" onChange={handleToggle(_id)} />
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
						onClick={handleTypeClick}
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
						onClick={handleTypeClick}
						checked={type === 'paid'}
						value="paid"
						name="type"
					/>
					paid
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
						onClick={handleMediumClick}
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
						onClick={handleMediumClick}
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
				Submit Link/URL
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
					{isAuth() || token ? buttonText : 'Login to post'}
				</button>
			</div>
		</form>
	);

	return <>{submitLinkForm()}</>;
};

Create.getInitialProps = ({ req }) => {
	const token = getCookie('token', req);
	return {
		token
	};
};

export default Create;
