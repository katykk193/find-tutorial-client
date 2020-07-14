import withAdmin from '../withAdmin';
import Link from 'next/link';

const Admin = ({ user }) => (
	<>
		<h1>Admin Dashboard</h1>
		<div>
			<Link href="/admin/category/create">
				<a>Create category</a>
			</Link>
		</div>
		<div>
			<Link href="/admin/category/read">
				<a>All categories</a>
			</Link>
		</div>
	</>
);

export default withAdmin(Admin);
