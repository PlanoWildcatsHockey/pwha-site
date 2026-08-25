// Plano Wildcats Hockey Association navigation.
// Top-level nav prioritizes parent/player usability and in-season practicality.
// Store is an external link — replace the placeholder URL when the storefront is set up.
export default {
  top: [
    {
      text: 'News',
      url: '/news/'
    },
    {
      text: 'Schedule',
      url: '/schedule/'
    },
    {
      text: 'Join',
      url: '/join/'
    },
    {
      text: 'Resources',
      url: '/resources/'
    },
    {
      text: 'History',
      url: '/history/'
    },
    {
      text: 'Sponsors',
      url: '/sponsors/'
    },
    {
      text: 'About',
      url: '/about/'
    },
    {
      text: 'Contact',
      url: '/contact/'
    },
    {
      text: 'Search',
      url: '/search/'
    }
  ],
  // Imprint/Privacy/Accessibility links removed for now — pages still exist,
  // just not linked from the footer.
  bottom: [],
  // Deeper sitemap for the footer — pulls in subpages that aren't in the
  // top-level header nav (bylaws, officers, coaches, etc).
  footer: [
    {
      heading: 'Explore',
      links: [
        {text: 'News', url: '/news/'},
        {text: 'Schedule', url: '/schedule/'},
        {text: 'Teams', url: '/teams/'},
        {text: 'Player Database', url: '/players/'},
        {text: 'History', url: '/history/'},
        {text: 'Search', url: '/search/'}
      ]
    },
    {
      heading: 'Resources',
      links: [
        {text: 'Join the Wildcats', url: '/join/'},
        {text: 'Resources', url: '/resources/'},
        {text: 'By-Laws', url: '/resources/bylaws/'},
        {text: 'Code of Conduct', url: '/resources/conduct/'},
        {text: 'Support the Club', url: '/support/'}
      ]
    },
    {
      heading: 'Organization',
      links: [
        {text: 'About', url: '/about/'},
        {text: 'Officers', url: '/about/officers/'},
        {text: 'Coaches & Staff', url: '/coaches/'},
        {text: 'Sponsors', url: '/sponsors/'},
        {text: 'Contact', url: '/contact/'}
      ]
    }
  ]
};
