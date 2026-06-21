const BASE = "https://nhdapi.com/embed";

export interface EmbedParams {
  autoplay?: string;
  autonext?: string;
  audio?: string;
  title?: string;
  download?: string;
  setting?: string;
  appearance?: string;
  chromecast?: string;
  pip?: string;
  watchparty?: string;
  nextbutton?: string;
  hidecontrols?: string;
  primarycolor?: string;
  secondarycolor?: string;
  iconcolor?: string;
  icons?: string;
  iconsize?: string;
  font?: string;
  fontcolor?: string;
  fontsize?: string;
  opacity?: string;
  glasscolor?: string;
  glassopacity?: string;
  glassblur?: string;
  subtitle?: string;
  subdelay?: string;
  subtextsize?: string;
  subtextcolor?: string;
  subcapitalize?: string;
  subbold?: string;
  subfont?: string;
  subbgenabled?: string;
  subbgcolor?: string;
  subbgopacity?: string;
  subbgblur?: string;
  language?: string;
  server?: string;
}

const defaults: EmbedParams = {
  autoplay: "false",
  autonext: "true",
  audio: "true",
  title: "true",
  download: "false",
  setting: "true",
  appearance: "on",
  chromecast: "true",
  pip: "true",
  watchparty: "false",
  nextbutton: "true",
  hidecontrols: "false",
  primarycolor: "6C63FF",
  secondarycolor: "9F9BFF",
  iconcolor: "FFFFFF",
  iconsize: "1",
  font: "Roboto",
  fontcolor: "FFFFFF",
  fontsize: "20",
  opacity: "0.50",
  glasscolor: "000000",
  glassopacity: "65",
  glassblur: "20",
  subtitle: "Off",
  subfont: "Roboto",
  subbgenabled: "false",
};

function buildUrl(basePath: string, overrides?: Partial<EmbedParams>): string {
  const params = { ...defaults, ...overrides };
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined))
  );
  return `${BASE}${basePath}?${qs.toString()}`;
}

export function getMovieEmbedUrl(movieId: number, overrides?: Partial<EmbedParams>): string {
  return buildUrl(`/movie/${movieId}`, overrides);
}

export function getTvEmbedUrl(tmdbId: number, season: number, episode: number, overrides?: Partial<EmbedParams>): string {
  return buildUrl(`/tv/${tmdbId}/${season}/${episode}`, overrides);
}

export function getMovieDownloadUrl(movieId: number): string {
  return `https://nhdapi.com/dl/movie/${movieId}`;
}

export function getTvDownloadUrl(tmdbId: number, season: number, episode: number): string {
  return `https://nhdapi.com/dl/tv/${tmdbId}/${season}/${episode}`;
}

// ---- VidVault Download ----

export function getVidVaultMovieUrl(movieId: number): string {
  return `https://vidvault.ru/movie/${movieId}`;
}

export function getVidVaultTvUrl(tmdbId: number, season: number, episode: number): string {
  return `https://vidvault.ru/tv/${tmdbId}/${season}/${episode}`;
}

// ---- Vixsrc ----

export function getVixsrcMovieUrl(movieId: number): string {
  return `https://vixsrc.to/movie/${movieId}?primaryColor=B20710&secondaryColor=170000&autoplay=false`;
}

export function getVixsrcTvUrl(tmdbId: number, season: number, episode: number): string {
  return `https://vixsrc.to/tv/${tmdbId}/${season}/${episode}?primaryColor=B20710&secondaryColor=170000&autoplay=false`;
}

// ---- VidFast ----

export function getVidfastMovieUrl(movieId: number): string {
  return `https://vidfast.pro/movie/${movieId}?autoPlay=true&title=true&poster=true&theme=6C63FF`;
}

export function getVidfastTvUrl(tmdbId: number, season: number, episode: number): string {
  return `https://vidfast.pro/tv/${tmdbId}/${season}/${episode}?autoPlay=true&title=true&poster=true&theme=6C63FF&nextButton=true&autoNext=true`;
}

// ---- VidNest ----

export function getVidnestMovieUrl(movieId: number): string {
  return `https://vidnest.fun/movie/${movieId}`;
}

export function getVidnestTvUrl(tmdbId: number, season: number, episode: number): string {
  return `https://vidnest.fun/tv/${tmdbId}/${season}/${episode}`;
}
