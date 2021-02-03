import emailjs from 'emailjs-com'
import { init } from 'emailjs-com'
init(process.env.REACT_APP_EMAILJS_USER)

export const sendMail = (name, email, message) => {
  emailjs
    .send(
      process.env.REACT_APP_EMAILJS_SERVICE,
      process.env.REACT_APP_EMAILJS_TEMPLATE,
      {
        from_name: name,
        to_name: 'Andrea Crego',
        message: message,
        reply_to: email,
      }
    )
    .then(
      (response) => {
        return response
      },
      (err) => {
        console.log('err', err)
        return err
      }
    )
}

export const customDomains = [
  '',
  'aol.com',
  'email.uscc.net	',
  'facebook.com',
  'fido.ca',
  'gmail.com',
  'google.com',
  'googlemail.com',
  'hotmail.com',
  'icloud.com',
  'live.com',
  'mac.com',
  'mail.com',
  'me.com',
  'message.ting.com',
  'messaging.sprintpcs.com',
  'mms.alltelwireless.com',
  'mms.att.net',
  'mms.cricketwireless.net',
  'mmst5.tracfone.com',
  'mms.uscc.net',
  'mobiletxt.ca',
  'msg.fi.google.com',
  'msg.telus.com',
  'msn.com',
  'myboostmobile.com',
  'mymetropcs.com',
  'outlook.com',
  'pcs.rogers.com',
  'pm.sprint.com',
  'protonmail.com',
  'rediffmail.com',
  'sms.alltelwireless.com',
  'sms.myboostmobile.com',
  'sms.sasktel.com',
  'text.mts.net',
  'text.republicwireless.com',
  'tmomail.net',
  'txt.att.net',
  'txt.bell.ca',
  'txt.freedommobile.ca',
  'verizon.net',
  'vmobl.com',
  'vmpix.com',
  'vtext.com',
  'vzwpix.com',
  'yahoo.com',
  'yandex.com',
  'zoho.com',
  'zohomail.in',
]
