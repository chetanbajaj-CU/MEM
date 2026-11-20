import { RecaptchaVerifier, Auth } from "firebase/auth";
declare const auth: Auth;
new RecaptchaVerifier(auth, 'foo', {});
new RecaptchaVerifier('foo', {}, auth);
