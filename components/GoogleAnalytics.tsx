import Script from "next/script";

/** GA4 tag — renders only when NEXT_PUBLIC_GA_ID (G-XXXXXXXXXX) is set.
 * SPA navigations are tracked by GA4 Enhanced Measurement (history events),
 * which is on by default for web data streams. */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
