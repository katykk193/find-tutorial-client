import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import NProgress from 'nprogress';
import { isAuth, logout } from '../helpers/auth';
import 'nprogress/nprogress.css';
import 'tailwindcss/tailwind.css';
import 'react-quill/dist/quill.bubble.css';

Router.events.on('routeChangeStart', (url) => {
	NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({ Component, pageProps }) {
	return (
		<>
			<Head>
				<link rel="stylesheet" type="text/css" href="/styles.css" />
				<link
					href="http://fonts.googleapis.com/css?family=Montserrat:400,700"
					rel="stylesheet"
					type="text/css"
				/>
			</Head>
			<nav className="flex justify-between items-center bg-white py-5 px-4 md:px-16 fixed top-0 left-0 w-screen h-16 shadow-md z-50">
				<Link href="/">
					<a className="text-xl sm:text-3xl text-red-500 font-bold">
						Hacker
					</a>
				</Link>
				<div className="flex items-center text-xs sm:text-lg">
					<Link href="/">
						<a className="text-gray-600 hover:text-red-500 mr-3 md:mr-8">
							Home
						</a>
					</Link>

					<Link href="/user/link/create">
						<a className="text-gray-600 hover:text-red-500 mr-3 md:mr-8">
							Submit a link
						</a>
					</Link>

					{!isAuth() && (
						<>
							<Link href="/login">
								<a className="text-gray-600 hover:text-red-500 mr-3 md:mr-8">
									Login
								</a>
							</Link>
							<Link href="/register">
								<a className="text-gray-600 hover:text-red-500 mr-3 md:mr-8">
									Register
								</a>
							</Link>
						</>
					)}
					{isAuth() && isAuth().role === 'admin' && (
						<Link href="/admin">
							<a className="text-gray-600 hover:text-red-500 mr-3 md:mr-8">
								{isAuth().name}
							</a>
						</Link>
					)}
					{isAuth() && isAuth().role === 'subscriber' && (
						<Link href="/user">
							<a className="text-gray-600 hover:text-red-500 mr-3 md:mr-8">
								{isAuth().name}
							</a>
						</Link>
					)}
					{isAuth() && (
						<a
							onClick={logout}
							className="text-gray-600 hover:text-red-500 mr-3 md:mr-8"
						>
							Logout
						</a>
					)}
				</div>
			</nav>
			<div className="mt-16">
				<Component {...pageProps} />
			</div>
		</>
	);
}
