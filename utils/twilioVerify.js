// utils/twilioVerify.js
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMSVerification = async (mobile) => {
  try {
    await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID).verifications.create({
      to: mobile,
      channel: 'sms',
    });
    console.log('Verification code sent via SMS');
  } catch (error) {
    console.error('Error sending SMS verification:', error);
    throw error;
  }
};

export const verifySMSCode = async (mobile, code) => {
  try {
    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID).verificationChecks.create({
      to: mobile,
      code,
    });
    return verificationCheck;
  } catch (error) {
    console.error('Error verifying SMS code:', error);
    throw error;
  }
};