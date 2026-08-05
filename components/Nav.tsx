import Image from "next/image";
import MobileMenu from "./MobileMenu";
import { EVENTS, NEXT_STOP } from "@/data/events";

export default function Nav() {
  return (
    <nav>
      <div className="wrap nav-inner">
        <a
          className="logo logo-img"
          href="/"
          aria-label="Collegiate Flag Showcase Series — home"
        >
          <Image
            src="/logo.png"
            alt="Collegiate Flag Showcase Series logo"
            width={76}
            height={76}
            priority
          />
        </a>
        <ul className="nav-links">
          <li>
            <a href="/about">About</a>
          </li>
          <li className="nav-drop">
            <a href="/#tour">
              Events <span aria-hidden="true">▾</span>
            </a>
            <ul className="nav-drop-menu" aria-label="Event pages">
              {EVENTS.map((event) => (
                <li key={event.slug}>
                  <a href={`/events/${event.slug}`}>
                    <span className="nav-drop-num">{event.number}</span>
                    <span className="nav-drop-city">{event.city}</span>
                    <span className="nav-drop-date">{event.date}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <a href="/media">Media</a>
          </li>
          <li>
            <a href="/colleges">Colleges</a>
          </li>
          <li>
            <a href="/sponsors">Sponsors</a>
          </li>
        </ul>
        <div className="nav-right">
          <MobileMenu
            stops={EVENTS.map(({ slug, number, city }) => ({
              slug,
              number,
              city,
            }))}
          />
          <a className="nav-cta" href={`/events/${NEXT_STOP.slug}`}>
            Register
          </a>
        </div>
      </div>
    </nav>
  );
}
