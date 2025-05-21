import type en from "./en";

export default {
	action: {
		save: "Speichern",
		saveAndClose: "Speichern und Schließen",
		no: "Nein",
		yes: "Ja",
		create: {
			option: "Option erstellen",
			cookie_category: "Cookie-kategorie erstellen",
			selector: "Selektor erstellen",
		},
	},
	modal: {
		delete: {
			title: "{name} löschen",
			description:
				"Bist du dir sicher dass du diese/s {name} löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden",
		},
	},
	input: {
		label: {
			enabled: "Aktiviert",
			label: "Name",
			description: "Beschreibung",
			selector: "Selektor",
			placeholder_html: "Platzhalter HTML",
		},
		hint: {
			placeholder_html:
				"Elemente, die von dieser Cookie Kategorie blockiert wurden, werden durch dieses HTML ersetzt",
		},
	},
	cookie_category: "Cookie Kategorie",
	selector: "Selektor",
	selectors: "Selektoren",
	hint: {
		selectors:
			"Diese Selektoren geben an, welche elemente von dieser Cookie Kategorie blockiert werden",
	},
} satisfies typeof en;
