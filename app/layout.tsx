import type { Metadata } from "next";
import { Raleway, Roboto_Condensed, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PSSOU Admissions 2026-27 | Pt. Sundarlal Sharma (Open) University Chhattisgarh",
  description:
    "Apply for UG, PG, Diploma & Certificate Distance Learning Programmes at Pt. Sundarlal Sharma (Open) University (PSSOU), Bilaspur, Chhattisgarh. UGC & DEB Approved State Open University.",
  keywords: [
    "PSSOU Admission",
    "Pt. Sundarlal Sharma Open University",
    "PSSOU Bilaspur",
    "Distance Education Chhattisgarh",
    "ODL Admission 2026",
    "PSSOU Online Form",
    "UGC DEB Approved University"
  ],
  authors: [{ name: "PSSOU Bilaspur" }],
  icons: {
    icon: "/images/mono-nav.png",
    apple: "/images/mono-nav.png",
  },
  openGraph: {
    title: "PSSOU Admissions 2026-27 | Pt. Sundarlal Sharma (Open) University",
    description: "Official pre-admission portal for UGC-DEB recognized degree & diploma distance courses.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://a.pssou.net",
    siteName: "PSSOU Admissions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;

  return (
    <html lang="en" className={`${raleway.variable} ${robotoCondensed.variable} ${inter.variable}`}>
      <head>
        {/* Google Tag Manager (Conditional) */}
        {gtmId && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}

        {/* Meta Pixel (Conditional) */}
        {metaPixelId && (
          <Script id="meta-pixel-script" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* Google Ads gtag (Conditional) */}
        {googleAdsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-script" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAdsId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#f8f9fa] text-[#1e293b]">
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
