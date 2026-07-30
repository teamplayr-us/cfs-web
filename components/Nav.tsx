import Image from "next/image";
import { EVENTS } from "@/data/events";

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
            <a href="/#offering">The Event</a>
          </li>
          <li className="nav-drop">
            <a href="/#tour">
              Tour Stops <span aria-hidden="true">▾</span>
            </a>
            <ul className="nav-drop-menu" aria-label="Tour stop pages">
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
            <a href="/#colleges">Colleges</a>
          </li>
          <li>
            <a href="/#sponsors">Sponsors</a>
          </li>
        </ul>
        <a className="nav-cta" href="/#interest">
          Register
        </a>
      </div>
    </nav>
  );
}
