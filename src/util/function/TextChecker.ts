export function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export function isValidPassword(passwd: string) {
  return passwd.length >= 6;
}