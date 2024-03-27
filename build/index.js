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
                de: "Funktional",
                en: "Functional"
              },
              id: "functional",
              icon: "i-tabler-tools",
              description: {
                de: "Diese Cookies sind unerl\xE4sslich f\xFCr die Funktionalit\xE4t einer Website und erm\xF6glichen grundlegende Funktionen wie die Navigation und den Zugriff auf gesch\xFCtzte Bereiche",
                en: "These cookies are essential for the functionality of a website, enabling basic functions like navigation and access to secure areas."
              },
              properties: [
                {
                  type: "text",
                  id: "blockedResources",
                  defaultValue: "[blocked-by='functional']",
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
var cookiebanner_plugin_default = definePlugin(async (ctx) => {
  const data = await ctx.storage.getAll();
  let db_id = data.at(0)?.id;
  if (data.length === 0) {
    db_id = await ctx.storage.createOne().id;
  }
  console.log("ID", db_id);
  const actionHandler = ctx.registerHandler(["POST", "GET"], "/cookiebanner", async (req) => {
    const fromDb = await ctx.storage.getOne(db_id);
    if (req.method === "GET") {
      return fromDb.data;
    }
    if (req.method === "POST") {
      const { data: data2 } = await ctx.storage.updateOne(db_id, req.body);
      return data2;
    }
    throw Error(`Method not allowed ${req.method}`);
  });
  ctx.registerElementType({
    name: "Cookiebanner",
    icon: "i-tabler-cookie",
    template: `<div id="cookie-banner-container" class="hidden">
    <div id="cookie-bottom-banner" tabindex="-1" class="hidden">
        <div class="cookie-banner-container">
            <p class="cookie-banner-text">
                <span>Diese Seite verwendet Cookies, um Ihre Erfahrung zu verbessern. Durch die Nutzung der Website
                    stimmen Sie der Verwendung von Cookies zu. Sie k\xF6nnen die Cookie-Einstellungen jedoch auch anpassen,
                    wenn Sie m\xF6chten.
                    <a href="/data-privacy#cookie" id="link-to-data-privacy" class="cookie-banner-link">
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
        <div class="cookie-banner-btn-container">
            <button onclick="cookie_banner_settings.showModal()" id="acceptAllCookies" type="button"
                class="cookie-banner-btn bg-green-700 hover:bg-green-800">Alle
                akzeptieren</button>
            <button onclick="cookie_banner_settings.showModal()" id="declineAllCookies" type="button"
                class="cookie-banner-btn bg-red-700 hover:bg-red-800">Alle
                ablehnen</button>
            <button onclick="cookie_banner_settings.showModal()" type="button"
                class="cookie-banner-btn bg-gray-800 hover:bg-gray-900">Cookies
                verwalten</button>
        </div>
        <div class="cookie-banner-close-btn-container">
            <button data-dismiss-target="#cookie-bottom-banner" type="button"
                class="cookie-banner-close-btn hover:bg-gray-200 hover:text-gray-900">
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span class="sr-only">Close banner</span>
            </button>
        </div>
    </div>
    <div class="cookie-banner-spy-container" id="cookie-settings-reminder">
        <button onclick="cookie_banner_settings.showModal()" class="cookie-banner-spy">
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
    <dialog id="cookie_banner_settings" class="cookie-banner-modal-container">
        <div class="cookie-banner-modal-content">
            <!-- Modal content -->
            <div class="cookie-banner-modal-header">
                <!-- Modal header -->
                <div class="cookie-banner-modal-header-text">
                    <h3 class="cookie-banner-header-3">
                        Cookie Einstellungen
                    </h3>
                    <button type="button" class="cookie-banner-close-btn" onclick="cookie_banner_settings.close()">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="cookie-banner-modal-body">
                    <p class="cookie-banner-modal-body-text">
                        Hier kannst du die Verwendung von Cookies nach deinen Pr\xE4ferenzen anpassen, um dein
                        Browsing-Erlebnis zu optimieren.
                    </p>
                    <div class="cookie-banner-modal-body-container">
                        <div class="cookie-banner-modal-body-btn-container">
                            <p class="cookie-banner-modal-body-btn-text">Diese Cookies sind
                                unerl\xE4sslich
                                f\xFCr die Funktionalit\xE4t einer Website und erm\xF6glichen grundlegende Funktionen wie die
                                Navigation und den Zugriff auf gesch\xFCtzte Bereiche</p>
                            <label class="inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked class="sr-only peer" disabled>
                                <div
                                    class="cookie-banner-toogle peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600">
                                </div>
                                <span class="cookie-banner-modal-body-span">Funktional</span>
                            </label>
                        </div>
                        <div class="cookie-banner-modal-body-btn-container" id="performance-cookie-toggle">
                            <p class="cookie-banner-modal-body-btn-text">Diese Cookies sammeln
                                Informationen dar\xFCber, wie Besucher eine Website nutzen, um deren Leistung und
                                Funktionalit\xE4t zu
                                verbessern, indem sie beispielsweise Seitenaufrufe und Ladezeiten verfolgen.</p>
                            <label class="cookie-banner-modal-body-btn-label" id="performance-cookie-toggle">
                                <input type="checkbox" id="performance-cookie" value="" class="sr-only peer">
                                <div
                                    class="cookie-banner-toogle peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600">
                                </div>
                                <span class="cookie-banner-modal-body-span">Performance</span>
                            </label>
                        </div>
                        <div class="cookie-banner-modal-body-btn-container" id="marketing-cookie-toggle">
                            <p class="cookie-banner-modal-body-btn-text">Diese Cookies werden verwendet,
                                um das Nutzerverhalten \xFCber verschiedene Websites hinweg zu verfolgen und Profile zu
                                erstellen, die dann zur gezielten Schaltung von Anzeigen und zur Personalisierung von
                                Inhalten verwendet werden k\xF6nnen.</p>
                            <label class="cookie-banner-modal-body-btn-label">
                                <input type="checkbox" id="marketing-cookie" value="" class="sr-only peer">
                                <div
                                    class="cookie-banner-toogle peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600">
                                </div>
                                <span class="cookie-banner-modal-body-span">Marketing</span>
                            </label>
                        </div>
                        <div class="cookie-banner-modal-body-btn-container" id="statistic-cookie-toggle">
                            <p class="cookie-banner-modal-body-btn-text">Diese Cookies sammeln
                                anonyme Daten dar\xFCber, wie Besucher eine Website nutzen, um Einblicke in das
                                Nutzerverhalten zu
                                gewinnen und die Website entsprechend zu optimieren und zu verbessern.</p>
                            <label class="cookie-banner-modal-body-btn-label" id="statistic-cookie-toggle">
                                <input type="checkbox" id="statistic-cookie" value="" class="sr-only peer">
                                <div
                                    class="cookie-banner-toogle peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600">
                                </div>
                                <span class="cookie-banner-modal-body-span">Statistics</span>
                            </label>
                        </div>
                    </div>
                </div>
                <!-- Modal footer -->
                <div class="cookie-banner-modal-footer">
                    <button id="save-cookies-settings" onclick="cookie_banner_settings.close()" type="button"
                        class="cookie-banner-btn bg-blue-700 hover:bg-blue-800">Speichern</button>
                    <button onclick="cookie_banner_settings.close()" type="button"
                        class="cookie-banner-btn bg-gray-700 hover:bg-gray-800">Abbrechen</button>
                </div>
            </div>
        </div>
    </dialog>
</div>`,
    style: `.cookie-banner-header-3{
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;

}

.cookie-banner-toggle-btn{
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
}

.cookie-banner-container,
.cookie-banner-text,
.cookie-banner-close-btn-container,
.cookie-banner-modal-header-text,
.cookie-banner-modal-footer,
.cookie-banner-link {
    display: flex;
    align-items: center;
}

.cookie-banner-link,
.cookie-banner-text,
.cookie-banner-btn,
.cookie-banner-close-btn,
.cookie-banner-spy
{
    font-size: 14px;
    line-height: 20px;
}

.cookie-banner-container{
    width: 70%;
}

.cookie-banner-text{
    font-weight: 400;
}

.cookie-banner-link{
    margin-left: 0; 
    font-weight: 600;
    color: rgba(63, 131, 248, .5);
}

.cookie-banner-link:hover{
    text-decoration: underline;
}

.cookie-banner-btn-container{
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.cookie-banner-btn{
    height: 40px;
    font-weight: 600;
    color: white;
    outline: none;
    border-radius: 25px;
    padding: .625rem 1.25rem;
    margin-right: 1rem;
}

.cookie-banner-close-btn{
    flex-shrink: unset;
    display: inline-flex;
    justify-content: center;
    width: 28px;
    height: 28px;
    align-items: center;
    border-radius: 25px;
    padding: .375rem;
    color: lightgray;
}

.cookie-banner-spy-container{
    position: fixed;
    bottom: -48px;
    transition: all .5s;
}

.cookie-banner-spy-container:hover{
    bottom: -15px;
}

.cookie-banner-spy{
    color: white;
    background: rgb(23 37 84);
    font-weight: 600;
    border-radius: 10px 10px 0 0;
    padding: .625rem 1.25rem;
    padding-bottom: 1.7rem !important;
}

.cookie-banner-modal-container{
    overflow-y: auto;
    overflow-x: hidden;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 50;
    justify-content: center;
    align-items: center;
    width: 70%;
}

.cookie-banner-modal-content{
    position: relative;
    padding: 1rem;
    width: 100%;

}

.cookie-banner-modal-header{
    position: relative;
    background: white;
    border-radius: 25px;
}

.cookie-banner-modal-header-text{
    justify-content: space-between;
    padding: 1rem;
    border-bottom: lightgray solid 1px;
}

.cookie-banner-modal-body{
    padding: 1rem; 
}

.cookie-banner-modal-body-text{
    font-size: 1rem;
    color: grey;
    padding-bottom: 1rem;
}

.cookie-banner-modal-body-container, 
.cookie-banner-modal-body-btn-container{
    display: grid;
    gap: 1rem;
}

.cookie-banner-modal-body-btn-container{
    grid-template-columns: repeat(3,1fr);
}

.cookie-banner-modal-body-btn-text{
    font-style: italic;
    grid-column: span 2 / span 2;
    border-top: lightgray solid 1px;
    padding-top: 1rem;
}

.cookie-banner-modal-body-btn-label{
    display: inline-flex;
    align-items: center;
    cursor: pointer;
}

.cookie-banner-toogle{
    position: relative;
    border-radius: 25px;
    width: 2.75rem;
    height: 1.5rem;
    background-color: #E5E7EB;
}

.cookie-banner-toogle::after {
   position: absolute;
   top: 2px;
   left: 2px;
   background: white;
   border: lightgray solid 1px;
   content: '';
   border-radius: 100%;
   width: 1.25rem;
   height: 1.25rem;
   transition: all .5s;
}

.cookie-banner-modal-body-span{
    margin-left: .725rem;
    font-size: 14px;
    font-weight: 400;
}

.cookie-banner-modal-footer{
    padding: 1rem;
    border: lightgray solid 1px;
}
`,
    script: `const cookies = ["performance", "statistic", "marketing", "functional"];

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

function handleBlockedResources() {
    const blockedElements = document.querySelectorAll("[blocked-by]");

    for (const el of blockedElements) {
        const blockedBy = el.getAttribute("blocked-by");
        if (getCookie(blockedBy) === "true") {
            if (el.hasAttribute("data-type")) {
                const element = document.createElement(el.dataset.type);

                for (let i = 0; i < el.attributes.length; i++) {
                    const attr = el.attributes[i];
                    if (attr.name === "blocked-by") continue;
                    element.setAttribute(attr.name.replace("blocked-", ""), attr.textContent);
                }
                el.replaceWith(element);
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
    const dataFromDb = await ctx.storage.getOne(db_id);
    if (!dataFromDb)
      return;
    if (dataFromDb.data.active) {
      rewriter.on("[blocked-by]", {
        element(el) {
          const data2 = dataFromDb.data;
          if (data2.active) {
            const blockedResource = el.getAttribute("blocked-by");
            if (data2.categories[blockedResource].active) {
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
                  const replacer = rewriter2.transform(data2.html);
                  el.replace(replacer, { html: true });
                  break;
                }
                case "script":
                  el.setAttribute("blocked-src", el.getAttribute("src"));
                  el.setAttribute("data-type", "script");
                  el.removeAttribute("src");
                  break;
                default:
                  break;
              }
            }
          }
        }
      });
    }
  });
});
export {
  cookiebanner_plugin_default as default
};
