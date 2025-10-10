import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";

export default async function Header(): Promise<React.JSX.Element> {
	return (
		<header>
			<SignedOut>
				<SignInButton />
				<SignUpButton>
					<button
						type="button"
						className="h-10 cursor-pointer rounded-full bg-[#6c47ff] px-4 font-medium text-ceramic-white text-sm sm:h-12 sm:px-5 sm:text-base"
					>
						Sign Up
					</button>
				</SignUpButton>
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
			<ModeToggle />
		</header>
	);
}
