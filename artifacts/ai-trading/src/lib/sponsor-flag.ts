/**
 * Master toggle for SOLID PRIME / PT Solid Gold Berjangka sponsorship UI.
 *
 * The legal sponsorship agreement has been signed, so all sponsor-
 * branded surfaces (splash footer, landing CTA, dashboard live banner,
 * profile demo-account card, footer attribution, legal disclosure
 * paragraphs, etc.) are visible.
 *
 * Set this back to `false` to hide every sponsor surface in one place
 * if the agreement is ever paused or terminated — the UI is left in
 * the codebase and gated on this flag, so no re-implementation is
 * needed to toggle visibility.
 */
export const SHOW_SPONSOR = true;
