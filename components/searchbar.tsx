import { IconInputSearch, IconSearch } from "@tabler/icons-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "./ui/button";

export default async function SearchBar() {
	return (
		<InputGroup className="mx-6 md:mx-24">
			<InputGroupInput placeholder="Поиск..." />
			<InputGroupAddon>
				<IconSearch />
			</InputGroupAddon>
			<InputGroupAddon align="inline-end">
				<InputGroupButton className="cursor-pointer">
					<span className="hidden sm:inline-block">Искать</span>
					<IconInputSearch className="sm:hidden" />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
}
