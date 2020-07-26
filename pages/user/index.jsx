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
				<div
					key={_id}
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

	return (
		<div>
			<div className="p-10 flex flex-col items-center bg-primary">
				<h1 className="text-center font-semibold text-2xl text-white mb-8">
					{user.name}'s dashboard <span>/ {user.role}</span>
				</h1>

				<div className="flex text-gray-700 flex-col sm:flex-row">
					<Link href="/user/link/create">
						<a className="border border-solid border-white shadow-md transition ease-linear duration-300 transform hover:-translate-y-1 rounded p-5 bg-white bg-opacity-75 mb-4 sm:mb-0 sm:mr-8 cursor-pointer hover:text-red-600">
							Submit a link{' '}
						</a>
					</Link>

					<Link href="/user/profile/update">
						<a className="border border-solid border-white shadow-md transition ease-linear duration-300 transform hover:-translate-y-1 rounded p-5 bg-white bg-opacity-75 cursor-pointer hover:text-red-600">
							Update profile
						</a>
					</Link>
				</div>
			</div>

			<div className="py-10 px-0 md:px-18 lg:px-32 text-gray-600">
				<h1 className="my-4 text-center font-semibold text-3xl my-10 text-red-500">
					Your links
				</h1>
				<div className="mx-5">{listOfLinks()}</div>
			</div>
		</div>
	);
};

export default withUser(User);
