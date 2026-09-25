import type { IPublicClientApplication } from '@azure/msal-browser';
import { loginRequest } from './authConfig';

export async function redirectToLogin(
  instance: IPublicClientApplication,
): Promise<void> {
  await instance.loginRedirect(loginRequest);
}