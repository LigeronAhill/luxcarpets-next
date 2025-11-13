import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { IconUser } from "@tabler/icons-react";
import { Button } from "./ui/button";

export default function UserProfile(): React.JSX.Element {
	return (
		<div>
			<SignedOut>
				<SignInButton>
					<Button variant="ghost" size="sm" className="cursor-pointer">
						<IconUser />
						<span className="hidden sm:inline-block">Войти</span>
					</Button>
				</SignInButton>
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</div>
	);
}
