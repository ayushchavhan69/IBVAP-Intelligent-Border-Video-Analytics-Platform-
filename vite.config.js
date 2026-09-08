import { defineConfig } from 'vite';
import nodemailer from 'nodemailer';

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    open: false
  },
  plugins: [
    {
      name: 'ibvap-otp-mailer',
      configureServer(server) {
        server.middlewares.use('/api/send-otp', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { email, otp, name } = JSON.parse(body);

              // ── 1. Secure Server-Side Telemetry Output ──────────────────
              console.log('\n=============================================================');
              console.log(' [IBVAP SECURITY RELAY] EMAIL OTP DISPATCH INITIATED');
              console.log(` Recipient        : ${email}`);
              console.log(` One-Time Code    : ${otp}`);
              console.log(` Validity Window  : 60 Seconds`);
              console.log(` System Timestamp : ${new Date().toISOString()}`);
              console.log('=============================================================\n');

              let emailDelivered = false;

              // ── 2. Nodemailer SMTP Relay (if credentials provided in env) ─
              const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
              const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD;

              if (smtpUser && smtpPass) {
                try {
                  const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: smtpUser, pass: smtpPass }
                  });

                  await transporter.sendMail({
                    from: `"Security Verification" <${smtpUser}>`,
                    to: email,
                    subject: `Security Verification Code: ${otp}`,
                    text: `Your one-time verification code is: ${otp}\n\nThis code will expire in 60 seconds.\n\nDo not share this code with anyone.`,
                    html: `
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0B132B; color: #ffffff; padding: 24px; border-radius: 12px; max-width: 440px; margin: 0 auto;">
                        <h2 style="color: #00E5FF; font-size: 18px; margin: 0 0 12px; font-weight: 600;">Security Verification Code</h2>
                        <p style="color: #CBD5E1; font-size: 14px; margin: 0 0 16px;">Use the following one-time code to complete your verification:</p>
                        <div style="background: #030712; border: 1px solid #00FF94; border-radius: 8px; padding: 16px; text-align: center; margin: 16px 0;">
                          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #00FF94; font-family: monospace;">${otp}</span>
                        </div>
                        <p style="font-size: 12px; color: #94A3B8; margin: 0; line-height: 1.5;">This code will expire in 60 seconds.<br>Do not share this code with anyone.</p>
                      </div>
                    `
                  });
                  emailDelivered = true;
                  console.log(`[IBVAP Security] Direct SMTP delivery sent to ${email}`);
                } catch (smtpErr) {
                  console.warn('[IBVAP Security] SMTP transport error:', smtpErr.message);
                }
              }

              // ── 3. FormSubmit Gateway Relay (Clean Payload: Only Code & Expiry) ─
              try {
                const fsRes = await fetch(`https://formsubmit.co/ajax/${email}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Referer': 'http://localhost:5173/signin.html',
                    'Origin': 'http://localhost:5173'
                  },
                  body: JSON.stringify({
                    _subject: `Security Verification Code: ${otp}`,
                    _template: 'box',
                    _captcha: 'false',
                    "One-Time Code (OTP)": otp,
                    "Expires In": "60 seconds",
                    "Security Notice": "Do not share this code with anyone."
                  })
                });
                const fsData = await fsRes.json();
                if (fsData.success === 'true' || fsData.success === true) {
                  emailDelivered = true;
                }
              } catch (fsErr) {
                // FormSubmit webhook dispatch note
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, email, emailDelivered }));
            } catch (err) {
              console.error('[IBVAP Security] Error processing OTP dispatch:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        signin: 'signin.html'
      }
    }
  }
});

