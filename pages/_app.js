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
			</Head>

			<div className="mx-64 overflow-scroll my-16 fixed inset-0 shadow-xl bg-white p-8 sm:p-12 large-border-radius">
				<div className="rounded-lg overflow-scroll">
					<nav className="flex items-center sm:text-lg mb-10 sm:mb-10">
						<Link href="/">
							<a className="block lg:inline-block lg:mt-0 text-gray-500 hover:text-purple-600 hover:font-bold mr-8">
								Home
							</a>
						</Link>
						<Link href="/user/link/create">
							<a className="block lg:inline-block lg:mt-0 text-gray-500 hover:text-purple-600 hover:font-bold mr-8">
								Submit a link
							</a>
						</Link>
						{!isAuth() && (
							<>
								<Link href="/login">
									<a className="block lg:inline-block lg:mt-0 text-gray-500 hover:text-purple-600 hover:font-bold mr-8">
										Login
									</a>
								</Link>
								<Link href="/register">
									<a className="block lg:inline-block lg:mt-0 text-gray-500 hover:text-purple-600 hover:font-bold mr-8">
										Register
									</a>
								</Link>
							</>
						)}
						{isAuth() && isAuth().role === 'admin' && (
							<Link href="/admin">
								<a className="block ml-auto lg:inline-block lg:mt-0 text-gray-500 hover:text-purple-600 hover:font-bold mr-8">
									{isAuth().name}
								</a>
							</Link>
						)}
						{isAuth() && isAuth().role === 'subscriber' && (
							<Link href="/user">
								<a className="block ml-auto lg:inline-block lg:mt-0 text-gray-500 hover:text-purple-600 hover:font-bold mr-8">
									{isAuth().name}
								</a>
							</Link>
						)}
						<a
							onClick={logout}
							className="block lg:inline-block lg:mt-0 text-gray-500 hover:text-purple-600 hover:font-bold mr-8"
						>
							Logout
						</a>
					</nav>
					<Component {...pageProps} />
				</div>
			</div>
		</>
	);
}
