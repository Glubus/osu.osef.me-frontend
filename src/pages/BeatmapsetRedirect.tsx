import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBeatmapsetById } from "@/services/api/get_beatmapset";
import { postBeatmapById } from "@/services/api/post_beatmap_by_id";
import axios from "axios";
import { API_BASE_URL } from "@/types/global";

interface PendingBeatmapStatusResponse {
  position: number;
  total: number;
}

const BeatmapsetRedirect = () => {
  const { beatmapsetId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<PendingBeatmapStatusResponse | null>(null);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);



  // Function to check pending beatmap status
  const checkPendingStatus = async (beatmapId: number): Promise<PendingBeatmapStatusResponse | null> => {
    try {
      const response = await axios.get<PendingBeatmapStatusResponse>(
        `${API_BASE_URL}/api/pending_beatmap/status/${beatmapId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {

        return null;
      }
      throw error;
    }
  };

  // Function to start polling for status
  const startPolling = (beatmapId: number) => {
    
    const poll = async () => {
      try {
        const statusData = await checkPendingStatus(beatmapId);
        
        if (statusData) {
          setStatus(statusData);
          setMessage(`Beatmap is being processed... Position: ${statusData.position}/${statusData.total}`);
        } else {
          await tryGetBeatmapset();
        }
      } catch (error) {
        setMessage("Error checking beatmap status. Please try again.");
        stopPolling();
      }
    };

    // Poll immediately
    poll();
    
    // Then poll every 5 seconds
    const interval = setInterval(poll, 5000);
    setPollingInterval(interval);
  };

  // Function to stop polling
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);

    }
  };

  // Function to try getting beatmapset
  const tryGetBeatmapset = async () => {
    if (!beatmapsetId) return;
    
    try {

      const data = await getBeatmapsetById(beatmapsetId);
      
      if (data.beatmap.beatmapset?.id) {

        stopPolling();
        setMessage("Beatmap processed successfully! Redirecting...");
        
        // Navigate to the beatmap
        const hash = window.location.hash || "";
        const hashParts = hash.replace(/^#/, "").split("/");
        const hashBeatmapId = hashParts.length > 1 ? hashParts[hashParts.length - 1] : undefined;
        
        if (hashBeatmapId) {
          const exists = data.beatmap.beatmap.find(b => String(b.beatmap?.osu_id) === String(hashBeatmapId));
          if (exists) {
            navigate(`/beatmapsets/${beatmapsetId}/${hashBeatmapId}`, { replace: true });
            return;
          }
        }
        
        const first = data.beatmap.beatmap.find(b => b.beatmap?.osu_id && b.msd && b.msd.length > 0);
        if (first?.beatmap?.osu_id) {
          navigate(`/beatmapsets/${beatmapsetId}/${first.beatmap.osu_id}`, { replace: true });
        }
      }
    } catch (error) {

      // If beatmapset still doesn't exist, retry POST
      await retryPostBeatmap();
    }
  };

  // Function to retry POST
  const retryPostBeatmap = async () => {
    const hash = window.location.hash || "";
    const hashParts = hash.replace(/^#/, "").split("/");
    const hashBeatmapId = hashParts.length > 1 ? hashParts[hashParts.length - 1] : undefined;
    
    if (!hashBeatmapId) {
      setMessage("No beatmap ID found in URL hash.");
      return;
    }

    try {

      const res = await postBeatmapById(Number(hashBeatmapId));
      
      if (String(res.status) === "200") {
        setMessage("Beatmap added to queue again! Checking status...");
        startPolling(Number(hashBeatmapId));
      } else {
        setMessage(`Failed to add beatmap: ${res.message}`);
      }
    } catch (error) {

      setMessage("Failed to add beatmap to queue. Please try again.");
    }
  };

  useEffect(() => {
    async function run() {
      if (!beatmapsetId) return;
      
      const hash = window.location.hash || "";
      const hashParts = hash.replace(/^#/, "").split("/");
      const hashBeatmapId = hashParts.length > 1 ? hashParts[hashParts.length - 1] : undefined;
      
      try {
        const data = await getBeatmapsetById(beatmapsetId);
        
        // If beatmapset is missing but we have a beatmap id in hash, trigger POST to populate by osu_id
        if (!data.beatmap.beatmapset?.id && hashBeatmapId) {
          try {

            const res = await postBeatmapById(Number(hashBeatmapId));
            
            if (String(res.status) === "200") {
              setMessage("Beatmap added to queue! Checking status...");
              startPolling(Number(hashBeatmapId));
              return;
            } else {
              setMessage(`Failed to add beatmap: ${res.message}`);
            }
          } catch (e) {

            setMessage("Failed to add beatmap to queue.");
          }
        }

        // If beatmapset exists: prefer navigating to hash beatmap if present and exists
        if (data.beatmap.beatmapset?.id) {
          if (hashBeatmapId) {
            const exists = data.beatmap.beatmap.find(b => String(b.beatmap?.osu_id) === String(hashBeatmapId));
            if (exists) {
              navigate(`/beatmapsets/${beatmapsetId}/${hashBeatmapId}`, { replace: true });
              return;
            }
          }
          const first = data.beatmap.beatmap.find(b => b.beatmap?.osu_id && b.msd && b.msd.length > 0);
          if (first?.beatmap?.osu_id) {
            navigate(`/beatmapsets/${beatmapsetId}/${first.beatmap.osu_id}`, { replace: true });
          }
        }
      } catch (e) {

        setMessage("Error loading beatmap. Please try again.");
      }
    }
    
    run();

    // Cleanup polling on unmount
    return () => {
      stopPolling();
    };
  }, [beatmapsetId, navigate]);

  if (message) {
    return (
      <div className="p-4 text-white">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">
            {status ? "Processing Beatmap" : "Beatmap Status"}
          </h2>
          <p className="mb-2">{message}</p>
          {status && (
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-green-400 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${((status.total - status.position) / status.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">
                Position: {status.position} of {status.total} in queue
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default BeatmapsetRedirect;
