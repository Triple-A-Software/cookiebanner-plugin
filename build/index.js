// /home/ychop/Dokumente/dev/cookiebanner-plugin/node_modules/@cms-local/plugin-interface/index.ts
function definePlugin(def) {
  return def;
}

// elementType.js
function elementType_default(actionHandler) {
  return {
    label: { de: "Einstellungen", en: "Settings" },
    type: "form",
    getDataHandler: actionHandler.toActionHandler("GET"),
    form: {
      label: {
        de: "Einstellungen",
        en: "Settings"
      },
      properties: [
        {
          id: "active",
          defaultValue: false,
          type: "checkbox",
          label: { de: "Cookiebanner aktiviert", en: "Cookie-banner active" }
        },
        {
          id: "categories",
          type: "accordion",
          label: {
            de: "Cookiebanner Kategorien",
            en: "Cookie-banner Categories"
          },
          items: [
            {
              label: {
                de: "Essentiell",
                en: "Essential"
              },
              id: "essential",
              icon: "i-tabler-tools",
              description: {
                de: "Diese Cookies sind unerl\xE4sslich f\xFCr die Funktionalit\xE4t einer Website und erm\xF6glichen grundlegende Funktionen wie die Navigation und den Zugriff auf gesch\xFCtzte Bereiche",
                en: "These cookies are essential for the functionality of a website, enabling basic functions like navigation and access to secure areas."
              },
              properties: [
                {
                  type: "text",
                  id: "blockedResources",
                  defaultValue: "[blocked-by='essential']",
                  label: {
                    de: "Blockierte Ressourcen",
                    en: "Blocked resources"
                  }
                }
              ]
            },
            {
              label: {
                de: "Performance",
                en: "Performance"
              },
              id: "performance",
              defaultValue: false,
              icon: "i-tabler-rocket",
              description: {
                de: "Diese Cookies sammeln Informationen dar\xFCber, wie Besucher eine Website nutzen, um deren Leistung und Funktionalit\xE4t zu verbessern, indem sie beispielsweise Seitenaufrufe und Ladezeiten verfolgen.",
                en: "These cookies gather information about how visitors use a website to improve its performance and functionality, tracking metrics such as page views and load times."
              },
              properties: [
                {
                  type: "checkbox",
                  id: "active",
                  defaultValue: false,
                  label: {
                    de: "aktiviert",
                    en: "active"
                  }
                },
                {
                  type: "text",
                  id: "blockedResources",
                  defaultValue: "[blocked-by='performance']",
                  label: {
                    de: "Blockierte Ressourcen",
                    en: "Blocked resources"
                  }
                }
              ]
            },
            {
              label: {
                de: "Marketing",
                en: "Marketing"
              },
              icon: "i-tabler-building-store",
              id: "marketing",
              description: {
                de: "Diese Cookies werden verwendet, um das Nutzerverhalten \xFCber verschiedene Websites hinweg zu verfolgen und Profile zu erstellen, die dann zur gezielten Schaltung von Anzeigen und zur Personalisierung von Inhalten verwendet werden k\xF6nnen.",
                en: "These cookies are used to track user behavior across different websites, creating profiles that can be utilized for targeted advertising and content personalization."
              },
              properties: [
                {
                  type: "checkbox",
                  id: "active",
                  defaultValue: false,
                  label: {
                    de: "aktiviert",
                    en: "active"
                  }
                },
                {
                  type: "text",
                  id: "blockedResources",
                  defaultValue: "[blocked-by='marketing']",
                  label: {
                    de: "Blockierte Ressourcen",
                    en: "Blocked resources"
                  }
                }
              ]
            },
            {
              label: {
                de: "Statistik",
                en: "Statistic"
              },
              id: "statistic",
              icon: "i-tabler-chart-area-line",
              description: {
                de: "Diese Cookies sammeln anonyme Daten dar\xFCber, wie Besucher eine Website nutzen, um Einblicke in das Nutzerverhalten zu gewinnen und die Website entsprechend zu optimieren und zu verbessern.",
                en: "These cookies collect anonymous data on how visitors interact with a website, providing insights into user behavior to optimize and enhance the website accordingly."
              },
              properties: [
                {
                  type: "checkbox",
                  id: "active",
                  defaultValue: false,
                  label: {
                    de: "aktiviert",
                    en: "active"
                  }
                },
                {
                  type: "text",
                  id: "blockedResources",
                  defaultValue: "[blocked-by='statistic']",
                  label: {
                    de: "Blockierte Ressourcen",
                    en: "Blocked resources"
                  }
                }
              ]
            }
          ]
        },
        {
          type: "text",
          id: "link",
          defaultValue: "/data-privacy#cookie",
          label: {
            de: "Link zum Datenschutz",
            en: "Link to Data privacy"
          }
        },
        {
          type: "code",
          id: "html",
          language: "html",
          defaultValue: "<p>Blocked</p>",
          label: {
            de: "Cookiebanner Block HTML",
            en: "Cookiebanner Block HTML"
          }
        }
      ]
    },
    actions: [
      {
        primary: true,
        label: { de: "Speichern", en: "Save" },
        handler: actionHandler.toActionHandler("POST")
      }
    ]
  };
}

// index.js
var cookiebanner_plugin_default = definePlugin((ctx) => {
  const actionHandler = ctx.registerHandler(["POST", "GET"], "/cookiebanner", async (req) => {
    const fromDb = await ctx.storage.getOne(ctx.storage.db_id);
    if (req.method === "GET") {
      return fromDb.data;
    }
    if (req.method === "POST") {
      const { data } = await ctx.storage.updateOne(ctx.storage.db_id, req.body);
      return data;
    }
    throw Error(`Method not allowed ${req.method}`);
  });
  ctx.registerElementType({
    name: "Cookiebanner",
    icon: "i-tabler-cookie",
    template: `<div id="cookie-banner-container" class="hidden">
    <div id="cookie-bottom-banner" tabindex="-1" class="hidden">
        <div class="flex items-center w-[70%]">
            <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                <span>Diese Seite verwendet Cookies, um Ihre Erfahrung zu verbessern. Durch die Nutzung der Website
                    stimmen Sie der Verwendung von Cookies zu. Sie k\xF6nnen die Cookie-Einstellungen jedoch auch anpassen,
                    wenn Sie m\xF6chten.
                    <a href="/data-privacy#cookie" id="link-to-data-privacy"
                        class="flex items-center ms-0 text-sm font-medium text-blue-600 md:ms-1 md:inline-flex dark:text-blue-500 hover:underline">
                        Mehr erfahren
                        <svg class="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </a>
                </span>
            </p>
        </div>
        <div class="flex flex-wrap gap-[5px]">
            <button data-dismiss-target="#cookie-bottom-banner" id="acceptAllCookies" type="button"
                class="h-[40px] focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Alle
                akzeptieren</button>
            <button data-dismiss-target="#cookie-bottom-banner" id="declineAllCookies" type="button"
                class="h-[40px] focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Alle
                ablehnen</button>
            <button data-modal-target="default-modal" data-modal-toggle="default-modal" type="button"
                class="h-[40px] text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Cookies
                verwalten</button>
        </div>
        <div class="flex items-center">
            <button data-dismiss-target="#cookie-bottom-banner" type="button"
                class="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white">
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span class="sr-only">Close banner</span>
            </button>
        </div>
    </div>
    <div class="fixed bottom-[-48px] hover:bottom-[-12px] transition-all" id="cookie-settings-reminder">
        <button data-modal-target="default-modal" data-modal-toggle="default-modal"
            class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-r-lg text-sm px-5 py-2.5 pb-6 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-cookie">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M8 13v.01" />
                <path d="M12 17v.01" />
                <path d="M12 12v.01" />
                <path d="M16 14v.01" />
                <path d="M11 8v.01" />
                <path
                    d="M13.148 3.476l2.667 1.104a4 4 0 0 0 4.656 6.14l.053 .132a3 3 0 0 1 0 2.296q -.745 1.18 -1.024 1.852q -.283 .684 -.66 2.216a3 3 0 0 1 -1.624 1.623q -1.572 .394 -2.216 .661q -.712 .295 -1.852 1.024a3 3 0 0 1 -2.296 0q -1.203 -.754 -1.852 -1.024q -.707 -.292 -2.216 -.66a3 3 0 0 1 -1.623 -1.624q -.397 -1.577 -.661 -2.216q -.298 -.718 -1.024 -1.852a3 3 0 0 1 0 -2.296q .719 -1.116 1.024 -1.852q .257 -.62 .66 -2.216a3 3 0 0 1 1.624 -1.623q 1.547 -.384 2.216 -.661q .687 -.285 1.852 -1.024a3 3 0 0 1 2.296 0" />
            </svg>
        </button>
    </div>

    <!-- Cookie settings -->
    <div id="default-modal" tabindex="-1" aria-hidden="true"
        class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div class="relative p-4 w-full max-w-2xl max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        Cookie Einstellungen
                    </h3>
                    <button type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="default-modal">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-4 md:p-5 space-y-4">
                    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Hier kannst du die Verwendung von Cookies nach deinen Pr\xE4ferenzen anpassen, um dein
                        Browsing-Erlebnis zu optimieren.
                    </p>
                    <div class="grid gap-4">
                        <div class="grid gap-x-4 grid-cols-3">
                            <p class="italic text-gray-900 dark:text-white border-t-1 col-span-2">Diese Cookies sind
                                unerl\xE4sslich
                                f\xFCr die Funktionalit\xE4t einer Website und erm\xF6glichen grundlegende Funktionen wie die
                                Navigation und den Zugriff auf gesch\xFCtzte Bereiche</p>
                            <label class="inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked class="sr-only peer" disabled>
                                <div
                                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                </div>
                                <span
                                    class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Essenziell</span>
                            </label>
                        </div>
                        <div class="grid gap-x-4 grid-cols-3" id="performance-cookie-toggle">
                            <p class="italic text-gray-900 dark:text-white border-t-1 col-span-2">Diese Cookies sammeln
                                Informationen dar\xFCber, wie Besucher eine Website nutzen, um deren Leistung und
                                Funktionalit\xE4t zu
                                verbessern, indem sie beispielsweise Seitenaufrufe und Ladezeiten verfolgen.</p>
                            <label class="inline-flex items-center cursor-pointer" id="performance-cookie-toggle">
                                <input type="checkbox" id="performance-cookie" value="" class="sr-only peer">
                                <div
                                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                </div>
                                <span
                                    class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Performance</span>
                            </label>
                        </div>
                        <div class="grid gap-x-4 grid-cols-3" id="marketing-cookie-toggle">
                            <p class="italic text-gray-900 dark:text-white border-t-1 col-span-2">Diese Cookies werden
                                verwendet,
                                um das Nutzerverhalten \xFCber verschiedene Websites hinweg zu verfolgen und Profile zu
                                erstellen, die dann zur gezielten Schaltung von Anzeigen und zur Personalisierung von
                                Inhalten verwendet werden k\xF6nnen.</p>
                            <label class="inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="marketing-cookie" value="" class="sr-only peer">
                                <div
                                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                </div>
                                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Marketing</span>
                            </label>
                        </div>
                        <div class="grid gap-x-4 grid-cols-3" id="statistic-cookie-toggle">
                            <p class="italic text-gray-900 dark:text-white border-t-1 col-span-2">Diese Cookies sammeln
                                anonyme
                                Daten
                                dar\xFCber, wie
                                Besucher eine Website nutzen, um Einblicke in das Nutzerverhalten zu
                                gewinnen und die Website entsprechend zu optimieren und zu verbessern.</p>
                            <label class="inline-flex items-center cursor-pointer" id="statistic-cookie-toggle">
                                <input type="checkbox" id="statistic-cookie" value="" class="sr-only peer">
                                <div
                                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                </div>
                                <span
                                    class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Statistics</span>
                            </label>
                        </div>
                    </div>
                </div>
                <!-- Modal footer -->
                <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button id="save-cookies-settings" data-modal-hide="default-modal" type="button"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Speichern</button>
                    <button data-modal-hide="default-modal" type="button"
                        class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Abbrechen</button>
                </div>
            </div>
        </div>
    </div>
</div>`,
    style: `.cookie-banner-toggle-btn{
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: #ffffff;
    height: 40px;
}`,
    script: `const cookies = ["performance", "statistic", "marketing"];

async function fetchCookieBanner() {
    const res = await fetch("/api/plugins/cookiebanner-plugin/cookiebanner", {
        method: "GET",
    });
    return await res.json();
}

function setLinkToDataPrivacy(link) {
    document.getElementById("link-to-data-privacy").setAttribute("href", link);
}

function getCookie(cname) {
    const name = \`\${cname}=\`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function initializeCookieBanner(json) {
    if (!getCookie("showCookiebanner")) {
        document.getElementById("cookie-bottom-banner").className =
            "fixed bottom-0 start-0 z-50 md:flex-wrap flex justify-between w-full p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600";
    }
    if (json.active) {
        document.getElementById("cookie-banner-container").className = "";
        for (const cookie of cookies) {
            if (!json.categories[cookie].active) {
                document.getElementById(\`\${cookie}-cookie-toggle\`).style.display = "none";
            }
        }
    }
}

function setEventListeners() {
    document.getElementById("acceptAllCookies").addEventListener("click", acceptAllCookies);
    document.getElementById("declineAllCookies").addEventListener("click", declineAllCookies);

    for (const cookie of cookies) {
        document.getElementById(\`\${cookie}-cookie\`).addEventListener("change", setCookie);
    }
    document.getElementById("save-cookies-settings").addEventListener("click", saveCookies);
}

function setCookie(e) {
    const cookieName = e.target.id.replace("-cookie", "");
    document.cookie = \`\${cookieName}=\${e.target.checked}; max-age=2592000; path=/; SameSite=Strict\`;
}

function saveCookies() {
    document.cookie = "showCookiebanner=false; max-age=2592000; path=/; SameSite=Strict";
    location.reload();
}

function acceptAllCookies() {
    for (const cookie of cookies) {
        document.cookie = \`\${cookie}=true; max-age=2592000; path=/; SameSite=Strict\`;
    }
    document.getElementById("cookie-bottom-banner").className = "hidden";
    saveCookies();
}

function declineAllCookies() {
    for (const cookie of cookies) {
        document.cookie = \`\${cookie}=false; max-age=2592000; path=/; SameSite=Strict\`;
    }
    document.getElementById("cookie-bottom-banner").className = "hidden";
    saveCookies();
}

function reloadScript(el) {
    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.src = el.getAttribute("data-src");
    el.remove();
    head.appendChild(script);
}

function handleBlockedResources() {
    const blockedElements = document.querySelectorAll("[blocked-by]");

    for (const el of blockedElements) {
        const blockedBy = el.getAttribute("blocked-by");
        if (getCookie(blockedBy) === "true") {
            if (el.tagName.toLowerCase() === "script") {
                reloadScript(el);
            }
            if (el.hasAttribute("data-type")) {
                console.log("HAS DATATYPE");
                switch (el.dataset.type) {
                    case "iframe": {
                        console.log("IS IFRAME");
                        const iframe = document.createElement("iframe");
                        for (const [key, value] of Object.entries(el.attributes)) {
                            iframe.setAttribute(key.replace("blocked-", ""), value);
                            console.log("KEY:", key, "Value:", value);
                        }
                        el.replaceWith(iframe);
                        break;
                    }
                    default:
                        break;
                }
            }
        }
    }
}

async function main() {
    const json = await fetchCookieBanner();
    initializeCookieBanner(json);
    setEventListeners();
    setLinkToDataPrivacy(json.link);
    handleBlockedResources();
}

main();
`,
    form: {
      label: {
        de: "Cookiebanner",
        en: "Cookie-banner"
      }
    }
  });
  ctx.registerSettingsPage("/cookie-banner", elementType_default(actionHandler));
  ctx.onRewrite(async (rewriter) => {
    const dataFromDb = await ctx.storage.getOne(ctx.storage.db_id);
    if (!dataFromDb)
      return;
    rewriter.on("[blocked-by]", {
      element(el) {
        const data = dataFromDb.data;
        if (data.active) {
          const blockedResource = el.getAttribute("blocked-by");
          if (data.categories[blockedResource].active) {
            ctx.logger.info("Blocked", blockedResource, el.tagName);
            switch (el.tagName.toLowerCase()) {
              case "iframe": {
                const rewriter2 = new HTMLRewriter;
                let foundFirst = false;
                rewriter2.on("*:first-child", {
                  element(el_) {
                    if (foundFirst)
                      return;
                    for (const [key, value] of el.attributes) {
                      if (key === "blocked-by") {
                        el_.setAttribute(key, value);
                        continue;
                      }
                      el_.setAttribute(`blocked-${key}`, value);
                    }
                    el_.setAttribute("data-type", "iframe");
                    foundFirst = true;
                  }
                });
                const replacer = rewriter2.transform(data.html);
                el.replace(replacer, { html: true });
                break;
              }
              case "script":
                el.setAttribute("data-src", el.getAttribute("src"));
                el.removeAttribute("src");
                break;
              default:
                break;
            }
          }
        }
      }
    });
  });
});
export {
  cookiebanner_plugin_default as default
};
