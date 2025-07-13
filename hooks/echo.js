import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echoInstance = null;

if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT || 443,
    wsPort:  process.env.NEXT_PUBLIC_REVERB_PORT,
    forceTLS: true,
    authEndpoint: 'https://backend-latest-hcw2.onrender.com/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`
      }
    }
  });
  window.Echo = echoInstance;
}

export const getEcho = () => echoInstance;