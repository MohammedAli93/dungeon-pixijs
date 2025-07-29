export function setBackgroundVideo(videoUrl: string) {
  const video = document.getElementById("game-video") as HTMLVideoElement;
  // video.setAttribute("src", videoUrl);
}

export function updateBackgroundContainer(canvas: HTMLCanvasElement) {
  const backgroundContainer = document.getElementById(
    "background-container"
  ) as HTMLDivElement | undefined;
  if (!backgroundContainer) return;
  backgroundContainer.style.width = canvas.style.width;
  backgroundContainer.style.height = canvas.style.height;
  backgroundContainer.style.marginLeft = canvas.style.marginLeft;
  backgroundContainer.style.marginTop = canvas.style.marginTop;
}
