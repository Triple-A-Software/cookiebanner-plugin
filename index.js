import { definePlugin } from "@cms-local/plugin-interface";
let DATA_ID = 0;

export default definePlugin((ctx) => {
    const actionHandler = ctx.registerHandler(["POST", "GET"], "/cookiebanner", async (req) => {
        const fromDb = await ctx.storage.getOne(DATA_ID);
        if (req.method === "GET") {
            return fromDb.data;
        }
        if (req.method === "POST") {
            if (fromDb) {
                const { data } = await ctx.storage.updateOne(DATA_ID, req.body);
                return data;
            } else {
                const { data, id } = await ctx.storage.createOne(req.body);
                DATA_ID = id;
                return data;
            }
        }
        throw Error(`Method not allowed ${req.method}`);
    });

    ctx.registerSettingsPage("cookie-banner", {
        path: "/cookie-banner",
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
    });

    // Needs Flowbite to Display Properly
    ctx.registerElementType({
        name: "Cookiebanner",
        icon: "i-tabler-cookie",
        template: `<div id="cookie-banner-container" class="hidden">
<div id="cookie-bottom-banner" tabindex="-1" class="hidden">
    <div class="flex items-center w-[70%]">
        <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
            <span>Diese Seite verwendet Cookies, um Ihre Erfahrung zu verbessern. Durch die Nutzung der Website stimmen Sie der Verwendung von Cookies zu. Sie können die Cookie-Einstellungen jedoch auch anpassen, wenn Sie möchten. 
                <a href="/data-privacy#cookie" class="flex items-center ms-0 text-sm font-medium text-blue-600 md:ms-1 md:inline-flex dark:text-blue-500 hover:underline">
                 Mehr erfahren
                    <svg class="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
  </svg>
                </a>
            </span>
        </p>
    </div>
    <div>
        <button data-dismiss-target="#cookie-bottom-banner" id="acceptAllCookies" type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Alle akzeptieren</button>
        <button data-modal-target="default-modal" data-modal-toggle="default-modal" type="button" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Cookies verwalten</button>
    </div>
    <div class="flex items-center">
        <button data-dismiss-target="#cookie-bottom-banner" type="button" class="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close banner</span>
        </button>
    </div>
</div>  
<div class="fixed bottom-[-48px] hover:bottom-[-18px] transition-all" id="cookie-settings-reminder">
    <button data-modal-target="default-modal" data-modal-toggle="default-modal" class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-r-lg text-sm px-5 py-2.5 pb-6 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-cookie"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path stroke="none" d="M0 0h24v24H0z" /><path d="M8 13v.01" /><path d="M12 17v.01" /><path d="M12 12v.01" /><path d="M16 14v.01" /><path d="M11 8v.01" /><path d="M13.148 3.476l2.667 1.104a4 4 0 0 0 4.656 6.14l.053 .132a3 3 0 0 1 0 2.296q -.745 1.18 -1.024 1.852q -.283 .684 -.66 2.216a3 3 0 0 1 -1.624 1.623q -1.572 .394 -2.216 .661q -.712 .295 -1.852 1.024a3 3 0 0 1 -2.296 0q -1.203 -.754 -1.852 -1.024q -.707 -.292 -2.216 -.66a3 3 0 0 1 -1.623 -1.624q -.397 -1.577 -.661 -2.216q -.298 -.718 -1.024 -1.852a3 3 0 0 1 0 -2.296q .719 -1.116 1.024 -1.852q .257 -.62 .66 -2.216a3 3 0 0 1 1.624 -1.623q 1.547 -.384 2.216 -.661q .687 -.285 1.852 -1.024a3 3 0 0 1 2.296 0" /></svg>
    </button>
</div>

 <!-- Cookie settings -->
<div id="default-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Cookie Einstellungen
                </h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Hier kannst du die Verwendung von Cookies nach deinen Präferenzen anpassen, um dein Browsing-Erlebnis zu optimieren.
                </p>
         <div class="grid gap-4">     
<label class="inline-flex items-center cursor-pointer">
  <input type="checkbox" checked class="sr-only peer" disabled>
  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Essenziell</span>
</label>

<label class="inline-flex items-center cursor-pointer">
  <input type="checkbox" id="toggle-performance-cookie" value="" class="sr-only peer">
  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Performance</span>
</label>
</div>
            </div>
            <!-- Modal footer -->
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button id="save-cookies-settings" data-modal-hide="default-modal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Speichern</button>
                <button data-modal-hide="default-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Abbrechen</button>
            </div>
        </div>
    </div>
</div>
</div>`,
        style: "",
        script: `const res = await fetch("/api/plugins/cookiebanner-plugin/cookiebanner", { method: "GET" });
const json = await res.json();
checkIframes();
if(!getCookie("showCookiebanner")){
    document.getElementById("cookie-bottom-banner").className="fixed bottom-0 start-0 z-50 flex justify-between w-full p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
}
if(json.active){
    document.getElementById("cookie-banner-container").className=""
}
document.getElementById("acceptAllCookies").addEventListener("click", acceptAllCookies);
document.getElementById("toggle-performance-cookie").addEventListener("change", setPerformanceCookies);
document.getElementById("toggle-performance-cookie").checked=getCookie("performance") === "true" ? true : false;
document.getElementById("save-cookies-settings").addEventListener("click", saveCookies);


function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function saveCookies() {
    document.cookie = "showCookiebanner=false; max-age=2592000;path=/; SameSite=Strict";
    location.reload();
}

function setPerformanceCookies(e) {
        document.cookie = \`performance=\$\{e.target.checked\}; max-age=2592000;path=/; SameSite=Strict\`;
}

function acceptAllCookies() {
    document.cookie = "performance=true; max-age=2592000;path=/; SameSite=Strict";
    document.cookie = "showCookiebanner=false; max-age=2592000;path=/; SameSite=Strict";
     document.getElementById("cookie-bottom-banner").className="hidden"
}

function checkIframes() {
    
if (json.active) {
    let iframes = document.body.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
        let currentIframe = iframes[i];
        if (document.cookie.includes("performance=true")) {
            if(currentIframe.getAttribute("data-src")){
            currentIframe.setAttribute("src", currentIframe.getAttribute("data-src"));
            }
        } else {
            if (currentIframe.outerHTML) {
                currentIframe.outerHTML = json.html;
                }
            }
        }
    }
}`,
        form: {
            label: {
                de: "Cookiebanner",
                en: "Cookie-banner",
            },
            properties: {
                cookie_banner: {
                    label: {
                        de: "Cookiebanner HTML",
                        en: "Cookie-banner HTML",
                    },
                    type: "code",
                    language: "html",
                },
            },
        },
    });
});
