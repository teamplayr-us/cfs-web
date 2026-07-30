import Image from "next/image";

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
          <li>
            <a href="/#tour">Tour Stops</a>
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
