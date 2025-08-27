import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBeatmapsetById } from "@/services/api/get_beatmapset";
import { postBeatmapById } from "@/services/api/post_beatmap_by_id";

const BeatmapsetRedirect = () => {
  const { beatmapsetId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);

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
              setMessage("Beatmap added successfully! Reloading page in 5 seconds...");
              setTimeout(() => {
                window.location.reload();
              }, 5000);
              return;
            } else {
              console.error("Beatmap population failed:", res.message);
            }
          } catch (e) {
            console.error("POST /beatmap/by_osu_id failed", e);
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
        console.error(e);
      }
    }
    run();
  }, [beatmapsetId, navigate]);

  if (message) {
    return (
      <div className="p-4 text-white">
        <div className="bg-green-600 text-white p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Success</h2>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default BeatmapsetRedirect;
