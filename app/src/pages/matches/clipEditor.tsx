import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  AssessmentOutlined,
  AddCommentOutlined,
  ContentCut,
  DeleteOutline,
  EditOutlined,
  ExpandLess,
  ExpandMore,
  Forward5,
  Pause,
  PlayArrow,
  Replay,
  Stop,
} from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import AddClip from "@/components/clips/AddClip";
import AddEvaluation from "@/components/evaluations/AddEvaluation";
import CustomModal from "@/components/customModal/customModal";
import EditClip from "@/components/clips/EditClip";
import EditEvaluation from "@/components/evaluations/EditEvaluation";
import { Clip } from "@/lib/types/clips.types";
import { Evaluation } from "@/lib/types/evaluation.types";
import { Player } from "@/lib/types/players.types";
import { minioUrl } from "@/lib/constants/constants";
import { deleteClip, fetchClips } from "@/store/slices/clips.slice";
import { deleteEvaluation, fetchEvaluations } from "@/store/slices/evaluations.slice";
import { fetchMatchById } from "@/store/slices/matches.slice";
import { fetchPlayers } from "@/store/slices/players.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import Swal from "sweetalert2";

interface YouTubePlayer {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
}

interface YouTubePlayerEvent {
  data: number;
  target: YouTubePlayer;
}

const extractYouTubeVideoId = (url: string) =>
  url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/)?.[1] ?? null;

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    : `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const resolveNativeUrl = (url: string) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `${minioUrl}${url.replace(/^\//, "")}`;
};

const ClipEditorPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedMatch, loading: matchLoading } = useAppSelector((state) => state.matchData);
  const { clips, loading: clipsLoading } = useAppSelector((state) => state.clipData);
  const { evaluations } = useAppSelector((state) => state.evaluationData);
  const { players } = useAppSelector((state) => state.playerData);

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [clipStart, setClipStart] = useState<number | null>(null);
  const [clipEnd, setClipEnd] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [evaluationOpen, setEvaluationOpen] = useState(false);
  const [createdClipId, setCreatedClipId] = useState<string | null>(null);
  const [expandedClipId, setExpandedClipId] = useState<string | null>(null);
  const [actionClip, setActionClip] = useState<Clip | null>(null);
  const [editClipOpen, setEditClipOpen] = useState(false);
  const [existingEvaluationOpen, setExistingEvaluationOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);
  const [editEvaluationOpen, setEditEvaluationOpen] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const youtubeContainerRef = useRef<HTMLDivElement | null>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const nativeVideoRef = useRef<HTMLVideoElement | null>(null);

  const sourceUrl = selectedMatch?.gameUrl ?? "";
  const youtubeId = useMemo(() => extractYouTubeVideoId(sourceUrl), [sourceUrl]);
  const sourceType = youtubeId ? "youtube" : "native";
  const evaluationsByClip = useMemo(
    () =>
      evaluations.reduce<Record<string, Evaluation[]>>((grouped, evaluation) => {
        (grouped[evaluation.clipId] ??= []).push(evaluation);
        return grouped;
      }, {}),
    [evaluations],
  );

  useEffect(() => {
    if (!id) return;
    dispatch(fetchMatchById(id));
    dispatch(fetchClips({ matchIds: [id] }));
    dispatch(fetchEvaluations({ matchId: id }));
    dispatch(fetchPlayers());
  }, [dispatch, id]);

  useEffect(() => {
    if (!youtubeId || !youtubeContainerRef.current) return;

    if (!document.getElementById("youtube-iframe-api")) {
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }

    let cancelled = false;
    const timer = window.setInterval(() => {
      if (cancelled || !window.YT?.Player || !youtubeContainerRef.current || youtubePlayerRef.current) return;
      window.clearInterval(timer);
      youtubePlayerRef.current = new window.YT.Player(youtubeContainerRef.current, {
        videoId: youtubeId,
        playerVars: { controls: 0, rel: 0, modestbranding: 1 },
        events: {
          onReady: (event: YouTubePlayerEvent) => {
            setDuration(event.target.getDuration() || 0);
            setPlayerReady(true);
          },
          onStateChange: (event: YouTubePlayerEvent) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    }, 100);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      youtubePlayerRef.current?.destroy?.();
      youtubePlayerRef.current = null;
    };
  }, [youtubeId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (youtubePlayerRef.current?.getCurrentTime) {
        setCurrentTime(youtubePlayerRef.current.getCurrentTime() || 0);
        setDuration(youtubePlayerRef.current.getDuration() || 0);
      } else if (nativeVideoRef.current) {
        setCurrentTime(nativeVideoRef.current.currentTime || 0);
        setDuration(nativeVideoRef.current.duration || 0);
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, []);

  const seekTo = useCallback(
    (seconds: number) => {
      const nextTime = Math.max(0, Math.min(seconds, duration || seconds));
      if (youtubeId) youtubePlayerRef.current?.seekTo(nextTime, true);
      else if (nativeVideoRef.current) nativeVideoRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    },
    [duration, youtubeId],
  );

  const togglePlayback = () => {
    if (youtubeId) {
      if (isPlaying) youtubePlayerRef.current?.pauseVideo();
      else youtubePlayerRef.current?.playVideo();
    } else if (nativeVideoRef.current) {
      if (nativeVideoRef.current.paused) nativeVideoRef.current.play();
      else nativeVideoRef.current.pause();
    }
  };

  const beginClip = () => {
    setClipStart(currentTime);
    setClipEnd(null);
  };

  const finishClip = () => {
    if (clipStart === null) return;
    if (youtubeId) youtubePlayerRef.current?.pauseVideo();
    else nativeVideoRef.current?.pause();
    setIsPlaying(false);
    const safeEnd = Math.max(currentTime, clipStart + 1);
    setClipEnd(safeEnd);
    setModalOpen(true);
  };

  const handleClipClick = (clip: Clip) => {
    seekTo(Number(clip.startTime) || 0);
  };

  const handleDeleteClip = async (clip: Clip) => {
    const result = await Swal.fire({
      title: t("clipEditor.deleteClipTitle"),
      text: t("clipEditor.deleteClipText", { name: clip.name }),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: t("static.cancel"),
      confirmButtonColor: "#dc2626",
      confirmButtonText: t("clipEditor.confirmDeleteClip"),
    });

    if (!result.isConfirmed) return;
    await dispatch(deleteClip(clip.id)).unwrap();
    if (expandedClipId === clip.id) setExpandedClipId(null);
    dispatch(fetchEvaluations({ matchId: selectedMatch?.id }));
  };

  const handleDeleteEvaluation = async (evaluation: Evaluation) => {
    const result = await Swal.fire({
      title: t("clipEditor.deleteEvaluationTitle"),
      text: t("clipEditor.deleteEvaluationText", {
        player: evaluation.playerName,
        episode: evaluation.episodeName,
      }),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: t("static.cancel"),
      confirmButtonColor: "#dc2626",
      confirmButtonText: t("clipEditor.confirmDeleteEvaluation"),
    });

    if (!result.isConfirmed) return;
    await dispatch(deleteEvaluation(evaluation.id)).unwrap();
    dispatch(fetchEvaluations({ matchId: selectedMatch?.id }));
  };

  if (matchLoading && !selectedMatch) return <LinearProgress />;

  if (!selectedMatch) {
    return <Alert severity="error">{t("clipEditor.matchLoadError")}</Alert>;
  }

  return (
    <Box sx={{ bgcolor: "#0b1120", color: "#e2e8f0", overflow: "hidden", minHeight: "100vh", height: { lg: "100vh" }, width: "100vw", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #263349" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton component={Link} to={`/Matches/${selectedMatch.id}`} sx={{ color: "#cbd5e1" }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography fontWeight={800}>{t("clipEditor.title")}</Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              {selectedMatch.homeTeam.teamName} vs {selectedMatch.awayTeam.teamName}
            </Typography>
          </Box>
        </Box>
        <Chip label={t(sourceType === "youtube" ? "clipEditor.youtubeSource" : "clipEditor.nativeSource")} size="small" sx={{ bgcolor: "#1e293b", color: "#cbd5e1" }} />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "320px minmax(0, 1fr)" }, flex: { lg: 1 }, minHeight: { lg: 0 } }}>
        <Box sx={{ borderRight: { lg: "1px solid #263349" }, bgcolor: "#0f172a", p: 2, maxHeight: { xs: "42vh", lg: "100%" }, overflowY: "auto" }}>
          <Typography variant="overline" sx={{ color: "#64748b", letterSpacing: 1.4 }}>{t("clipEditor.matchClips")}</Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2 }}>{t("clipEditor.savedMoments", { count: clips.length })}</Typography>
          {clipsLoading && <CircularProgress size={22} />}
          {!clipsLoading && clips.length === 0 && (
            <Paper sx={{ p: 2, bgcolor: "#111c2f", color: "#94a3b8" }}>{t("clipEditor.emptyClips")}</Paper>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {clips.map((clip, index) => {
              const clipEvaluations = evaluationsByClip[clip.id] ?? [];
              const isExpanded = expandedClipId === clip.id;

              return (
                <Card
                  key={clip.id}
                  sx={{ cursor: "pointer", bgcolor: "#162033", color: "#e2e8f0", border: "1px solid transparent", "&:hover": { borderColor: "#3b82f6", bgcolor: "#1b2940" } }}
                >
                  <Box onClick={() => handleClipClick(clip)} sx={{ p: 1.5 }}>
                    <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: "#253756", fontSize: 13 }}>{index + 1}</Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={700} noWrap>{clip.name}</Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>{formatTime(Number(clip.startTime))} – {formatTime(Number(clip.endTime))}</Typography>
                      </Box>
                      <PlayArrow fontSize="small" sx={{ color: "#60a5fa" }} />
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", borderTop: "1px solid #263349", px: 0.5 }}>
                    <Button
                      size="small"
                      startIcon={<AssessmentOutlined fontSize="small" />}
                      endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                      onClick={() => setExpandedClipId(isExpanded ? null : clip.id)}
                      sx={{ flex: 1, justifyContent: "space-between", color: "#94a3b8", textTransform: "none" }}
                    >
                      {t("clipEditor.evaluationCount", { count: clipEvaluations.length })}
                    </Button>
                    <Tooltip title={t("clipEditor.addEvaluation")}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setActionClip(clip);
                          setExistingEvaluationOpen(true);
                        }}
                        sx={{ color: "#60a5fa" }}
                      >
                        <AddCommentOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("clipEditor.editClip")}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setActionClip(clip);
                          setEditClipOpen(true);
                        }}
                        sx={{ color: "#fbbf24" }}
                      >
                        <EditOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("clipEditor.deleteClip")}>
                      <IconButton size="small" onClick={() => handleDeleteClip(clip)} sx={{ color: "#f87171" }}>
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Collapse in={isExpanded}>
                    <Box sx={{ px: 1.5, pb: 1.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
                      {clipEvaluations.length === 0 ? (
                        <Typography variant="caption" sx={{ color: "#64748b", pt: 1 }}>{t("clipEditor.noEvaluations")}</Typography>
                      ) : (
                        clipEvaluations.map((evaluation) => (
                          <Box
                            key={evaluation.id}
                            sx={{ p: 1, display: "flex", gap: 0.5, alignItems: "flex-start", bgcolor: "#0f172a", borderRadius: 1, borderLeft: `3px solid ${evaluation.isSuccessful ? "#22c55e" : evaluation.isCritical ? "#ef4444" : "#64748b"}` }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="caption" fontWeight={700} display="block">{evaluation.playerName}</Typography>
                              <Typography variant="caption" sx={{ color: "#94a3b8" }} display="block">{evaluation.episodeName} · {evaluation.occurrenceCount}×</Typography>
                              {evaluation.notes && <Typography variant="caption" sx={{ color: "#cbd5e1" }} display="block" noWrap>{evaluation.notes}</Typography>}
                            </Box>
                            <Box sx={{ display: "flex", mt: -0.5, mr: -0.5 }}>
                              <Tooltip title={t("clipEditor.editEvaluation")}>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setEditingEvaluation(evaluation);
                                    setEditEvaluationOpen(true);
                                  }}
                                  sx={{ color: "#fbbf24" }}
                                >
                                  <EditOutlined sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t("clipEditor.deleteEvaluation")}>
                                <IconButton size="small" onClick={() => handleDeleteEvaluation(evaluation)} sx={{ color: "#f87171" }}>
                                  <DeleteOutline sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Collapse>
                </Card>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ p: { xs: 1.5, md: 2 }, minWidth: 0, height: { lg: "100%" }, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!sourceUrl && <Alert severity="warning" sx={{ mb: 2 }}>{t("clipEditor.missingVideo")}</Alert>}
          <Box sx={{ position: "relative", bgcolor: "#000", borderRadius: 2, overflow: "hidden", flex: "1 1 auto", minHeight: 0, width: "100%", boxShadow: "0 18px 45px rgba(0,0,0,.35)" }}>
            {youtubeId ? (
              <Box ref={youtubeContainerRef} sx={{ width: "100%", height: "100%", "& iframe": { width: "100%", height: "100%" } }} />
            ) : sourceUrl ? (
              <video
                ref={nativeVideoRef}
                src={resolveNativeUrl(sourceUrl)}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onLoadedMetadata={(event) => { setDuration(event.currentTarget.duration); setPlayerReady(true); }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            ) : null}
            {!playerReady && sourceUrl && <CircularProgress sx={{ position: "absolute", left: "50%", top: "50%", mt: -2, ml: -2, color: "white" }} />}
          </Box>

          <Box sx={{ mt: 1.5, p: 1.5, flex: "0 0 auto", width: "100%", bgcolor: "#111a2c", border: "1px solid #263349", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Tooltip title={t("clipEditor.backFiveSeconds")}><IconButton onClick={() => seekTo(currentTime - 5)} sx={{ color: "#cbd5e1" }}><Replay /></IconButton></Tooltip>
              <Tooltip title={t("clipEditor.forwardFiveSeconds")}><IconButton onClick={() => seekTo(currentTime + 5)} sx={{ color: "#cbd5e1" }}><Forward5 /></IconButton></Tooltip>
              <IconButton onClick={togglePlayback} disabled={!playerReady} sx={{ bgcolor: "#2563eb", color: "white", "&:hover": { bgcolor: "#1d4ed8" } }}>
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
              <Typography sx={{ minWidth: 112, fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{formatTime(currentTime)} / {formatTime(duration)}</Typography>
              <Slider value={Math.min(currentTime, duration || 0)} max={duration || 1} onChange={(_, value) => seekTo(value as number)} sx={{ mx: 1 }} />
            </Box>

            <Divider sx={{ my: 2, borderColor: "#263349" }} />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(220px, 1fr) auto" }, gap: 2, alignItems: "center" }}>
              <Autocomplete
                options={players}
                getOptionLabel={(option) => `${option.fullName} - ${option.teamName}`}
                value={selectedPlayer}
                onChange={(_, value) => setSelectedPlayer(value)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("clipEditor.playerToAnalyze")}
                    placeholder={t("clipEditor.selectPlayer")}
                    size="small"
                    sx={{
                      "& .MuiInputLabel-root": { color: "#94a3b8" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#0b1220",
                        color: "#e2e8f0",
                        "& fieldset": { borderColor: "#334155" },
                        "&:hover fieldset": { borderColor: "#64748b" },
                        "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                      },
                      "& input::placeholder": { color: "#64748b", opacity: 1 },
                    }}
                  />
                )}
                slotProps={{
                  paper: { sx: { bgcolor: "#111827", color: "#e2e8f0", border: "1px solid #334155" } },
                  listbox: { sx: { "& .MuiAutocomplete-option:hover": { bgcolor: "#1e293b" }, "& .Mui-focused": { bgcolor: "#1e3a5f !important" } } },
                  popupIndicator: { sx: { color: "#94a3b8" } },
                  clearIndicator: { sx: { color: "#94a3b8" } },
                }}
              />
              {clipStart === null ? (
                <Button variant="contained" color="error" size="large" startIcon={<ContentCut />} onClick={beginClip} disabled={!selectedPlayer || !playerReady}>
                  {t("clipEditor.startClipping")}
                </Button>
              ) : (
                <Button variant="contained" color="success" size="large" startIcon={<Stop />} onClick={finishClip}>
                  {t("clipEditor.finishClip")}
                </Button>
              )}
            </Box>

          </Box>
        </Box>
      </Box>

      <CustomModal open={modalOpen} setOpen={setModalOpen} onClose={() => setClipEnd(null)}>
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>{t("clipEditor.createClip")}</Typography>
          {selectedPlayer && clipStart !== null && clipEnd !== null && (
            <AddClip
              matchId={selectedMatch.id}
              matchUrl={sourceUrl}
              initialStartTime={formatTime(clipStart)}
              initialEndTime={formatTime(clipEnd)}
              sourceType={sourceType}
              onCancel={() => setModalOpen(false)}
              onSuccess={(clip) => {
                dispatch(fetchClips({ matchIds: [selectedMatch.id] }));
                setModalOpen(false);
                setCreatedClipId(clip.id);
                setEvaluationOpen(true);
              }}
            />
          )}
        </Box>
      </CustomModal>

      <CustomModal
        open={editClipOpen}
        setOpen={setEditClipOpen}
        onClose={() => setActionClip(null)}
      >
        {actionClip && (
          <EditClip
            clip={actionClip}
            onCancel={() => {
              setEditClipOpen(false);
              setActionClip(null);
            }}
            onSuccess={() => {
              dispatch(fetchClips({ matchIds: [selectedMatch.id] }));
              setEditClipOpen(false);
              setActionClip(null);
            }}
          />
        )}
      </CustomModal>

      <CustomModal
        open={existingEvaluationOpen}
        setOpen={setExistingEvaluationOpen}
        onClose={() => setActionClip(null)}
      >
        {actionClip && (
          <AddEvaluation
            clipId={actionClip.id}
            initialPlayerId={selectedPlayer?.id}
            onCancel={() => {
              setExistingEvaluationOpen(false);
              setActionClip(null);
            }}
            onSuccess={() => {
              dispatch(fetchEvaluations({ matchId: selectedMatch.id }));
              setExpandedClipId(actionClip.id);
              setExistingEvaluationOpen(false);
              setActionClip(null);
            }}
          />
        )}
      </CustomModal>

      <CustomModal
        open={editEvaluationOpen}
        setOpen={setEditEvaluationOpen}
        onClose={() => setEditingEvaluation(null)}
      >
        {editingEvaluation && (
          <EditEvaluation
            evaluation={editingEvaluation}
            onCancel={() => {
              setEditEvaluationOpen(false);
              setEditingEvaluation(null);
            }}
            onSuccess={() => {
              dispatch(fetchEvaluations({ matchId: selectedMatch.id }));
              setEditEvaluationOpen(false);
              setEditingEvaluation(null);
            }}
          />
        )}
      </CustomModal>

      <CustomModal open={evaluationOpen} setOpen={setEvaluationOpen}>
        {createdClipId && selectedPlayer && (
          <AddEvaluation
            clipId={createdClipId}
            initialPlayerId={selectedPlayer.id}
            onCancel={() => {
              setEvaluationOpen(false);
              setClipStart(null);
              setClipEnd(null);
            }}
            onSuccess={() => {
              dispatch(fetchEvaluations({ matchId: selectedMatch.id }));
              setEvaluationOpen(false);
              setClipStart(null);
              setClipEnd(null);
              setCreatedClipId(null);
            }}
          />
        )}
      </CustomModal>
    </Box>
  );
};

export default ClipEditorPage;
