import withAdmin from '../withAdmin';

const Admin = ({ user }) => <h1>{JSON.stringify(user)}</h1>;

export default withAdmin(Admin);
