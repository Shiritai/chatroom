import idolSuccessUrl from '/src/assets/idol_success.jpg'
import idolFailedUrl from '/src/assets/idol_failed.jpg'

function commit(message: string, opt: NotificationOptions, onclick?: (this: Notification, ev: Event) => any) {
  const notification = new Notification(message, opt)
  if (onclick)
    notification.onclick = onclick
  else 
    notification.onclick = () => {
      window.focus();
    }
  console.log(`Notification: ${JSON.stringify(notification)} with message: ${message}`)
}

/**
 * My template option of notification
 */
export class NotOpt {
  public static readonly SUCCESS: NotificationOptions = {
    body: '\\ OwO /',
    icon: idolSuccessUrl
  }
  public static readonly FAILED: NotificationOptions = {
    body: '/ >.< \\',
    icon: idolFailedUrl
  }
}

/**
 * ref:
 * 1. https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission
 * 2. https://www.cythilya.tw/2017/07/09/notification/
 * @param message Message to send as notification
 */
export default function Notify(message: string, opt: NotificationOptions, onclick?: (this: Notification, ev: Event) => any) {
  if (!message)
    return
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("The browser does not support desktop notification!");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    commit(message, opt, onclick)
  } else if (Notification.permission === 'default' || 
            Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        commit(message, opt, onclick)
      }
    });
  }
}
