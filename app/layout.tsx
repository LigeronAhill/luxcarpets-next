import { ruRU } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import Footer from "@/components/footer";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
	title: "Luxury Carpets",
	description: "Luxury Carpets",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			localization={ruRU}
			appearance={{
				theme: shadcn,
			}}
		>
			<html lang="ru" suppressHydrationWarning>
				<body
					className={`${montserrat.variable} mx-auto grid min-h-dvh max-w-7xl grid-rows-[auto_1fr_auto] py-4 font-base text-neutral antialiased dark:bg-basedark-100 dark:text-base-100`}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Header />
						{children}
						<Footer />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
