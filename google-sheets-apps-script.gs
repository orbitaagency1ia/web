const SHEET_ID = "1y8YOQaBlJkbnomZSTL2Ioi8Vo3pytLw63MivpFOiF9Y";
const SHEET_NAME = "Leads";
const NOTIFY_EMAILS = ["contacto@orbitaagency.com"];

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, service: "orbita-leads-webhook" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "missing_post_data" });
    }

    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    ensureHeaders(sheet);

    const row = [
      new Date(),
      data.source || "",
      data.sector || "",
      data.name || "",
      data.company || "",
      data.email || "",
      data.phone || "",
      data.channel || "",
      data.goal || "",
      data.consent || "",
      data.createdAt || ""
    ];

    sheet.appendRow(row);

    let notifyOk = true;
    let notifyError = "";
    try {
      sendNotificationEmail(data);
    } catch (notifyErr) {
      notifyOk = false;
      notifyError = String(notifyErr);
    }

    return jsonResponse({ ok: true, notifyOk, notifyError });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    "timestamp",
    "source",
    "sector",
    "name",
    "company",
    "email",
    "phone",
    "channel",
    "goal",
    "consent",
    "createdAt"
  ]);
}

function sendNotificationEmail(data) {
  if (!NOTIFY_EMAILS.length) return;

  const to = NOTIFY_EMAILS.join(",");
  const subject = `Nuevo lead Órbita - ${data.company || data.sector || "empresa"}`;
  const now = new Date();
  const tz = Session.getScriptTimeZone() || "Europe/Madrid";
  const stamp = Utilities.formatDate(now, tz, "dd/MM/yyyy HH:mm");
  const leadEmail = String(data.email || "").trim();
  const leadPhone = String(data.phone || "").trim();
  const leadPhoneHref = leadPhone.replace(/\s+/g, "");

  const plainBody = [
    "Nuevo lead recibido",
    "",
    `Fecha: ${stamp}`,
    `Origen: ${data.source || ""}`,
    `Sector: ${data.sector || ""}`,
    `Nombre: ${data.name || ""}`,
    `Empresa: ${data.company || ""}`,
    `Email: ${leadEmail || ""}`,
    `Teléfono: ${leadPhone || ""}`,
    `Canal: ${data.channel || ""}`,
    "",
    "Objetivo:",
    data.goal || ""
  ].join("\n");

  const htmlBody = `
    <div style="margin:0;padding:24px;background:#f2f5fb;font-family:Inter,Arial,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#0a1020;border:1px solid #223150;border-radius:18px;overflow:hidden;">
        <tr>
          <td style="padding:18px 22px;border-bottom:1px solid #1f2f4d;background:linear-gradient(140deg,#0f1b33,#0c1528);">
            <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#89c0ff;font-weight:700;">Nuevo lead Órbita</p>
            <h2 style="margin:8px 0 0;font-size:22px;line-height:1.2;color:#f4f8ff;">${escapeHtml(data.company || data.name || "Nuevo contacto")}</h2>
            <p style="margin:8px 0 0;color:#9fb7db;font-size:13px;">Recibido el ${escapeHtml(stamp)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 22px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#8fa8cd;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Nombre</td>
                <td style="padding:8px 0;color:#f2f7ff;font-weight:600;text-align:right;">${escapeHtml(data.name || "-")}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#8fa8cd;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Empresa</td>
                <td style="padding:8px 0;color:#f2f7ff;font-weight:600;text-align:right;">${escapeHtml(data.company || "-")}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#8fa8cd;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Canal</td>
                <td style="padding:8px 0;color:#f2f7ff;font-weight:600;text-align:right;">${escapeHtml(data.channel || "-")}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#8fa8cd;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Origen</td>
                <td style="padding:8px 0;color:#f2f7ff;font-weight:600;text-align:right;">${escapeHtml(data.source || "-")}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#8fa8cd;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Sector</td>
                <td style="padding:8px 0;color:#f2f7ff;font-weight:600;text-align:right;">${escapeHtml(data.sector || "-")}</td>
              </tr>
            </table>

            <div style="margin-top:16px;padding:14px;border:1px solid #243556;border-radius:12px;background:#0e172a;">
              <p style="margin:0 0 8px;color:#8fa8cd;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Objetivo principal</p>
              <p style="margin:0;color:#f2f7ff;line-height:1.45;">${escapeHtml(data.goal || "-")}</p>
            </div>

            <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">
              ${
                leadEmail
                  ? `<a href="mailto:${escapeHtml(leadEmail)}" style="display:inline-block;padding:10px 14px;border-radius:999px;background:#7cd9ff;color:#061325;text-decoration:none;font-weight:700;">Responder por email</a>`
                  : ""
              }
              ${
                leadPhoneHref
                  ? `<a href="tel:${escapeHtml(leadPhoneHref)}" style="display:inline-block;padding:10px 14px;border-radius:999px;border:1px solid #3a537d;color:#dcebff;text-decoration:none;font-weight:700;">Llamar ahora</a>`
                  : ""
              }
            </div>
          </td>
        </tr>
      </table>
    </div>
  `;

  const options = { name: "Órbita Leads", htmlBody };
  if (leadEmail) options.replyTo = leadEmail;
  MailApp.sendEmail(to, subject, plainBody, options);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
