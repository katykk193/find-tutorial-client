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
		const response = await axios.put(`${API}/click-count`, {linkId});
		loadPopular()
	};

	const listOfLinks = () =>
		popular.map(
			({
				_id,
				url,
				title,
				type,
				medium,
				clicks,
				createdAt,
				postedBy
			}) => (
				<div key={_id}>
					<div onClick={(e) => handleClick(_id)}>
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
							<span className="mr-4" key={_id}>
								{name}
							</span>
						))}
						<span className="mr-4">{clicks} clicks</span>
					</div>
				</div>
			)
		);

	const listCategories = () => {
		return categories.map(({ _id, slug, image, name }) => {
			return (
				<Link href={`/links/${slug}`} key={_id}>
					<a>
						<div>
							<img src={image && image.url} alt={name} />
						</div>
						<div>{name}</div>
					</a>
				</Link>
			);
		});
	};

	return (
		<>
			<div>
				<div>
					<h1>Browse Tutorials/Courses</h1>
				</div>
			</div>

			<div>{listCategories()}</div>
			<div>
				<h2>Trending</h2>
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
