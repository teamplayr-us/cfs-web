import { CONTACT_EMAIL, CONTACT_PHONE } from "@/data/links";

export default function Footer() {
  return (
    <footer>
      <div className="wrap foot-inner">
        <a className="logo" href="/">
          College Flag <span style={{ color: "var(--red)" }}>Showcase</span>{" "}
          Series
        </a>
        <div>
          Questions? {CONTACT_PHONE} &nbsp;|&nbsp;{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
        <div>© 2026 · A 5v5 Sports Production</div>
      </div>
    </footer>
  );
}
