import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import { ModeToggle } from "./mode-toggle";
import SearchBar from "./searchbar";
import UserProfile from "./userprofile";

export default async function Header(): Promise<React.JSX.Element> {
	return (
		<header className="sticky top-0 z-40 mb-4 flex h-16 min-h-[4rem] items-center justify-between px-4">
			<Link href="/" className="flex">
				<Image
					src="/images/slimluxcarpetslogo.png"
					alt="logo"
					width={234}
					height={63}
					className="max-md:hidden dark:invert"
				/>
				<Image
					src="/images/luxcarpetslogo.png"
					alt="logo"
					width={69}
					height={69}
					className="md:hidden dark:invert"
				/>
			</Link>
			<SearchBar />
			<div className="flex items-center gap-4">
				<ModeToggle />
				<Menu />
				<UserProfile />
			</div>
		</header>
	);
}
