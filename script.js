const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });
const fileInput = document.getElementById('fileInput');
const compressBtn = document.getElementById('compressBtn');
const statusEl = document.getElementById('status');
const preview = document.getElementById('preview');
const downloadLink = document.getElementById('downloadLink');

compressBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a video first!");
    return;
  }

  statusEl.textContent = "Loading FFmpeg (this may take a few seconds)...";
  await ffmpeg.load();

  statusEl.textContent = "Compressing video... (please wait)";
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));

  // The CRF controls quality: 18–28 is a good range (28 = smaller file)
  await ffmpeg.run('-i', 'input.mp4', '-vcodec', 'libx264', '-crf', '28', '-preset', 'fast', '-acodec', 'aac', 'output.mp4');

  const data = ffmpeg.FS('readFile', 'output.mp4');
  const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
  const videoUrl = URL.createObjectURL(videoBlob);

  preview.src = videoUrl;
  downloadLink.href = videoUrl;
  statusEl.textContent = "Done! 🎉 Your video is ready.";
});
