"""Membership confirmation emails via Emergent's managed email integration.

Recipients and bodies are decided server-side from the stored membership record
(no caller-supplied recipient/subject/HTML). Failures are logged and never fail
the membership submission itself.
"""
import ipaddress
import logging
import os
import re
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

import httpx

logger = logging.getLogger(__name__)

# Emergent managed email proxy — constant on purpose (survives deployment).
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
TEAM_EMAIL = os.environ["TEAM_EMAIL"]

# ---------------------------------------------------------------------------
# Guardrail gate (structural check for forms / credential asks / link hygiene)
# ---------------------------------------------------------------------------
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} ≠ real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    """Send one email. Returns the provider id, or None if sending failed."""
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if EMAIL_REPLY_TO:
        payload["contact_email"] = EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error("Email send failed: %s %s", e.response.status_code, e.response.text)
    except Exception as e:  # noqa: BLE001
        logger.error("Email send error: %s", e)
    return None


# ---------------------------------------------------------------------------
# Templates (server-side; all interpolation escaped)
# ---------------------------------------------------------------------------
TIER_LABELS = {
    "bronze": ("Bronze", "$50 Million"),
    "silver": ("Silver", "$250 Million"),
    "gold": ("Gold", "$500 Million"),
    "diamond": ("Diamond", "$1 Billion"),
    "platinum": ("Platinum", "$10 Billion"),
}
REGION_LABELS = {
    "europe": "Europe",
    "united_states": "United States",
    "algeria": "Algeria",
    "middle_east_gulf": "Middle East–Gulf",
    "brics": "BRICS Countries",
    "africa": "Africa",
}


def _rows(pairs: list[tuple[str, str]]) -> str:
    return "".join(
        f'<tr><td style="padding:6px 12px;color:#8B98A9;font-size:12px;text-transform:uppercase;'
        f'letter-spacing:1px;white-space:nowrap">{escape(k)}</td>'
        f'<td style="padding:6px 12px;color:#F3F4F6;font-size:14px">{escape(v)}</td></tr>'
        for k, v in pairs
    )


def _shell(title: str, intro: str, pairs: list[tuple[str, str]], outro: str) -> str:
    return (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="background:#050A10;padding:24px 0;font-family:Georgia,\'Times New Roman\',serif">'
        '<tr><td align="center">'
        '<table role="presentation" width="560" cellpadding="0" cellspacing="0" '
        'style="max-width:560px;background:#0B131E;border:1px solid #D4AF37;border-radius:12px">'
        '<tr><td style="padding:28px 28px 8px;text-align:center">'
        '<div style="color:#D4AF37;font-size:26px;font-weight:bold;letter-spacing:2px">NESU</div>'
        '<div style="color:#8B98A9;font-size:11px;letter-spacing:2px">NUR ENERGY SETTLEMENT UNIT</div>'
        f'<div style="color:#F3F4F6;font-size:20px;margin-top:18px">{escape(title)}</div>'
        '</td></tr>'
        f'<tr><td style="padding:8px 28px;color:#E5E7EB;font-size:14px;line-height:22px;'
        f'font-family:Arial,sans-serif">{intro}</td></tr>'
        '<tr><td style="padding:8px 16px">'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="background:#111A26;border-radius:8px;font-family:Arial,sans-serif">{_rows(pairs)}</table>'
        '</td></tr>'
        f'<tr><td style="padding:8px 28px 20px;color:#E5E7EB;font-size:14px;line-height:22px;'
        f'font-family:Arial,sans-serif">{outro}</td></tr>'
        '<tr><td style="padding:14px 28px 24px;border-top:1px solid #1F2937;color:#8B98A9;'
        'font-size:11px;line-height:17px;font-family:Arial,sans-serif">'
        f'Sent by {escape(EMAIL_FROM_NAME)} — a research &amp; policy initiative of Digital-UNI AI Labs. '
        'NESU is not an investment product, security, or currently operating financial instrument. '
        'Membership requests are subject to review and a signed agreement; no funds are collected in the app. '
        'We never ask for passwords or payment details by email.'
        '</td></tr></table></td></tr></table>'
    )


def _pairs(m: dict) -> list[tuple[str, str]]:
    tier_name, tier_amount = TIER_LABELS.get(m["tier"], (m["tier"], ""))
    pairs = [
        ("Request ID", m["id"]),
        ("Membership tier", f"{tier_name} Membership — {tier_amount}"),
        ("Name", m["name"]),
        ("Institution", m["institution"]),
        ("Country", m["country"]),
        ("Region", REGION_LABELS.get(m["region"], m["region"])),
        ("Status", "Pending review"),
    ]
    return pairs


async def send_membership_emails(m: dict) -> None:
    """Confirmation to the applicant + notification to the NESU institutional team."""
    tier_name, _ = TIER_LABELS.get(m["tier"], (m["tier"], ""))
    contact = escape(EMAIL_REPLY_TO or TEAM_EMAIL)

    applicant_html = _shell(
        "Membership request received",
        f"Dear {escape(m['name'])},<br><br>Thank you for requesting <strong>{escape(tier_name)} Membership</strong> "
        f"of the NESU initiative on behalf of <strong>{escape(m['institution'])}</strong>. "
        "Your request has been recorded with the details below.",
        _pairs(m),
        "Our institutional team will review your request and contact you at this address to complete "
        "the membership agreement. Membership fees are settled by wire transfer under that signed agreement — "
        f"nothing is charged through the app.<br><br>Questions? Reply to this email or write to "
        f'<a href="mailto:{contact}" style="color:#D4AF37">{contact}</a>.',
    )
    await send_email(
        to=m["email"],
        subject=f"NESU — your {tier_name} Membership request has been received",
        html=applicant_html,
    )

    team_pairs = _pairs(m) + [("Applicant email", m["email"])]
    if m.get("message"):
        team_pairs.append(("Message", m["message"]))
    team_html = _shell(
        "New membership request",
        f"A new <strong>{escape(tier_name)} Membership</strong> request was submitted through the NESU app.",
        team_pairs,
        "Follow up with the applicant to complete the review and the membership agreement.",
    )
    await send_email(
        to=TEAM_EMAIL,
        subject=f"[NESU] New {tier_name} Membership request — {m['institution']}",
        html=team_html,
    )
