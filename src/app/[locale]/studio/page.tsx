import StudioApp from "./components/StudioApp";

export const metadata = {
    title: "PLUS Studio | AI Growth Workspace",
    description: "Plan campaigns, generate visuals, and move from strategy to launch in one AI workspace.",
    openGraph: {
        title: "PLUS Studio | AI Growth Workspace",
        description: "Plan campaigns, generate visuals, and move from strategy to launch in one AI workspace.",
        type: "website",
        url: "https://www.plusthe.site/studio",
    },
    alternates: {
        canonical: "https://www.plusthe.site/studio",
    },
};

export default function Page() {
    return <StudioApp />;
}
