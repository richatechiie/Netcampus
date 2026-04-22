const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAlertEmail = async ({ deviceName, deviceIp, type, severity }) => {
  const subject = `[NetCampus Alert] ${deviceName} — ${type.replace('_', ' ').toUpperCase()}`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: ${severity === 'critical' ? '#dc2626' : '#f59e0b'}">
        NetCampus Network Alert
      </h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Device</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${deviceName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>IP Address</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${deviceIp}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Alert Type</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${type.replace('_', ' ')}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Severity</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${severity.toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
        </tr>
      </table>
      <p style="color: #666; margin-top: 20px;">
        Please check the NetCampus dashboard for more details.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"NetCampus Monitor" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject,
    html,
  });
};

module.exports = { sendAlertEmail };