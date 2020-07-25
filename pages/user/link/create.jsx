import { useState, useEffect } from 'react';
import Link from 'next/link';
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

	const [auth, setAuth] = useState(false);

	useEffect(() => {
		loadCategories();
		isAuth() ? setAuth(true) : setAuth(false);
	}, []);

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
				error: err.response ? err.response.data.error : err.toString(),
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
					<input
						className="mr-2"
						type="checkbox"
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
						className="mr-2"
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
						className="mr-2"
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
						className="mr-2"
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
						className="mr-2"
					/>
					Book
				</label>
			</div>
		</div>
	);

	const submitLinkForm = () => (
		<form
			className="bg-white p-6 sm:p-10 my-6 sm:my-24 mx-5 shadow-xl w-full md:w-1/2 lg:w-1/3"
			onSubmit={handleSubmit}
		>
			<h2 className="mb-4 text-xl sm:text-2xl text-red-400 font-semibold">
				Submit Link/URL
			</h2>

			{success && showSuccessMessage(success)}
			{error && showErrorMessage(error)}

			<div className="text-gray-600 relative">
				{auth ? null : (
					<div className="absolute inset-0 bg-black bg-opacity-50 rounded"></div>
				)}
				<div className="my-4">
					<label className="font-semibold">Category</label>
					<ul className="h-24 ml-5 overflow-scroll">
						{showCategories()}
					</ul>
				</div>
				<div className="flex">
					<div className="w-1/2">
						<label className="font-semibold">Type</label>
						{showTypes()}
					</div>
					<div>
						<label className="font-semibold">Medium</label>
						{showMedium()}
					</div>
				</div>
				<div className="w-full mt-4">
					<label className="font-semibold">Title</label>
					<input
						value={title}
						onChange={handleTitleChange}
						type="text"
						className="shadow border appearance-none border rounded w-full py-2 px-3 focus:shadow-xl"
					/>
				</div>
				<div className="w-full mt-4">
					<label className="font-semibold">URL</label>
					<input
						value={url}
						onChange={handleURLChange}
						type="url"
						className="shadow border appearance-none border rounded w-full py-2 px-3 focus:shadow-xl"
					/>
				</div>
			</div>

			<div className="w-full mt-8 items-start">
				{isAuth() ? (
					<button className="shadow-xl btn-primary text-white font-bold py-2 px-4 rounded">
						{buttonText}
					</button>
				) : (
					<Link href="/login">
						<a className="shadow-xl btn-primary text-white font-bold py-2 px-4 rounded">
							Login to post
						</a>
					</Link>
				)}
			</div>
		</form>
	);

	return <div className="flex justify-center">{submitLinkForm()}</div>;
};

Create.getInitialProps = ({ req }) => {
	const token = getCookie('token', req);
	return {
		token
	};
};

export default Create;
