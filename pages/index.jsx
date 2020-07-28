import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API } from '../config';
import moment from 'moment';

const Home = ({ categories }) => {
	const [popular, setPopular] = useState([]);
	useEffect(() => {
		loadPopular();
	}, []);

	const loadPopular = async () => {
		const response = await axios.get(`${API}/links/popular`);
		setPopular(response.data);
	};

	const handleClick = async (linkId) => {
		const response = await axios.put(`${API}/click-count`, { linkId });
		loadPopular();
	};

	const listCategories = () => {
		return categories.map(({ _id, slug, image, name }) => {
			return (
				<div
					key={_id}
					className="border border-solid border-white shadow-md transition ease-linear duration-300 transform hover:-translate-y-1 rounded p-5 bg-white bg-opacity-75"
				>
					<Link href={`/links/${slug}`}>
						<a className="flex items-center">
							<div className="w-16 h-16 mr-6 flex items-center justify-center">
								<img
									src={image && image.url}
									alt={name}
									className="w-full h-full"
								/>
							</div>
							<div className="text-lg">{name}</div>
						</a>
					</Link>
				</div>
			);
		});
	};

	const listOfLinks = () =>
		popular.map(
			({
				_id,
				url,
				title,
				type,
				medium,
				categories,
				clicks,
				createdAt,
				postedBy
			}) => (
				<div
					key={_id}
					className="bg-white m-10 px-6 py-8 md:p-8 shadow-lg flex flex-col sm:flex-row sm:justify-between rounded"
				>
					<div>
						<div onClick={(e) => handleClick(_id)}>
							<a href={url} target="_blank">
								<h5 className="md:max-w-md mb-2 font-semibold hover:text-red-400 text-lg">
									{title}
								</h5>
								<h6 className="mb-5 hover:text-red-400 text-sm">
									{url.length > 30
										? `${url.substring(0, 30)}...`
										: url}
								</h6>
							</a>
						</div>
						<div>
							<span className="mr-4 text-sm rounded py-1 px-2 text-red-400 bg-pink-100">
								{type}
							</span>
							<span className="mr-4 text-sm rounded py-1 px-2 text-red-400 bg-pink-100">
								{medium}
							</span>
							{categories.map(({ _id, name }) => (
								<span
									key={_id}
									className="text-sm rounded py-1 px-2 text-blue-400 bg-blue-100 mr-4"
								>
									{name}
								</span>
							))}
						</div>
					</div>
					<div className="flex flex-col justify-between mt-6 sm:mt-0">
						<div className="text-sm">
							{moment(createdAt).fromNow()} by {postedBy.name}
						</div>
						<div className="flex justify-end">
							<div className="flex items-center text-sm mt-4 sm:mt-0 bg-pink-100 shadow-xl pr-2">
								<div className="bg-primary px-2 py-1 mr-1 rounded text-white">
									{clicks}
								</div>
								<div className="text-red-400">clicks</div>
							</div>
						</div>
					</div>
				</div>
			)
		);

	return (
		<>
			<div className="bg-primary px-0 md:px-16 pt-8 sm:pt-12 pb-2">
				<div>
					<h1 className="text-center font-semibold text-2xl text-white mb-8">
						Browse Tutorials/Courses
					</h1>
				</div>
				<div className="mx-6 md:mx-16 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 text-gray-700">
					{listCategories()}
				</div>
			</div>

			<div className="py-10 px-0 md:px-18 lg:px-32 text-gray-600">
				<h2 className="text-center font-semibold text-2xl">Trending</h2>
				<div>{listOfLinks()}</div>
			</div>
		</>
	);
};

Home.getInitialProps = async () => {
	const response = await axios.get(`${API}/categories`);
	return {
		categories: response.data
	};
};

export default Home;
