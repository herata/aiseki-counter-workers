import type { Metadata, Viewport } from "next";
import "./globals.css";
import Provider from "@/provider/tanstack-provider";
import { CopilotWrapper } from "@/provider/copilot-wrapper";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#ffffff",
};

export const metadata: Metadata = {
	title: "相席カウンター",
	description: "期間限定で主要相席系居酒屋の男女別人数推移を公開中",
	keywords: ["相席カウンター", "来客分析", "ダッシュボード", "レストラン", "データ分析"],
	authors: [{ name: "相席カウンター運営チーム" }],
	robots: "noindex, nofollow",
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
		],
		apple: [
			{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
		],
		other: [
			{
				rel: "android-chrome",
				url: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				rel: "android-chrome",
				url: "/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
			{
				rel: "msapplication-TileImage",
				url: "/mstile-150x150.png",
				sizes: "150x150",
				type: "image/png",
			},
		],
	},
	openGraph: {
		title: "相席カウンター",
		description: "期間限定で主要相席系居酒屋の男女別人数推移を公開中",
		type: "website",
		locale: "ja_JP",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body>
				<Provider>
					<CopilotWrapper>
						{children}
					</CopilotWrapper>
				</Provider>
			</body>
		</html>
	);
}
