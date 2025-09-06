export const useDownload = () => {
  const downloadBeatmap = (beatmapsetId: number | undefined) => {
    if (!beatmapsetId) {

      return;
    }

    const downloadUrl = `https://catboy.best/d/${beatmapsetId}`;
    
    // Open in new tab
    window.open(downloadUrl, '_blank');
  };

  return { downloadBeatmap };
};
