import withAdmin from '../withAdmin';
import Link from 'next/link';

const Admin = ({ user }) => (
	<>
		<h1>Admin Dashboard</h1>
		<div>
			<a href="/admin/category/create">Create category</a>
		</div>
		<div>
			<Link href="/admin/category/read">
				<a>All categories</a>
			</Link>
		</div>
		<div>
			<Link href="/admin/link/read">
				<a>All links</a>
			</Link>
		</div>
	</>
);

export default withAdmin(Admin);
