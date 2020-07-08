import axios from 'axios';
import Link from 'next/link';
import { API } from '../config';

const Home = ({ categories }) => {
	console.log(categories);
	const listCategories = () => {
		return categories.map(({ image, name }, index) => {
			return (
				<Link href="/" key={index}>
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
