export const onRequestPost = async ({request, env}) => {
  const formData = await request.formData();

  // Honeypot: bots fill every field, real visitors never see this one.
  if (formData.get('bot-field')) {
    return Response.redirect(new URL('/contact/thanks/', request.url), 303);
  }

  const name = (formData.get('name') || '').toString().trim();
  const email = (formData.get('email') || '').toString().trim();
  const message = (formData.get('message') || '').toString().trim();

  if (!name || !email || !message) {
    return Response.redirect(new URL('/contact/?error=missing', request.url), 303);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `PWHA contact form — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`
    })
  });

  if (!res.ok) {
    return Response.redirect(new URL('/contact/?error=send', request.url), 303);
  }

  return Response.redirect(new URL('/contact/thanks/', request.url), 303);
};
