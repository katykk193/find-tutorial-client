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
			({
				_id,
				url,
				title,
				createdAt,
				postedBy,
				type,
				medium,
				categories,
				clicks
			}) => (
				<div key={_id} className="bg-primary mb-4 rounded">
					<div className="round" onClick={(e) => handleClick(_id)}>
						<a href={url} target="_blank">
							<h5 className="mb-2">{title}</h5>
							<h6 className="mb-2">{url}</h6>
						</a>
					</div>
					<div>
						<div className="mb-2">
							<span className="mr-4">
								{moment(createdAt).fromNow()} by {postedBy.name}
							</span>

							<span className="mr-4">{clicks} clicks</span>
						</div>

						<div>
							<span className="mr-4">
								{type}/{medium}
							</span>
							{categories.map(({ _id, name }) => (
								<span key={_id} className="mr-4">
									{name}
								</span>
							))}

							<span
								className="mr-4"
								onClick={(e) => confirmDelete(e, _id)}
							>
								Delete
							</span>
							<Link href={`/user/link/${_id}`}>
								<a className="mr-4">Update</a>
							</Link>
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
		<>
			<div>
				<div>
					<h1 className="mb-4">All Links</h1>
				</div>
			</div>

			<InfiniteScroll
				pageStart={0}
				loadMore={loadMore}
				hasMore={size > 0 && size >= limit}
				loader={<img key={0} src="/images/loader.gif" alt="loading" />}
			>
				<div>{listOfLinks()}</div>
			</InfiniteScroll>
		</>
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
