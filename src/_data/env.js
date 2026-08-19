// Build-time environment values baked into the static output.
// Set WEB3FORMS_ACCESS_KEY as a Cloudflare Pages build variable — it's
// meant to be public (Web3Forms locks it to the site's domain), so it's
// fine for it to land in the rendered HTML, it just shouldn't live in git.
export const web3formsAccessKey = process.env.WEB3FORMS_ACCESS_KEY || '';
