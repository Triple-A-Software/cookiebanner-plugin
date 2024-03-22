/**
 * @param {import("@cms-local/plugin-interface").RegisterHandlerReturn} actionHandler
 */
export default function (actionHandler) {
    return {
        label: { de: "Einstellungen", en: "Settings" },
        type: "form",
        getDataHandler: actionHandler.toActionHandler("GET"),
        form: {
            label: {
                de: "Einstellungen",
                en: "Settings",
            },
            properties: [
                {
                    id: "active",
                    defaultValue: false,
                    type: "checkbox",
                    label: { de: "Cookiebanner aktiviert", en: "Cookie-banner active" },
                },
                {
                    id: "categories",
                    type: "accordion",
                    label: {
                        de: "Cookiebanner Kategorien",
                        en: "Cookie-banner Categories",
                    },
                    items: [
                        {
                            label: {
                                de: "Essentiell",
                                en: "Essential",
                            },
                            id: "essential",
                            icon: "i-tabler-tools",
                            description: {
                                de: "Diese Cookies sind unerlässlich für die Funktionalität einer Website und ermöglichen grundlegende Funktionen wie die Navigation und den Zugriff auf geschützte Bereiche",
                                en: "These cookies are essential for the functionality of a website, enabling basic functions like navigation and access to secure areas.",
                            },
                            properties: [
                                {
                                    type: "text",
                                    id: "blockedResources",
                                    defaultValue: "[blocked-by='essential']",
                                    label: {
                                        de: "Blockierte Ressourcen",
                                        en: "Blocked resources",
                                    },
                                },
                            ],
                        },
                        {
                            label: {
                                de: "Performance",
                                en: "Performance",
                            },
                            id: "performance",
                            defaultValue: false,
                            icon: "i-tabler-rocket",
                            description: {
                                de: "Diese Cookies sammeln Informationen darüber, wie Besucher eine Website nutzen, um deren Leistung und Funktionalität zu verbessern, indem sie beispielsweise Seitenaufrufe und Ladezeiten verfolgen.",
                                en: "These cookies gather information about how visitors use a website to improve its performance and functionality, tracking metrics such as page views and load times.",
                            },
                            properties: [
                                {
                                    type: "checkbox",
                                    id: "active",
                                    label: {
                                        de: "aktiviert",
                                        en: "active",
                                    },
                                },
                                {
                                    type: "text",
                                    id: "blockedResources",
                                    defaultValue: "[blocked-by='performance']",
                                    label: {
                                        de: "Blockierte Ressourcen",
                                        en: "Blocked resources",
                                    },
                                },
                            ],
                        },
                        {
                            label: {
                                de: "Marketing",
                                en: "Marketing",
                            },
                            icon: "i-tabler-building-store",
                            defaultValue: false,
                            id: "marketing",
                            description: {
                                de: "Diese Cookies werden verwendet, um das Nutzerverhalten über verschiedene Websites hinweg zu verfolgen und Profile zu erstellen, die dann zur gezielten Schaltung von Anzeigen und zur Personalisierung von Inhalten verwendet werden können.",
                                en: "These cookies are used to track user behavior across different websites, creating profiles that can be utilized for targeted advertising and content personalization.",
                            },
                            properties: [
                                {
                                    type: "checkbox",
                                    id: "active",
                                    label: {
                                        de: "aktiviert",
                                        en: "active",
                                    },
                                },
                                {
                                    type: "text",
                                    id: "blockedResources",
                                    defaultValue: "[blocked-by='marketing']",
                                    label: {
                                        de: "Blockierte Ressourcen",
                                        en: "Blocked resources",
                                    },
                                },
                            ],
                        },
                        {
                            label: {
                                de: "Statistik",
                                en: "Statistic",
                            },
                            id: "statistic",
                            defaultValue: false,
                            icon: "i-tabler-chart-area-line",
                            description: {
                                de: "Diese Cookies sammeln anonyme Daten darüber, wie Besucher eine Website nutzen, um Einblicke in das Nutzerverhalten zu gewinnen und die Website entsprechend zu optimieren und zu verbessern.",
                                en: "These cookies collect anonymous data on how visitors interact with a website, providing insights into user behavior to optimize and enhance the website accordingly.",
                            },
                            properties: [
                                {
                                    type: "checkbox",
                                    id: "active",
                                    label: {
                                        de: "aktiviert",
                                        en: "active",
                                    },
                                },
                                {
                                    type: "text",
                                    id: "blockedResources",
                                    defaultValue: "[blocked-by='statistic']",
                                    label: {
                                        de: "Blockierte Ressourcen",
                                        en: "Blocked resources",
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "code",
                    id: "html",
                    language: "html",
                    label: {
                        de: "Cookiebanner Block HTML",
                        en: "Cookiebanner Block HTML",
                    },
                },
            ],
        },
        actions: [
            {
                primary: true,
                label: { de: "Speichern", en: "Save" },
                handler: actionHandler.toActionHandler("POST"),
            },
        ],
    };
}
