// Settings for every post in src/posts (replaces posts.json).
import {slugifyString} from '../_config/filters/slugify.js';

export default {
  layout: 'post',
  tags: 'posts',
  permalink: "/news/{{ page.date | formatDate('YYYY') }}/{{ title | slugify }}/index.html",
  eleventyComputed: {
    // Old /news/<slug>/ addresses redirect to /news/<year>/<slug>/. A post
    // that's been retitled lists its old titles in `oldTitles`, so the
    // addresses made from those titles redirect too.
    redirectFrom: data => {
      const year = new Date(data.page.date).getUTCFullYear();
      const urls = [`/news/${slugifyString(data.title)}/`];
      for (const old of data.oldTitles || []) {
        const oldSlug = slugifyString(old);
        urls.push(`/news/${oldSlug}/`, `/news/${year}/${oldSlug}/`);
      }
      return urls;
    },
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
