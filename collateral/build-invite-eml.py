#!/usr/bin/env python3
"""Build a ready-to-send invitation .eml for manual sending from Outlook.

Used while a sender domain isn't verified in MailerSend (e.g. 5v5sports.com
for ISI / mixed invites). Mirrors app/api/send-invite/route.ts: same
template, same team-row markup, same subject lines and FAQ attachments.
The header image is embedded inline (cid) so Outlook renders it without
"download pictures". Open the .eml in desktop Outlook, review, hit Send.

Usage (from the repo root):
  python3 collateral/build-invite-eml.py out.eml \
    --org "Org Name" --to coach@example.com [--cc a@x.com,b@y.com] \
    --teams "Org 10U|Org 12U" --cfs-teams "Org 12U" \
    --flyer collateral/invite-org-x.png:x-invitation.png \
    --flyer collateral/invite-isi-x.png:x-isi-invitation.png

--cfs-teams omitted (or equal to --teams) = a showcase-only send.
--cfs-teams "" (empty) = an ISI-only send (team-invite-isi.html).
"""
import argparse
import html
import mimetypes
from email.message import EmailMessage
from email.utils import make_msgid, formataddr
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REG_LINK = "https://www.zortssports.com/join/tournament/26812"
HEADERS = "https://www.collegeflagshowcase.com/email-headers/"

p = argparse.ArgumentParser()
p.add_argument("out")
p.add_argument("--org", required=True)
p.add_argument("--to", required=True)
p.add_argument("--cc", default="")
p.add_argument("--teams", required=True)
p.add_argument("--cfs-teams")
p.add_argument("--flyer", action="append", default=[], help="path[:filename]")
p.add_argument("--signature", default="Allen Hamilton")
a = p.parse_args()

teams = [t.strip() for t in a.teams.split("|") if t.strip()]
cfs = [t.strip() for t in (a.teams if a.cfs_teams is None else a.cfs_teams).split("|") if t.strip()]
isi_only = not cfs
mixed = not isi_only and len(cfs) < len(teams)

tpl = ROOT / "public/email-templates" / (
    "team-invite-isi.html" if isi_only else
    "team-invite-mixed.html" if mixed else "team-invite.html"
)
header = "invite-isi.png" if isi_only else "invite.png"
row = lambda t: (
    '<tr><td style="padding:7px 0;border-bottom:1px solid #E6E2E5;'
    'font-size:15px;color:#0A0A0B;font-weight:bold;">'
    f"{html.escape(t)}</td></tr>"
)
header_cid = make_msgid(domain="collegeflagshowcase.com")
body = (
    tpl.read_text()
    .replace("{{ORG_NAME}}", html.escape(a.org))
    .replace("{{TEAM_ROWS}}", "".join(map(row, teams)))
    .replace("{{CFS_TEAM_ROWS}}", "".join(map(row, cfs)))
    .replace("{{REG_LINK}}", REG_LINK)
    .replace("{{SIGNATURE}}", a.signature)
    .replace(HEADERS + header, f"cid:{header_cid[1:-1]}")
)

if isi_only:
    sender = formataddr(("5v5 Sports", "allen@5v5sports.com"))
    subject = "Official Invitation — International Superflag Invitational — Dallas, TX"
    faqs = [("public/invites/isi-team-faq.pdf", "isi-team-invitation-faq.pdf")]
elif mixed:
    sender = formataddr(("5v5 Sports", "allen@5v5sports.com"))
    subject = "Official Invitation — International Superflag Invitational & College Flag Showcase — Dallas, TX"
    faqs = [("public/invites/team-faq.pdf", "team-invitation-faq.pdf"),
            ("public/invites/isi-team-faq.pdf", "isi-team-invitation-faq.pdf")]
else:
    sender = formataddr(("College Flag Showcase Series", "info@collegeflagshowcase.com"))
    subject = "Official Invitation — College Flag Showcase, Event 01 — Dallas, TX"
    faqs = [("public/invites/team-faq.pdf", "team-invitation-faq.pdf")]

m = EmailMessage()
m["From"] = sender
m["To"] = a.to
if a.cc:
    m["Cc"] = a.cc
m["Subject"] = subject
m["X-Unsent"] = "1"  # Outlook opens it as an editable draft
m.set_content(
    f"Official invitation for {a.org}. View this email in HTML to see the full invitation."
)
m.add_alternative(body, subtype="html")
m.get_payload()[1].add_related(
    (ROOT / "public/email-headers" / header).read_bytes(),
    maintype="image", subtype="png", cid=header_cid,
    filename=header, disposition="inline",
)

def attach(path, name):
    data = (ROOT / path).read_bytes()
    mt, st = (mimetypes.guess_type(name)[0] or "application/octet-stream").split("/")
    m.add_attachment(data, maintype=mt, subtype=st, filename=name)

for f in a.flyer:
    path, _, name = f.partition(":")
    attach(path, name or Path(path).name)
for path, name in faqs:
    attach(path, name)

Path(a.out).write_bytes(bytes(m))
print(f"wrote {a.out} ({'isi-only' if isi_only else 'mixed' if mixed else 'showcase'}, {len(teams)} teams, "
      f"{len(a.flyer) + len(faqs)} attachments)")
