export function isTVDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  // Common keywords found in TV device user agents
  const tvKeywords = [
    "smarttv",
    "googletv",
    "appletv",
    "firetv",
    "roku",
    "webos",
    "tizen",
    "androidtv",
  ];

  for (const keyword of tvKeywords) {
    if (userAgent.includes(keyword)) {
      return true;
    }
  }
  return false;
}
