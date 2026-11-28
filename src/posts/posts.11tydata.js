// Settings for every post in src/posts (replaces posts.json).
import {slugifyString} from '../_config/filters/slugify.js';

export default {
  layout: 'post',
  tags: 'posts',
  permalink: "/news/{{ page.date | formatDate('YYYY') }}/{{ title | slugify }}/index.html",
  eleventyComputed: {
    // Old /news/<slug>/ addresses redirect to /news/<year>/<slug>/.
    redirectFrom: data => [`/news/${slugifyString(data.title)}/`],
    // Posts without their own image get the team logo: maroon for game
    // recaps (front matter `recap: true`), white for everything else.
    image: data =>
      data.image ||
      (data.recap
        ? '/assets/images/default-logo-on-maroon.jpg'
        : '/assets/images/default-logo-on-white.jpg'),
    alt: data => data.alt || 'Plano Wildcats Hockey logo'
  }
};
