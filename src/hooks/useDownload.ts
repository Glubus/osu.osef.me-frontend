export const useDownload = () => {
  const downloadBeatmap = (beatmapsetId: number | undefined) => {
    if (!beatmapsetId) {
      console.warn("No beatmapset ID provided for download");
      return;
    }
    console.log("Downloading beatmapset", beatmapsetId);
    const downloadUrl = `https://catboy.best/d/${beatmapsetId}`;
    
    // Open in new tab
    window.open(downloadUrl, '_blank');
  };

  return { downloadBeatmap };
};
