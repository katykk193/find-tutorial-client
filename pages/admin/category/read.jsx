import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../config';
import Link from 'next/link';
import withAdmin from '../../withAdmin';

const Read = ({ token }) => {
	const [state, setState] = useState({
		error: '',
		success: '',
		categories: []
	});

	const { categories } = state;

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/categories`);
		setState({ ...state, categories: response.data });
	};

	const confirmDelete = (e, slug) => {
		e.preventDefault();

		let answer = window.confirm('Are you sure you want to delete?');
		if (answer) {
			handleDelete(slug);
		}
	};

	const handleDelete = async (slug) => {
		try {
			const response = await axios.delete(`${API}/category/${slug}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			loadCategories();
		} catch (err) {}
	};

	const listCategories = () =>
		categories.map(({ _id, slug, image, name }) => (
			<div
				key={_id}
				className="bg-white m-4 p-4 flex justify-center items-center shadow-xl"
			>
				<Link href={`/links/${slug}`}>
					<a>
						<div className="w-56 h-48 overflow-hidden flex justify-center">
							<img
								src={image && image.url}
								alt={name}
								className="w-full h-full"
							/>
						</div>
						<div>
							<h3 className="my-4 text-center">{name}</h3>
						</div>
						<div className="flex justify-center">
							<Link href={`/admin/category/${slug}`}>
								<button className="btn-primary mr-4">
									Update
								</button>
							</Link>
							<button
								className="btn-primary"
								onClick={(e) => confirmDelete(e, slug)}
							>
								Delete
							</button>
						</div>
					</a>
				</Link>
			</div>
		));

	return (
		<div className="flex flex-col justify-center items-center py-10 text-gray-600">
			<div>
				<h1 className="mb-4 text-3xl font-semibold">
					List of categories
				</h1>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">{listCategories()}</div>
		</div>
	);
};

export default withAdmin(Read);
