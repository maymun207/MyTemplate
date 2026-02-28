export interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
}

export interface LocalBusinessData extends OrganizationData {
  address: {
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
  };
  telephone: string;
}

export function generateOrganizationSchema(data: OrganizationData) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
  };
}

export function generateLocalBusinessSchema(data: LocalBusinessData) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressCountry: data.address.addressCountry,
    },
    telephone: data.telephone,
  };
}
