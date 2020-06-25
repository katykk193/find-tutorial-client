import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'tailwindcss/tailwind.css';

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
			<nav className="flex items-center flex-wrap bg-teal-500 p-2">
				<Link href="/">
					<a className="block lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-8">
						Home
					</a>
				</Link>
				<Link href="/login">
					<a className="block lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-8">
						Login
					</a>
				</Link>
				<Link href="/register">
					<a className="block lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-8">
						Register
					</a>
				</Link>
			</nav>
			<Component {...pageProps} />
		</>
	);
}
