import axios from 'axios';
import Link from 'next/link';
import { API } from '../config';

const Home = ({ categories }) => {
	const listCategories = () => {
		return categories.map(({ _id, slug, image, name }, index) => {
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

	return <div>{listCategories()}</div>;
};

Home.getInitialProps = async () => {
	const response = await axios.get(`${API}/categories`);
	return {
		categories: response.data
	};
};

export default Home;
