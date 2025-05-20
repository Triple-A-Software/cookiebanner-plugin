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
		},
	},
	cookie_category: "Cookie Kategorie",
} satisfies typeof en;
