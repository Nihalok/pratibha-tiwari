
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterHandle?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Pratibha Tiwari | AI Leadership & Performance Coaching",
  description = "Pratibha Tiwari is a global authority on AI leadership, corporate performance, and mental architecture. Author of 'Motivational Diet for 369 Days'.",
  keywords = "Pratibha Tiwari, AI Leadership, Performance Coaching, Corporate Training, Motivational Diet, Middle East Executive Coach",
  canonical = "https://pratibhatiwari.com",
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterHandle = "@pratibhatiwari"
}) => {
  const siteTitle = title.includes("Pratibha Tiwari") ? title : `${title} | Pratibha Tiwari`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Pratibha Tiwari" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
