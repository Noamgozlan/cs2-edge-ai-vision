export function getAuthRedirectUrl(path = "/dashboard") {
  const origin = window.location.origin.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}
