const getBaseUrl = () =>
  `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID || 'dummy_phone_id'}/messages`;

const getHeaders = () => ({
  Authorization: `Bearer ${process.env.WHATSAPP_TOKEN || ''}`,
  'Content-Type': 'application/json',
});

/**
 * Normalises phone numbers (specifically handles Indian country code 91 if missing)
 */
export function normalizePhone(to: string): string {
  return to.replace(/\D/g, '').replace(/^0/, '91').replace(/^(?!91)/, '91');
}

/**
 * Sends a plain text message via Meta WhatsApp Business API
 */
export async function sendText(to: string, text: string): Promise<boolean> {
  const phone = normalizePhone(to);
  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_ID) {
    console.warn(`[WhatsApp Stub] To: ${phone} | Text: "${text}"`);
    return true;
  }

  try {
    const res = await fetch(getBaseUrl(), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: text },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[WhatsApp Error] ${res.status}: ${err}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[WhatsApp Network Exception]', error);
    return false;
  }
}

/**
 * Sends an approved template message via Meta WhatsApp Business API
 */
export async function sendTemplate(
  to: string,
  template: string,
  components: unknown[]
): Promise<boolean> {
  const phone = normalizePhone(to);
  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_ID) {
    console.warn(`[WhatsApp Stub Template] To: ${phone} | Template: ${template}`);
    return true;
  }

  try {
    const res = await fetch(getBaseUrl(), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: template,
          language: { code: 'en' },
          components,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[WhatsApp Template Error] ${res.status}: ${err}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[WhatsApp Template Network Exception]', error);
    return false;
  }
}

/**
 * Outbound Notification: Ticket Raised
 */
export async function notifyTicketRaised(customerPhone: string, ticketNo: string) {
  return sendText(
    customerPhone,
    `Your service request *${ticketNo}* has been raised. We will contact you shortly.`
  );
}

/**
 * Outbound Notification: Technician Assigned
 */
export async function notifyTechnicianAssigned(
  customerPhone: string,
  ticketNo: string,
  techName: string,
  scheduledTime: string
) {
  return sendText(
    customerPhone,
    `Update on *${ticketNo}*: ${techName} has been assigned and will arrive at ${scheduledTime}.`
  );
}

/**
 * Outbound Notification: Job Closed & Feedback Request
 */
export async function notifyJobClosed(
  customerPhone: string,
  ticketNo: string,
  jobNo: string,
  publicToken: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://serviceiq.vercel.app';
  return sendText(
    customerPhone,
    `Your service job *${jobNo}* (ticket ${ticketNo}) has been completed. ` +
      `Please rate your experience: ${appUrl}/portal/${publicToken}`
  );
}
