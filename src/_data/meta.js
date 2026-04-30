export const url = process.env.URL || 'http://localhost:8080';
// Extract domain from `url`
export const domain = new URL(url).hostname;
export const siteName = 'Plano Wildcats Hockey Association';
export const siteDescription = 'Plano Wildcats Hockey Association — youth hockey in Plano, Texas.';
export const siteType = 'SportsOrganization'; // schema.org
export const locale = 'en_EN';
export const lang = 'en';
export const skipContent = 'Skip to content';
// Posts and pages are authored by the organization itself (PWHA). Individual
// contributors can override at the post level via front matter when needed.
export const author = {
  name: 'Plano Wildcats Hockey Association',
  avatar: '/icon-512x512.png', // the favicon (paw mark) doubles as the org avatar
  email: '', // TODO: set a public contact (e.g. info@planowildcatshockey.com)
  website: 'https://planowildcatshockey.com',
  fediverse: '' // optional Mastodon/Threads/etc. handle if the org joins one
};
export const creator = {
  name: 'Plano Wildcats Hockey Association',
  email: '',
  website: 'https://planowildcatshockey.com',
  social: ''
};
export const pathToSvgLogo = 'src/assets/svg/misc/logo.svg'; // used for favicon generation
export const themeColor = '#641529'; // Plano Wildcats brand maroon — used in manifest as primary color
export const themeLight = '#f8f8f8'; // used for meta tag theme-color, if light colors are prefered. best use value set for light bg
export const themeDark = '#2e2e2e'; // used for meta tag theme-color, if dark colors are prefered. best use value set for dark bg
export const opengraph_default = '/assets/images/template/opengraph-default.jpg'; // fallback/default meta image
export const opengraph_default_alt =
  'Plano Wildcats Hockey Association — the maroon paw mark of the Plano Wildcats hockey team.'; // alt text for default meta image
export const blog = {
  // RSS feed
  name: 'Plano Wildcats Hockey News',
  description: 'News, scores, schedules, and updates from the Plano Wildcats Hockey Association.',
  // feed links are looped over in the head. You may add more to the array.
  feedLinks: [
    {
      title: 'Atom Feed',
      url: '/feed.xml',
      type: 'application/atom+xml'
    },
    {
      title: 'JSON Feed',
      url: '/feed.json',
      type: 'application/json'
    }
  ],
  // Tags
  tagSingle: 'Tag',
  tagPlural: 'Tags',
  tagMore: 'More tags:',
  // pagination
  paginationLabel: 'Blog',
  paginationPage: 'Page',
  paginationPrevious: 'Previous',
  paginationNext: 'Next',
  paginationNumbers: true
};
export const details = {
  aria: 'section controls',
  expand: 'expand all',
  collapse: 'collapse all'
};
export const dialog = {
  close: 'Close',
  next: 'Next',
  previous: 'Previous'
};
export const navigation = {
  navLabel: 'Menu',
  ariaTop: 'Main',
  ariaBottom: 'Complementary',
  ariaPlatforms: 'Platforms',
  drawerNav: false,
  subMenu: false
};
export const themeSwitch = {
  title: 'Theme',
  light: 'light',
  dark: 'dark'
};
export const greenweb = {
  // https://carbontxt.org/
  disclosures: [
    {
      docType: 'sustainability-page',
      url: `${url}/sustainability/`,
      domain: domain
    }
  ],
  services: [{domain: 'netlify.com', serviceType: 'cdn'}]
};
export const tests = {
  pa11y: {
    // keep customPaths empty if you want to test all pages
    customPaths: ['/', '/about/', '/blog/', '/styleguide/'],
    globalIgnore: []
  }
};
export const viewRepo = {
  // this is for the view/edit on github link. The value in the package.json will be pulled in.
  allow: true,
  infoText: 'View this page on GitHub'
};
export const easteregg = true;
