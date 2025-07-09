import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
    title: "Cog",
    tagline: "Tiny HTTP framework built on node:http",
    favicon: "img/favicon.ico",

    url: "https://eugsh1.github.io",

    baseUrl: "/Cog",
    trailingSlash: false,

    organizationName: "EugSh1",
    projectName: "Cog",

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    i18n: {
        defaultLocale: "en",
        locales: ["en"]
    },

    headTags: [
        {
            tagName: "meta",
            attributes: {
                name: "google-site-verification",
                content: "uPaxzUMiWyWpDzlap9HYVGU9GQjQdo_rrvtc_UzEgBI"
            }
        }
    ],

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                    editUrl: "https://github.com/EugSh1/Cog/tree/main/docs/"
                },
                theme: {
                    customCss: "./src/css/custom.css"
                }
            } satisfies Preset.Options
        ]
    ],

    themeConfig: {
        image: "img/docusaurus-social-card.jpg",
        colorMode: {
            respectPrefersColorScheme: true
        },
        navbar: {
            title: "Cog",
            logo: {
                alt: "Cog Logo",
                src: "img/logo.svg"
            },
            items: [
                {
                    type: "docSidebar",
                    sidebarId: "tutorialSidebar",
                    position: "left",
                    label: "Tutorial"
                },
                {
                    href: "https://github.com/EugSh1/Cog",
                    label: "GitHub",
                    position: "right"
                }
            ]
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Docs",
                    items: [
                        {
                            label: "Tutorial",
                            to: "/docs/intro"
                        },
                        {
                            label: "Core Concepts",
                            to: "/docs/category/core-concepts"
                        },
                        {
                            label: "Integrations",
                            to: "/docs/category/integrations"
                        }
                    ]
                },
                {
                    title: "Links",
                    items: [
                        {
                            label: "GitHub",
                            href: "https://github.com/EugSh1/Cog"
                        },
                        {
                            label: "NPM",
                            href: "https://www.npmjs.com/package/cog-http"
                        }
                    ]
                }
            ]
        },
        prism: {
            theme: prismThemes.vsLight,
            darkTheme: prismThemes.vsDark
        }
    } satisfies Preset.ThemeConfig
};

export default config;
