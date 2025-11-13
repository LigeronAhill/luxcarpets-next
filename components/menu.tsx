import { IconMenu2 } from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "./ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

export default function Menu(): React.JSX.Element {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon">
					<IconMenu2 />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>
						<Image
							src="/images/luxcarpetslogo.png"
							alt="logo"
							width={96}
							height={96}
							className="dark:invert"
						/>
					</SheetTitle>
					<SheetDescription>Выберите пункт меню</SheetDescription>
				</SheetHeader>
				<ul>
					<li>First</li>
					<li>Second</li>
					<li>Third</li>
				</ul>
				<SheetFooter>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
