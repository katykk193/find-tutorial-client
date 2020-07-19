import Link from 'next/link';
import axios from 'axios';
import withUser from '../withUser';
import { API } from '../../config';
import moment from 'moment';

const User = ({ user, userLinks, token }) => {
	const confirmDelete = (e, id) => {
		e.preventDefault();

		let answer = window.confirm('Are you sure you want to delete?');
		if (answer) {
			handleDelete(id);
		}
	};

	const handleDelete = async (id) => {
		try {
			const response = await axios.delete(`${API}/link/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			Rounter.replace('/user');
		} catch (err) {}
	};

	const listOfLinks = () =>
		userLinks.map(
			({
				_id,
				title,
				url,
				type,
				medium,
				categories,
				clicks,
				createdAt,
				postedBy
			}) => (
				<div key={_id}>
					<div>
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
							{type}/{medium}
						</span>
						
						{categories.map(({ _id, name }) => (
							<span key={_id} className="mr-4">{name}</span>
						))}

						<span className="mr-4">{clicks} clicks</span>

						<Link href={`/user/link/${_id}`}>
							<span className="mr-4">Update</span>
						</Link>

						<span
							onClick={(e) => confirmDelete(e, _id)}
							className="mr-4"
						>
							Delete
						</span>
					</div>
				</div>
			)
		);

	return (
		<>
			<h1>
				{user.name}'s dashboard <span>/{user.role}</span>
			</h1>
			<div>
				<ul>
					<li>
						<Link href="/user/link/create">
							<a href="">Submit a link </a>
						</Link>
					</li>
					<li>
						<Link href="/user/profile/update">
							<a href="">Update profile</a>
						</Link>
					</li>
				</ul>
			</div>
			<div>
				<div>
					<h2>Your links</h2>
					{listOfLinks()}
				</div>
			</div>
		</>
	);
};

export default withUser(User);
