// Plano Wildcats Hockey Association navigation.
// Top-level items render in the header. The order is: org info first
// (About), then time-sensitive content (Schedule, Teams, Alumni), then
// commerce / support (Support, Store), then Contact at the end. Store is
// an external link — replace the placeholder URL when the storefront is set up.
export default {
  top: [
    {
      text: 'About Us',
      url: '/about/'
    },
    {
      text: 'Contact Us',
      url: '/contact/'
    },
    {
      text: 'Support',
      url: '/support/'
    },
    {
      text: 'Schedule',
      url: '/schedule/'
    },
    {
      text: 'Store',
      url: 'https://example.com/' // TODO: replace with the real PWHA storefront URL
    },
    {
      text: 'Teams',
      url: '/teams/'
    },
    {
      text: 'History',
      url: '/history/'
    }
  ],
  bottom: [
    {
      text: 'Imprint',
      url: '/imprint/'
    },
    {
      text: 'Privacy',
      url: '/privacy/'
    },
    {
      text: 'Accessibility',
      url: '/accessibility/'
    }
  ]
};
