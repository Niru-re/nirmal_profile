import nodemailer from "nodemailer";

const DEST_EMAIL = process.env.CONTACT_EMAIL || "nirmalporeddiwar@gmail.com";

async function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    // Create a transporter that uses a JSON transport when SMTP is not configured.
    // This prevents crashes in development and makes it easy to inspect the payload.
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, subject, message } = data || {};

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const transporter = await createTransporter();

    const mailOptions = {
      from: `${name} <${email}>`,
      to: DEST_EMAIL,
      subject: `[Portfolio Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><h4>Message</h4><p>${message.replace(/\n/g, "<br />")}</p>`,
    } as any;

    const info = await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ ok: true, info }), { status: 200 });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return new Response(JSON.stringify({ error: err?.message || "Internal error" }), { status: 500 });
  }
}
