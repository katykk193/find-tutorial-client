import withUser from '../withUser';

const User = ({ user, token }) => <h1>{JSON.stringify(user)}</h1>;

export default withUser(User);
