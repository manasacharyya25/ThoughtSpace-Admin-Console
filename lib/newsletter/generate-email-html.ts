import type { NewsletterState } from "@/types/newsletter";

/** ThoughtSpace landing page typography — Plus Jakarta Sans */
const FONT = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const TEXT = "#1C1D1E";
const TEXT_BODY = "rgba(28, 29, 30, 0.65)";
const TEXT_MUTED = "rgba(28, 29, 30, 0.45)";
const TEXT_SECONDARY = "rgba(28, 29, 30, 0.55)";
const ACCENT = "#2F9CFA";
const BG = "#FAF8F5";
const BORDER = "rgba(28, 29, 30, 0.08)";

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** URLs are escaped for attribute context only */
function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/'/g, "&#39;");
}

export function generateEmailHTML(state: NewsletterState): string {
  const e = escapeHtml;
  const a = escapeAttr;

  let articlesHTML = "";
  state.articles.forEach((art, index) => {
    articlesHTML += `
                <!-- Article Card ${index + 1} -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 16px; border: 1px solid rgba(28,29,30,0.06); margin-bottom: 24px; overflow: hidden; box-shadow: 0 4px 15px rgba(28,29,30,0.02);">
                    <tr>
                        <td align="center" style="padding: 0;">
                            <img src="${a(art.imageUrl)}" alt="${e(art.title)}" width="100%" style="width: 100%; max-width: 100%; height: auto; display: block; border-top-left-radius: 16px; border-top-right-radius: 16px; object-fit: cover;"/>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td>
                                        <table border="0" cellpadding="0" cellspacing="0" style="display: inline-block; margin-bottom: 12px;">
                                            <tr>
                                                <td style="background-color: ${art.tagColor}; border-radius: 20px; padding: 3px 10px;">
                                                    <span style="font-family: ${FONT}; font-size: 11px; font-weight: 800; color: ${art.tagTextColor}; letter-spacing: 0.8px; text-transform: uppercase;">
                                                        ${e(art.tag)}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td align="right" valign="middle">
                                        <span style="font-family: ${FONT}; font-size: 11px; color: ${TEXT_MUTED}; font-weight: 500;">
                                            ${e(art.readTime)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding-top: 4px;">
                                        <h3 style="margin: 0 0 8px 0; font-family: ${FONT}; font-size: 18px; font-weight: 800; line-height: 1.25; color: ${TEXT}; letter-spacing: -0.5px;">
                                            ${e(art.title)}
                                        </h3>
                                        <p style="margin: 0 0 18px 0; font-family: ${FONT}; font-size: 14px; line-height: 1.625; font-weight: 500; color: ${TEXT_BODY};">
                                            ${e(art.desc)}
                                        </p>
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="background-color: ${TEXT}; border-radius: 8px;">
                                                    <a href="${a(art.url)}" target="_blank" style="display: inline-block; padding: 10px 18px; font-family: ${FONT}; font-size: 17px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                                        Read Essay →
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            `;
  });

  let promptsHTML = "";
  state.prompts.forEach((prm, index) => {
    promptsHTML += `
                <!-- Prompt Card ${index + 1} -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 16px; border: 1px solid rgba(28,29,30,0.05); box-shadow: 0 8px 20px rgba(28,29,30,0.02); margin-bottom: 16px;">
                    <tr>
                        <td style="padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td valign="top" width="40" style="width: 40px;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="background-color: ${prm.color}; border-radius: 50%;">
                                            <tr>
                                                <td align="center" valign="middle" style="width: 40px; height: 40px; font-family: ${FONT}; font-size: 13px; font-weight: 800; color: #ffffff;">
                                                    ${e(prm.initials)}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td valign="top" style="padding-left: 14px;">
                                        <p style="margin: 0 0 4px 0; font-family: ${FONT}; font-size: 11px; font-weight: 800; color: ${prm.color}; letter-spacing: 1.5px; text-transform: uppercase;">
                                            ${e(prm.num)}
                                        </p>
                                        <p style="margin: 0 0 12px 0; font-family: ${FONT}; font-size: 13px; line-height: 1.625; font-weight: 500; color: ${TEXT};">
                                            "${e(prm.text)}"
                                        </p>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td valign="middle">
                                                    <span style="font-family: ${FONT}; font-size: 11px; font-weight: 500; color: ${TEXT_MUTED};">
                                                        ${e(prm.time)}
                                                    </span>
                                                </td>
                                                <td align="right" valign="middle">
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="background-color: ${prm.tagColor}; border-radius: 20px; padding: 2px 8px;">
                                                                <span style="font-family: ${FONT}; font-size: 10px; font-weight: 700; color: ${prm.tagTextColor};">
                                                                    ${e(prm.tag)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            `;
  });

  const rec = state.recommendation;
  const cta = state.community;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>ThoughtSpace Newsletter</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" type="text/css"/>
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            font-family: ${FONT};
            color: ${TEXT};
            background-color: ${BG};
            -webkit-font-smoothing: antialiased;
        }
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; padding: 12px !important; }
            .hero-title { font-size: 28px !important; line-height: 1.08 !important; letter-spacing: -1.5px !important; }
            .hero-subhead { font-size: 13px !important; }
            .content-padding { padding-left: 16px !important; padding-right: 16px !important; }
            .rec-cell { display: block !important; width: 100% !important; padding-left: 0 !important; }
            .rec-img-cell { display: block !important; width: 100% !important; margin-bottom: 16px !important; }
            .landing-cta { font-size: 12px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${BG}; font-family: ${FONT}; -webkit-font-smoothing: antialiased;">

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${BG}; min-height: 100vh;">
        <tr>
            <td align="center" valign="top" style="padding: 40px 12px;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%;">
                    <tr>
                        <td align="center" style="padding-bottom: 35px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="left" valign="middle">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding-right: 10px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" style="background-color: ${TEXT}; border-radius: 8px;">
                                                        <tr>
                                                            <td style="padding: 6px 8px;">
                                                                <img src="https://thoughtspace.online/favicon.ico" alt="Logo" width="18" height="18" style="display: block; border-radius: 2px;"/>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td>
                                                    <span style="font-family: ${FONT}; font-size: 20px; font-weight: 800; color: ${TEXT}; letter-spacing: -0.5px;">thoughtspace<span style="color: ${ACCENT};">.</span></span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td align="right" valign="middle">
                                        <span style="font-family: ${FONT}; font-size: 11px; font-weight: 800; color: ${TEXT_SECONDARY}; background-color: rgba(28, 29, 30, 0.06); padding: 5px 12px; border-radius: 30px; letter-spacing: 1.5px; text-transform: uppercase;">
                                            ISSUE #${e(state.issueNum)} &bull; ${e(state.issueDate)}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 10px 0 30px 0;">
                            <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center" style="background-color: #ffffff; border: 1px solid ${BORDER}; border-radius: 50px; padding: 7px 16px; box-shadow: 0 4px 10px rgba(28,29,30,0.03);">
                                        <span style="font-size: 11px; font-family: ${FONT}; font-weight: 800; color: ${ACCENT}; letter-spacing: 1.5px; text-transform: uppercase;">
                                            ${e(state.badgeText)}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                            <h1 class="hero-title" style="margin: 0; padding: 0; font-family: ${FONT}; font-size: 39px; font-weight: 800; line-height: 1.08; color: ${TEXT}; text-align: center; letter-spacing: -2px;">
                                ${e(state.heroHeadlineBlack)}<br />
                                <span style="color: ${ACCENT};">${e(state.heroHeadlineBlue)}</span>
                            </h1>
                            <p class="hero-subhead" style="margin: 20px auto 10px auto; font-family: ${FONT}; font-size: 13px; line-height: 1.625; font-weight: 500; color: ${TEXT_BODY}; text-align: center; max-width: 500px;">
                                ${e(state.introText)}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px 0;">
                            <hr style="border: 0; border-top: 1px solid ${BORDER}; margin: 0;"/>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 12px;">
                            <h2 style="margin: 0 0 20px 0; font-family: ${FONT}; font-size: 11px; font-weight: 800; color: ${TEXT_MUTED}; letter-spacing: 1.5px; text-transform: uppercase; text-align: center;">
                                📚 Read
                            </h2>
                            ${articlesHTML}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px 0;">
                            <hr style="border: 0; border-top: 1px solid ${BORDER}; margin: 0;"/>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 12px;">
                            <h2 style="margin: 0 0 20px 0; font-family: ${FONT}; font-size: 11px; font-weight: 800; color: ${TEXT_MUTED}; letter-spacing: 1.5px; text-transform: uppercase; text-align: center;">
                                💭 Reflect
                            </h2>
                            ${promptsHTML}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px 0;">
                            <hr style="border: 0; border-top: 1px solid ${BORDER}; margin: 0;"/>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 12px;">
                            <h2 style="margin: 0 0 20px 0; font-family: ${FONT}; font-size: 11px; font-weight: 800; color: ${TEXT_MUTED}; letter-spacing: 1.5px; text-transform: uppercase; text-align: center;">
                                🎧 Discover
                            </h2>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 16px; border: 1px solid rgba(28,29,30,0.06); box-shadow: 0 4px 15px rgba(28,29,30,0.02); overflow: hidden;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td valign="top" width="130" class="rec-img-cell" style="width: 130px;">
                                                    <img src="${a(rec.imageUrl)}" alt="${e(rec.title)}" width="130" style="width: 130px; border-radius: 8px; box-shadow: 0 4px 12px rgba(28,29,30,0.08); display: block;"/>
                                                </td>
                                                <td valign="top" class="rec-cell" style="padding-left: 20px;">
                                                    <span style="font-family: ${FONT}; font-size: 11px; font-weight: 800; color: ${ACCENT}; letter-spacing: 1.5px; text-transform: uppercase;">
                                                        ${e(rec.type)}
                                                    </span>
                                                    <h3 style="margin: 4px 0 2px 0; font-family: ${FONT}; font-size: 18px; font-weight: 800; color: ${TEXT}; letter-spacing: -0.5px;">
                                                        ${e(rec.title)}
                                                    </h3>
                                                    <p style="margin: 0 0 10px 0; font-family: ${FONT}; font-size: 13px; color: ${TEXT_SECONDARY}; font-weight: 600;">
                                                        by ${e(rec.creator)}
                                                    </p>
                                                    <p style="margin: 0 16px 16px 0; font-family: ${FONT}; font-size: 13px; line-height: 1.625; font-weight: 500; color: ${TEXT_BODY};">
                                                        ${e(rec.desc)}
                                                    </p>
                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="background-color: ${TEXT}; border-radius: 8px;">
                                                                <a href="${a(rec.url)}" target="_blank" class="landing-cta" style="display: inline-block; padding: 10px 18px; font-family: ${FONT}; font-size: 17px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                                                    ${e(rec.buttonText)}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 24px 0;">
                            <hr style="border: 0; border-top: 1px solid ${BORDER}; margin: 0;"/>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <h2 style="margin: 0 0 20px 0; font-family: ${FONT}; font-size: 11px; font-weight: 800; color: ${TEXT_MUTED}; letter-spacing: 1.5px; text-transform: uppercase; text-align: center;">
                                💬 Discuss
                            </h2>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${TEXT}; border-radius: 16px; box-shadow: 0 10px 30px rgba(28, 29, 30, 0.15); overflow: hidden;">
                                <tr>
                                    <td style="padding: 30px; text-align: center;">
                                        <h3 style="margin: 0 0 10px 0; font-family: ${FONT}; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                                            ${e(cta.title)}
                                        </h3>
                                        <p style="margin: 0 0 22px 0; font-family: ${FONT}; font-size: 14px; line-height: 1.625; font-weight: 500; color: rgba(255,255,255,0.65); max-width: 440px; margin-left: auto; margin-right: auto;">
                                            ${e(cta.desc)}
                                        </p>
                                        <table border="0" cellpadding="0" cellspacing="0" align="center">
                                            <tr>
                                                <td style="background-color: ${ACCENT}; border-radius: 50px;">
                                                    <a href="${a(cta.url)}" target="_blank" class="landing-cta" style="display: inline-block; padding: 12px 28px; font-family: ${FONT}; font-size: 17px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 50px;">
                                                        ${e(cta.buttonText)}
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 25px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background-color: #d1fae5; border-radius: 50px; padding: 6px 16px;">
                                        <span style="font-family: ${FONT}; font-size: 10px; font-weight: 800; color: #065f46; letter-spacing: 0.5px;">
                                            👥 Anonymous · 1-to-1 dialogues only
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 5px 0 35px 0;">
                            <span style="font-family: ${FONT}; font-size: 9px; font-weight: 700; color: ${TEXT_MUTED}; letter-spacing: 0.8px; text-transform: uppercase;">
                                🛡️ No profiles &bull; No pressure &bull; Just inquiry
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="border-top: 1px solid ${BORDER}; padding-top: 24px;">
                            <p style="margin: 0 0 8px 0; font-family: ${FONT}; font-size: 9px; line-height: 1.5; font-weight: 500; color: ${TEXT_MUTED}; text-align: center;">
                                &copy; 2026 Registered Thought Space. All rights reserved.
                            </p>
                            <p style="margin: 0; font-family: ${FONT}; font-size: 9px; font-weight: 500; color: ${TEXT_MUTED}; text-align: center;">
                                You are receiving this because you signed up for early access updates.<br />
                                <a href="#" style="color: ${ACCENT}; font-weight: 600; text-decoration: underline;">Unsubscribe</a> or <a href="https://thoughtspace.online/about-us" style="color: ${ACCENT}; font-weight: 600; text-decoration: underline;">About Us</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
