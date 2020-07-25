import { useState, useEffect } from 'react';
import axios from 'axios';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { API } from '../../config';
import InfiniteScroll from 'react-infinite-scroller';

const Links = ({
	query,
	category,
	links,
	totalLinks,
	linksLimit,
	linkSkip
}) => {
	const [allLinks, setAllLinks] = useState(links);
	const [limit, setLimit] = useState(linksLimit);
	const [skip, setSkip] = useState(0);
	const [size, setSize] = useState(totalLinks);
	const [popular, setPopular] = useState([]);

	useEffect(() => {
		loadPopular();
	}, []);

	const loadPopular = async () => {
		const response = await axios.get(
			`${API}/links/popular/${category.slug}`
		);
		setPopular(response.data);
	};

	const handleClick = async (linkId) => {
		const response = await axios.put(`${API}/click-count`, { linkId });
		loadPopular();
	};

	const loadUpdatedLinks = async () => {
		const response = await axios.post(`${API}/category/${query.slug}`);
		setAllLinks(response.data.links);
	};

	const listOfPopularLinks = () =>
		popular.map(
			(
				{
					_id,
					url,
					title,
					type,
					medium,
					categories,
					clicks,
					createdAt,
					postedBy
				},
				index
			) => (
				<div
					key={index}
					className="bg-pink-100 p-4 my-4 rounded text-sm"
				>
					<div
						onClick={() => handleClick(_id)}
						className="hover:text-red-500 mb-4"
					>
						<a href={url} target="_blank">
							<h5 className="font-semibold mb-2">{title}</h5>
						</a>
					</div>
					<div className="text-xs mb-4">
						{moment(createdAt).fromNow()} by {postedBy.name}
					</div>

					<div className="flex mb-6">
						<div className="mr-4 text-sm rounded py-1 px-2 text-red-500 bg-white shadow">
							{type}
						</div>
						<div className="mr-4 text-sm rounded py-1 px-2 text-red-500 bg-white shadow">
							{medium}
						</div>
					</div>
					<div className="mb-6">
						{categories.map(({ name }, index) => (
							<span
								key={index}
								className="text-sm rounded py-1 px-2 text-blue-500 bg-white mr-4 shadow"
							>
								{name}
							</span>
						))}
					</div>

					<div className="flex">
						<div className="flex items-center justify-start bg-white shadow-xl rounded">
							<div className="bg-primary px-2 py-1 rounded text-white">
								{clicks}
							</div>
							<div className="w-auto px-2 text-red-400">
								clicks
							</div>
						</div>
					</div>
				</div>
			)
		);

	const listOfLinks = () =>
		allLinks.map(
			(
				{
					_id,
					url,
					title,
					createdAt,
					postedBy,
					type,
					medium,
					categories,
					clicks
				},
				index
			) => (
				<div
					key={index}
					className="bg-white mb-5 p-8 rounded shadow-xl flex justify-between items-center"
				>
					<div>
						<div className="round" onClick={() => handleClick(_id)}>
							<a href={url} target="_blank">
								<h5 className="mb-2 font-semibold hover:text-red-500">
									{title}
								</h5>
								<h6 className="mb-2 hover:text-red-500 hidden md:block">
									{url.length > 50
										? `${url.substring(0, 50)}...`
										: url}
								</h6>
							</a>
						</div>
						<div>
							<div className="mb-2">
								<span className="mr-4 text-xs">
									{moment(createdAt).fromNow()} by{' '}
									{postedBy.name}
								</span>

								<div className="flex mt-4">
									<div className="mr-4 text-sm rounded py-1 px-2 text-red-400 bg-pink-100 shadow">
										{type}
									</div>
									<div className="text-sm rounded py-1 px-2 text-red-400 bg-pink-100 mr-4 shadow">
										{medium}
									</div>
									{categories.map(({ _id, name }) => (
										<span
											key={_id}
											className="text-sm rounded py-1 px-2 text-blue-400 bg-blue-100 mr-4 shadow"
										>
											{name}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-end mr-2">
						<div className="flex flex-col justify-between items-center text-sm sm:mt-0 bg-pink-100 shadow-xl">
							<div className="bg-primary p-1 md:py-2 md:px-3 rounded text-white w-full text-center mb-1">
								{clicks}
							</div>
							<div className="px-1 py-1 md:px-3 text-red-400">
								clicks
							</div>
						</div>
					</div>
				</div>
			)
		);

	const loadMore = async () => {
		let toSkip = skip + limit;
		const response = await axios.get(
			`${API}/category/${query.slug}?skip=${toSkip}&limit=${limit}`
		);
		setAllLinks([...allLinks, ...response.data.links]);
		setSize(response.data.links.length);
		setSkip(toSkip);
	};

	return (
		<div className="flex flex-col justify-center md:px-10 mx-5">
			<h1 className="mb-4 text-center font-semibold text-3xl my-10 text-red-500">
				{category.name} - URL/Links
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 text-gray-600">
				<div className="mr-1 md:col-span-1">
					<div className="bg-white p-5 flex flex-col justify-center items-center rounded shadow-xl my-5">
						<div className="w-48">
							<img src={category.image.url} alt={category.name} />
						</div>
						<div className="mb-4 my-5">
							{renderHTML(category.content)}
						</div>
					</div>
					<div className="bg-white p-5 rounded shadow-xl">
						<h2 className="text-red-500 font-semibold mb-5">
							Most popular in {category.name}
						</h2>
						{listOfPopularLinks()}
					</div>
				</div>
				<div className="md:col-span-2 my-5">
					<InfiniteScroll
						pageStart={0}
						loadMore={loadMore}
						hasMore={size > 0 && size >= limit}
						loader={<div key={0} className="loader my-5 mx-auto" />}
					>
						<div>{listOfLinks()}</div>
					</InfiniteScroll>
				</div>
			</div>
		</div>
	);
};

Links.getInitialProps = async ({ query, req }) => {
	let skip = 0;
	let limit = 2;

	const response = await axios.get(
		`${API}/category/${query.slug}?skip=${skip}&limit=${limit}`
	);

	return {
		query,
		category: response.data.category,
		links: response.data.links,
		totalLinks: response.data.links.length,
		linksLimit: limit,
		linkSkip: skip
	};
};

export default Links;
