// by Chris Burnell: https://chrisburnell.com/article/some-eleventy-filters/#markdown-format

import markdownParser from 'markdown-it';

const markdown = markdownParser();

export const markdownFormat = string => {
  if (!string) return '';
  return markdown.render(string);
};
