import withAdmin from '../withAdmin';
import Link from 'next/link';

const Admin = ({ user }) => (
	<div className="p-10 flex flex-col items-center bg-primary h-screen">
		<h1 className="text-white font-semibold text-2xl sm:text-3xl pb-10 sm:my-10">
			Admin Dashboard
		</h1>
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-16 sm:text-xl">
			<div className="bg-white bg-opacity-50 px-10 py-5 rounded shadow-md text-red-500 cursor-pointer transition ease-linear duration-300 transform hover:-translate-y-1">
				<a href="/admin/category/create">Create category</a>
			</div>
			<div className="bg-white bg-opacity-50 px-10 py-5 rounded shadow-md text-red-500 cursor-pointer transition ease-linear duration-300 transform hover:-translate-y-1">
				<Link href="/admin/category/read">
					<a>All categories</a>
				</Link>
			</div>
			<div className="bg-white bg-opacity-50 px-10 py-5 rounded shadow-md text-red-500 cursor-pointer transition ease-linear duration-300 transform hover:-translate-y-1">
				<Link href="/admin/link/read">
					<a>All links</a>
				</Link>
			</div>
			<div className="bg-white bg-opacity-50 px-10 py-5 rounded shadow-md text-red-500 cursor-pointer transition ease-linear duration-300 transform hover:-translate-y-1">
				<Link href="/user/profile/update">
					<a>Profile update</a>
				</Link>
			</div>
		</div>
	</div>
);

export default withAdmin(Admin);
