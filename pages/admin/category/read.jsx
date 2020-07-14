import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../config';
import Link from 'next/link';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import withAdmin from '../../withAdmin';

const Read = ({ user, token }) => {
	const [state, setState] = useState({
		error: '',
		success: '',
		categories: []
	});

	const { error, success, categories } = state;

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/categories`);
		setState({ ...state, categories: response.data });
	};

	const confirmDelete = (slug) => {
		console.log(slug);
	};

	const listCategories = () =>
		categories.map((category) => (
			<Link key={category._id} href={`/links/${category.slug}`}>
				<a>
					<div>
						<img
							src={category.image && category.image.url}
							alt={category.name}
							className="pr-3"
						/>
					</div>
					<div>
						<h3>{category.name}</h3>
					</div>
					<div>
						<Link href={`/admin/category/${category.slug}`}>
							<button
								className="btn-primary mr-4"
								onClick={() => confirmDelete(category.slug)}
							>
								Update
							</button>
						</Link>
						<button
							className="btn-primary"
							onClick={() => confirmDelete(category.slug)}
						>
							Delete
						</button>
					</div>
				</a>
			</Link>
		));

	return (
		<>
			<div>
				<h1 className="mb-4">List of categories</h1>
			</div>
			<div>{listCategories()}</div>
		</>
	);
};

export default withAdmin(Read);
