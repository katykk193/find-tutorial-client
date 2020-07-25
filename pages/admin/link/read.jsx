import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import moment from 'moment';
import { API } from '../../../config';
import InfiniteScroll from 'react-infinite-scroller';
import withAdmin from '../../withAdmin';
import { getCookie } from '../../../helpers/auth';

const Links = ({ links, totalLinks, linksLimit, linkSkip, token }) => {
	const [allLinks, setAllLinks] = useState(links);
	const [limit, setLimit] = useState(linksLimit);
	const [skip, setSkip] = useState(0);
	const [size, setSize] = useState(totalLinks);

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
					className="bg-white mb-5 px-10 py-12 rounded shadow-xl grid grid-cols-1 gap-5 sm:grid-cols-5 md:grid-cols-7 items-center"
				>
					<div className="col-span-1 flex items-center justify-center">
						<div className="flex flex-col justify-between items-center text-sm sm:mt-0 bg-pink-100 shadow-xl">
							<div className="bg-primary p-1 md:py-2 md:px-3 rounded text-white w-full text-center mb-1">
								{clicks}
							</div>
							<div className="px-1 py-1 md:px-3 text-red-400">
								clicks
							</div>
						</div>
					</div>
					<div className="col-span-1 sm:col-span-3 md:col-span-5 px-2 sm:px-6">
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

						<div className="mr-4 text-xs mb-2">
							{moment(createdAt).fromNow()} by {postedBy.name}
						</div>

						<div className="flex my-4">
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
					<div className="col-span-1 flex sm:flex-col justify-center items-center">
						<Link href={`/user/link/${_id}`}>
							<a className="bg-green-200 text-center py-2 rounded mr-4 w-24 sm:mb-8 sm:mr-0 shadow-md transition duration-200 ease-linear transform hover:-translate-y-1">
								Update
							</a>
						</Link>
						<div
							className="bg-red-200 text-center py-2 rounded shadow-md w-24 cursor-pointer transition duration-200 ease-linear transform hover:-translate-y-1"
							onClick={(e) => confirmDelete(e, _id)}
						>
							Delete
						</div>
					</div>
				</div>
			)
		);

	const loadMore = async () => {
		let toSkip = skip + limit;
		const response = await axios.get(
			`${API}/links?skip=${toSkip}&limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);
		setAllLinks([...allLinks, ...response.data]);
		setSize(response.data.length);
		setSkip(toSkip);
	};

	const confirmDelete = (e, id) => {
		e.preventDefault();

		let answer = window.confirm('Are you sure you want to delete?');
		if (answer) {
			handleDelete(id);
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await axios.delete(`${API}/link/admin/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			process.browser && window.location.reload();
		} catch (err) {}
	};

	return (
		<div className="mt-24">
			<h1 className="my-4 text-center font-semibold text-3xl my-10 text-red-500">
				All Links
			</h1>
			<div className="mx-5 md:mx-8 lg:mx-32 text-gray-600">
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
	);
};

Links.getInitialProps = async ({ req }) => {
	let skip = 0;
	let limit = 2;

	const token = getCookie('token', req);

	const response = await axios.get(
		`${API}/links?skip=${skip}&limit=${limit}`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);

	return {
		links: response.data,
		totalLinks: response.data.length,
		linksLimit: limit,
		linkSkip: skip,
		token
	};
};

export default withAdmin(Links);
