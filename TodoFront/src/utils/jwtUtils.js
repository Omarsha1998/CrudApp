// jwtUtils.js
export function decodeJwt(jwt) {
  const base64Url = jwt.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64));
  return JSON.parse(jsonPayload);
}
