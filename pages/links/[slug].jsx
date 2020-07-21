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
				<div key={_id}>
					<div onClick={() => handleClick(_id)}>
						<a href={url} target="_blank">
							<h5>{title}</h5>
							<h6>{url}</h6>
						</a>
					</div>
					<div>
						<span>
							{moment(createdAt).fromNow()} by {postedBy.name}
						</span>
					</div>
					<div>
						<span className="mr-4">
							{type} {medium}
						</span>
						{categories.map(({ _id, name }) => (
							<span key={_id} className="mr-4">
								{name}
							</span>
						))}
						<span className="mr-4">{clicks} clicks</span>
					</div>
				</div>
			)
		);

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
					<div className="round" onClick={() => handleClick(_id)}>
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

							<span className="mr-4">
								{type}/{medium}
							</span>
							{categories.map(({ _id, name }) => (
								<span key={_id} className="mr-4">
									{name}
								</span>
							))}
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
		<>
			<div>
				<div>
					<h1 className="mb-4">{category.name} - URL/Links</h1>
					<div className="mb-4">{renderHTML(category.content)}</div>
				</div>
				<div>
					<img src={category.image.url} alt={category.name} />
				</div>
			</div>

			<InfiniteScroll
				pageStart={0}
				loadMore={loadMore}
				hasMore={size > 0 && size >= limit}
				loader={<img key={0} src="/images/loader.gif" alt="loading" />}
			>
				<div>{listOfLinks()}</div>
				<div>
					<h2>Most popular in {category.name}</h2>
					{listOfPopularLinks()}
				</div>
			</InfiniteScroll>
		</>
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
