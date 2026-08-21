import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync("app.js", "utf8");
const html = readFileSync("index.html", "utf8");
const css = readFileSync("styles.css", "utf8");
const fieldPolishCss = readFileSync("field-polish.css", "utf8");

function has(source, pattern, message) {
  assert.match(source, pattern, message);
}

function mediaBlock(maxWidth) {
  const start = css.indexOf(`@media (max-width: ${maxWidth}px)`);
  assert.notEqual(start, -1, `missing ${maxWidth}px responsive block`);
  const next = css.indexOf("@media", start + 1);
  return css.slice(start, next === -1 ? css.length : next);
}

const tablet = mediaBlock(980);
const phone = mediaBlock(720);
const narrowPhone = mediaBlock(430);
const desktop = css.slice(0, css.indexOf("@media"));

function ruleBlock(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`${escaped}\\s*\\{[\\s\\S]*?\\}`));
  assert.ok(match, `missing rule for ${selector}`);
  return match[0];
}

const desktopTopbar = ruleBlock(desktop, ".topbar");
const desktopTopbarActions = ruleBlock(desktop, ".topbar-actions");
const desktopCollapsibleSummary = ruleBlock(desktop, ".collapsible-field-summary");

has(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/, "mobile viewport meta is required");

has(desktopTopbar, /justify-content: space-between;/, "desktop topbar should keep desktop spacing");
has(desktopTopbar, /align-items: center;/, "desktop topbar should stay horizontally centered");
has(desktopTopbar, /gap: 18px;/, "desktop topbar should keep desktop gap");
has(desktopTopbar, /margin: 0 0 22px;/, "desktop topbar should not use mobile negative margins");
has(desktopTopbar, /padding: 0;/, "desktop topbar should not use mobile compact padding");
assert.doesNotMatch(desktopTopbar, /justify-content: flex-start|align-items: stretch|background: var\(--bg\)|border-bottom:/, "mobile topbar treatment must not leak into desktop");
has(desktopTopbarActions, /display: flex;/, "desktop topbar actions should remain flex-based");
has(desktopTopbarActions, /flex-wrap: wrap;/, "desktop topbar actions can wrap without using mobile grid");
assert.doesNotMatch(desktopTopbarActions, /display: grid|grid-template-columns:/, "mobile topbar action grid must not leak into desktop");
has(desktop, /\.onboarding-panel-header > div \{[\s\S]*?flex: 1 1 auto;[\s\S]*?min-width: 0;/, "desktop onboarding copy should take the remaining header space instead of collapsing beside the action");
has(desktop, /\.onboarding-tour-button \{[\s\S]*?width: auto;[\s\S]*?white-space: nowrap;/, "desktop onboarding tour button should stay compact instead of consuming the header width");
has(desktopCollapsibleSummary, /display: flex;/, "desktop collapsible section headers should keep the browser layout");
has(desktopCollapsibleSummary, /padding: 14px;/, "desktop collapsible section headers should keep their existing padding");
assert.doesNotMatch(desktopCollapsibleSummary, /padding: 18px 22px|grid-template-columns:/, "mobile collapsible spacing must not leak into desktop");
has(fieldPolishCss, /\.collapsible-field-summary \{[\s\S]*?padding: 14px 28px;/, "field polish should keep browser section header text away from card edges");
has(fieldPolishCss, /@media \(max-width: 720px\) \{[\s\S]*?\.collapsible-field-summary,[\s\S]*?\.section-heading \{[\s\S]*?padding-right: 26px;[\s\S]*?padding-left: 26px;/, "field polish mobile override should preserve section header side padding");
has(css, /\.customer-search \{[\s\S]*?z-index: 50;/, "customer search should remain layered above normal content");
has(css, /\.settings-menu \{[\s\S]*?z-index: 40;/, "closed settings button should stay below customer search results");
has(css, /\.settings-menu:has\(\.settings-popover:not\(\[hidden\]\)\) \{[\s\S]*?z-index: 120;/, "open settings menu should layer above customer search");
has(css, /\.settings-popover \{[\s\S]*?z-index: 140;/, "settings popover should layer above customer search results");

has(tablet, /\.app-shell \{[\s\S]*?grid-template-columns: 1fr;[\s\S]*?height: auto;[\s\S]*?overflow: visible;/, "tablet shell must collapse to one column without fixed scrolling");
has(css, /\.topbar-actions \{[\s\S]*?flex-wrap: wrap;[\s\S]*?justify-content: flex-end;[\s\S]*?z-index: 2;/, "topbar actions should wrap above the title layer instead of overlapping it");
has(tablet, /\.topbar \{[\s\S]*?flex-wrap: wrap;/, "tablet topbar should wrap before controls overlap text");
has(tablet, /\.sidebar \{[\s\S]*?position: sticky;[\s\S]*?height: auto;[\s\S]*?overflow-x: auto;[\s\S]*?overflow-y: visible;/, "tablet sidebar should become a horizontal rail");
has(tablet, /\.workspace \{[\s\S]*?height: auto;[\s\S]*?overflow-y: visible;/, "tablet workspace should let the page own scrolling");
has(tablet, /\.job-summary-bar,[\s\S]*?\.portal-payment-form,[\s\S]*?\.inventory-summary \{[\s\S]*?grid-template-columns: 1fr 1fr;/, "tablet dashboard and job cards should use two columns");
has(tablet, /#view-inbox\.active \.work-grid \{[\s\S]*?grid-template-columns: 1fr;[\s\S]*?height: auto;[\s\S]*?min-height: 0;/, "tablet inbox should become a single-column mobile flow");
has(tablet, /#view-inbox\.active \.work-grid \{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?overflow-x: clip;/, "tablet inbox grid should not allow horizontal escape");
has(tablet, /#view-inbox\.active \.job-list \{[\s\S]*?max-height: 360px;[\s\S]*?overflow-y: auto;/, "tablet inbox list should remain usable without squeezing job detail");
has(tablet, /#view-inbox\.active \.detail-panel \{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?overflow-x: clip;/, "tablet selected job detail should stay within the viewport");
has(tablet, /#view-inbox\.active \.job-summary-bar \{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/, "tablet inbox job summary cards should use two clean columns");

has(phone, /html,[\s\S]*?body \{[\s\S]*?overflow-x: hidden;[\s\S]*?overflow-y: auto;/, "phone layout should prevent sideways drift while keeping vertical page scroll");
has(phone, /\.workspace \{[\s\S]*?padding: 10px;[\s\S]*?height: auto;[\s\S]*?min-width: 0;[\s\S]*?overflow-x: hidden;[\s\S]*?overflow-y: visible;/, "phone workspace needs compact padding and must not trap vertical scroll");
has(phone, /\.topbar,[\s\S]*?\.modal-header \{[\s\S]*?flex-direction: column;/, "phone headers should stack instead of squeezing");
has(phone, /\.onboarding-panel-header \{[\s\S]*?display: grid;[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto;[\s\S]*?align-items: center;/, "onboarding header should keep its help action compact beside the copy on phones");
has(phone, /\.onboarding-tour-button \{[\s\S]*?width: auto;[\s\S]*?white-space: nowrap;/, "onboarding tour button should not stretch across a separate full-width row on phones");
has(phone, /\.topbar \{[\s\S]*?align-items: stretch;[\s\S]*?justify-content: flex-start;[\s\S]*?gap: 10px;[\s\S]*?background: var\(--bg\);[\s\S]*?border-bottom: 1px solid/, "phone topbar should be compact and opaque instead of using desktop spacing");
has(phone, /\.topbar-title \{[\s\S]*?flex: 0 0 auto;[\s\S]*?gap: 5px;/, "phone topbar title must not inherit the desktop 280px flex basis");
has(phone, /\.topbar-actions \{[\s\S]*?flex: 0 0 auto;[\s\S]*?display: grid;[\s\S]*?width: 100%;/, "phone topbar actions must not inherit desktop flex sizing");
has(phone, /\.topbar-actions \{[\s\S]*?display: grid;[\s\S]*?width: 100%;[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);[\s\S]*?gap: 8px;/, "phone topbar actions should use a compact two-column action row");
has(phone, /\.topbar-actions \.customer-search \{[\s\S]*?grid-column: 1 \/ -1;/, "phone customer search should span above the action buttons");
has(phone, /\.customer-search-results \{[\s\S]*?position: absolute;[\s\S]*?left: 0;[\s\S]*?right: 0;[\s\S]*?top: calc\(100% \+ 8px\);[\s\S]*?width: 100%;[\s\S]*?overflow-y: auto;/, "phone customer search results should anchor directly under the search input");

has(phone, /\.sidebar \{[\s\S]*?position: sticky;[\s\S]*?z-index: 40;[\s\S]*?border-bottom: 1px solid var\(--sidebar-line\);/, "phone sidebar should remain a compact top rail");
has(phone, /\.nav-list \{[\s\S]*?display: flex;[\s\S]*?overflow-x: auto;[\s\S]*?scrollbar-width: none;/, "phone nav should scroll horizontally");
has(phone, /\.nav-item \{[\s\S]*?flex: 0 0 42px;[\s\S]*?width: 42px;[\s\S]*?height: 42px;/, "phone nav icons should have stable tap targets");
has(narrowPhone, /\.nav-item \{[\s\S]*?flex-basis: 38px;[\s\S]*?width: 38px;[\s\S]*?height: 38px;/, "narrow phones need smaller nav tap targets");
has(narrowPhone, /\.detail-actions \{[\s\S]*?display: block;/, "narrow phones must not re-enable the desktop/grid job action shell");

has(phone, /#view-inbox\.active \.work-grid \{[\s\S]*?height: auto;[\s\S]*?min-height: 0;[\s\S]*?overflow-y: visible;/, "mobile inbox should stop using the desktop split-scroll shell");
has(phone, /#view-inbox\.active \.inbox-panel \{[\s\S]*?position: static;/, "mobile inbox panel should scroll with the page");
has(phone, /#view-inbox\.active \.job-list,[\s\S]*?#view-inbox\.active \.detail-panel \{[\s\S]*?overflow-y: visible;/, "mobile inbox and job detail should not trap scrolling");
has(phone, /\.work-grid\.inbox-collapsed \.inbox-panel \.panel-header > div,[\s\S]*?\.work-grid\.inbox-collapsed \.inbox-panel \.segmented,[\s\S]*?\.work-grid\.inbox-collapsed \.job-list \{[\s\S]*?display: none;/, "collapsed mobile inbox should hide filters and job rows");
has(phone, /\.work-grid\.inbox-collapsed \.inbox-panel \.panel-header \{[\s\S]*?display: grid;[\s\S]*?grid-template-columns: 1fr;[\s\S]*?padding: 10px;/, "collapsed mobile inbox should reduce to a compact header row");
has(phone, /\.work-grid\.inbox-collapsed \.collapse-inbox-button \{[\s\S]*?display: block;[\s\S]*?width: 100%;[\s\S]*?min-height: 44px;[\s\S]*?writing-mode: horizontal-tb;[\s\S]*?transform: none;/, "collapsed inbox control should become a normal full-width button on phones");

has(phone, /\.modal-actions,[\s\S]*?\.inventory-detail-actions \{[\s\S]*?display: grid;[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/, "phone utility action rows should use balanced columns where appropriate");
has(phone, /\.detail-actions \{[\s\S]*?display: block;[\s\S]*?max-width: 100%;[\s\S]*?overflow: hidden;/, "phone job detail actions should use a dedicated mobile surface instead of the desktop toolbar");
has(phone, /\.desktop-job-actions \{[\s\S]*?display: none;/, "phone layout should hide the desktop job action toolbar");
has(phone, /\.mobile-job-actions \{[\s\S]*?display: grid;[\s\S]*?width: 100%;[\s\S]*?max-width: min\(100%, calc\(100vw - 44px\)\);[\s\S]*?border: 1px solid var\(--line\);/, "phone layout should render a bounded mobile job action card");
has(phone, /\.mobile-primary-actions \{[\s\S]*?display: grid;[\s\S]*?grid-template-columns: 1fr;/, "phone primary job actions should stack as a mobile-first command list");
has(phone, /\.detail-actions \.action-button \{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?min-height: 42px;[\s\S]*?text-overflow: ellipsis;/, "phone job action buttons should fit their grid cells");
has(phone, /\.job-action-menu-trigger \{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?text-overflow: ellipsis;/, "phone more-actions trigger should fit its grid cell");
has(phone, /\.job-action-menu-panel \{[\s\S]*?grid-column: 1 \/ -1;[\s\S]*?width: 100%;[\s\S]*?grid-template-columns: 1fr;/, "phone more-actions panel should open full-width inside the action grid");
has(phone, /\.job-summary-bar \{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?grid-template-columns: 1fr;[\s\S]*?overflow: hidden;/, "phone job summary cards should stack inside the panel");
has(phone, /\.modal-card \{[\s\S]*?width: calc\(100vw - 20px\);[\s\S]*?max-height: calc\(100svh - 20px\);[\s\S]*?overflow-y: auto;/, "phone modals should stay scrollable inside the viewport");
has(phone, /\.onboarding-step \{[\s\S]*?grid-template-columns: 1fr;[\s\S]*?align-items: stretch;/, "phone onboarding steps should stack cleanly instead of squeezing instructions and actions");
has(phone, /\.onboarding-step \.primary-button \{[\s\S]*?width: 100%;/, "phone onboarding actions should fill the available width");
has(css, /\.onboarding-current \{[\s\S]*?padding: 16px;/, "onboarding copy should not sit against the panel edge");
has(css, /\.onboarding-tour-list li \{[\s\S]*?padding: 16px;/, "quick tour rows should have consistent breathing room");
has(phone, /\.job-row \{[\s\S]*?padding: 12px;/, "phone inbox rows should use compact card padding");
has(phone, /\.job-row-top,[\s\S]*?\.job-row-bottom \{[\s\S]*?align-items: flex-start;[\s\S]*?justify-content: flex-start;/, "phone inbox row metadata should not collide");
has(phone, /\.detail-panel,[\s\S]*?\.detail-panel\.panel,[\s\S]*?#view-inbox\.active \.detail-panel \{[\s\S]*?overflow-x: clip;[\s\S]*?overflow-y: visible;/, "phone selected job detail should clip sideways overflow while allowing vertical page scrolling");
has(phone, /\.job-sticky-header,[\s\S]*?\.detail-title,[\s\S]*?\.job-summary-bar \{[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?overflow-x: clip;/, "phone job header and summary should stay inside the visible panel");
has(phone, /\.collapsible-field-summary \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto;[\s\S]*?gap: 10px 16px;[\s\S]*?padding: 18px 22px;/, "phone collapsible section headers should keep text away from card edges");
has(phone, /\.collapsible-field-summary strong,[\s\S]*?\.collapsible-field-summary small \{[\s\S]*?overflow-wrap: anywhere;/, "phone collapsible section text should wrap inside the panel");
has(narrowPhone, /\.collapsible-field-summary \{[\s\S]*?grid-template-columns: 1fr;[\s\S]*?padding: 16px 18px;/, "narrow phone collapsible section headers should stack when status labels would crowd text");
has(phone, /\.dispatch-brief-grid \{[\s\S]*?grid-template-columns: 1fr;/, "phone dispatch brief cards should stack in one readable column");
has(phone, /\.dispatch-brief-card strong,[\s\S]*?\.dispatch-brief-card small \{[\s\S]*?overflow: visible;[\s\S]*?overflow-wrap: anywhere;/, "phone dispatch brief text should wrap instead of clipping");
has(phone, /\.message-thread-panel \{[\s\S]*?height: auto;[\s\S]*?max-height: none;[\s\S]*?overflow: visible;/, "phone message panel should not trap page scrolling");
has(phone, /\.message-thread \{[\s\S]*?max-height: 360px;[\s\S]*?overflow-y: auto;/, "phone message history should scroll inside a bounded thread area");
has(phone, /\.message-thread \{[\s\S]*?overflow-x: hidden;[\s\S]*?width: 100%;[\s\S]*?max-width: 100%;[\s\S]*?min-width: 0;/, "phone message history should wrap within the viewport instead of requiring sideways swipe");
has(css, /\.message-bubble \{[\s\S]*?max-width: min\(100%, 680px\);[\s\S]*?overflow-wrap: anywhere;[\s\S]*?word-break: break-word;/, "message bubbles should wrap long customer text and links");
has(css, /\.portal-message p \{[\s\S]*?overflow-wrap: anywhere;[\s\S]*?word-break: break-word;/, "customer portal messages should wrap long text and links");
has(phone, /\.invoice-line-header \{[\s\S]*?display: none;/, "phone invoice rows should stop pretending to be a desktop table");
has(phone, /\.invoice-line-row,[\s\S]*?\.pricebook-row,[\s\S]*?\.payment-ledger-list \.invoice-line-row \{[\s\S]*?grid-template-columns: 1fr;[\s\S]*?align-items: stretch;/, "phone billing rows should stack as cards");
has(phone, /\.task-form,[\s\S]*?\.task-row,[\s\S]*?\.communication-row,[\s\S]*?\{[\s\S]*?grid-template-columns: 1fr;/, "phone task form and task rows should stack instead of using desktop columns");
has(phone, /\.job-summary-card,[\s\S]*?\.summary-value-button,[\s\S]*?\.task-row > span,[\s\S]*?\.task-row strong,[\s\S]*?\.task-row small \{[\s\S]*?overflow-wrap: anywhere;/, "phone task text should wrap inside the card");
has(phone, /\.task-form input,[\s\S]*?\.task-form select,[\s\S]*?\.task-form button,[\s\S]*?\.task-check \{[\s\S]*?width: 100%;[\s\S]*?min-width: 0;/, "phone task controls should fit inside the task card");

has(phone, /\.portal-payment-link,[\s\S]*?\.portal-payment-form,[\s\S]*?\.portal-section-header,[\s\S]*?\.portal-file-row,[\s\S]*?\.customer-timeline-event \{[\s\S]*?grid-template-columns: 1fr;/, "portal panels should collapse to one column");
has(phone, /\.portal-payment-link-button \{[\s\S]*?width: 100%;[\s\S]*?min-width: 0;/, "portal payment link button should fit the phone width");
has(phone, /\.portal-section-header > \.pill \{[\s\S]*?justify-self: start;/, "portal section badges should stay compact on phones");
has(phone, /\.portal-file-actions \{[\s\S]*?justify-content: stretch;[\s\S]*?width: 100%;/, "portal file actions should be reachable on phones");
has(phone, /\.portal-file-actions \.utility-button \{[\s\S]*?flex: 1 1 128px;/, "portal file buttons should share available phone width");
has(phone, /\.approval-actions,[\s\S]*?\.inventory-detail-actions \{[\s\S]*?display: grid;[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/, "approval decision actions should use balanced phone columns");
has(narrowPhone, /\.approval-actions,[\s\S]*?\.inventory-detail-actions \{[\s\S]*?grid-template-columns: 1fr;/, "approval decision actions should stack on very narrow phones");
has(css, /\.signature-pad-panel canvas \{[\s\S]*?width: 100%;[\s\S]*?touch-action: none;/, "signature canvas must support touch signing");

has(app, /data-tech-job-action="start"/, "technician start action should remain available");
has(app, /data-tech-job-action="complete"/, "technician complete action should remain available");
has(app, /data-tech-job-action="open"/, "technician open-job action should remain available");
has(app, /function customerPortalNextStep\(/, "customer portal should still explain the next step");
has(app, /data-portal-view-file/, "customer portal file viewing should remain available");
has(app, /data-portal-download-file/, "customer portal file downloading should remain available");
has(app, /data-signature-pad/, "approval page should keep the signature pad");

console.log("Mobile readiness contracts passed");
