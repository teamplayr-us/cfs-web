"use client";

import { useState } from "react";

interface StopLink {
  slug: string;
  number: string;
  city: string;
}

export default function MobileMenu({ stops }: { stops: StopLink[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="mnav">
      <button
        type="button"
        className="mnav-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <div className="mnav-panel">
          <a href="/#offering" onClick={close}>
            The Event
          </a>
          <a href="/#tour" onClick={close}>
            Tour Stops
          </a>
          {stops.map((stop) => (
            <a
              key={stop.slug}
              className="mnav-sub"
              href={`/events/${stop.slug}`}
              onClick={close}
            >
              <span className="mnav-num">{stop.number}</span> {stop.city}
            </a>
          ))}
          <a href="/colleges" onClick={close}>
            Colleges
          </a>
          <a href="/sponsors" onClick={close}>
            Sponsors
          </a>
        </div>
      )}
    </div>
  );
}
