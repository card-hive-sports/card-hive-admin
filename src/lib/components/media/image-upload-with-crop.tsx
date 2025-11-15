'use client';

import {
  ChangeEventHandler,
  DragEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {clsx} from "clsx";
import {
  CreateMediaUploadPayload,
  MediaUploadProgress,
  mediaAPI,
} from "@/lib";
import {GameButton} from "@/lib/ui";

type PresetDimensions = {
  width: number;
  height: number;
};

export type ImagePreset = {
  id: string;
  label: string;
  ratio: number;
  helperText?: string;
  previewDimensions?: PresetDimensions;
  outputDimensions?: PresetDimensions;
  defaultZoom?: number;
};

const DEFAULT_PRESETS: ImagePreset[] = [
  {
    id: "avatar",
    label: "Avatar",
    ratio: 1,
    helperText: "Perfect square for profile avatars.",
    previewDimensions: { width: 240, height: 240 },
    outputDimensions: { width: 500, height: 500 },
    defaultZoom: 1.2,
  },
  {
    id: "banner",
    label: "Banner",
    ratio: 16 / 9,
    helperText: "Wide canvas for banners or headers.",
    previewDimensions: { width: 320, height: 180 },
    outputDimensions: { width: 1280, height: 720 },
    defaultZoom: 1,
  },
  {
    id: "thumbnail",
    label: "Thumbnail",
    ratio: 4 / 3,
    helperText: "Legacy thumbnail dimensions.",
    previewDimensions: { width: 260, height: 195 },
    outputDimensions: { width: 640, height: 480 },
    defaultZoom: 1,
  },
];

type ZoomRange = {
  min: number;
  max: number;
  step?: number;
};

type MediaUploadPayloadSource = CreateMediaUploadPayload | (() => CreateMediaUploadPayload | undefined);

export type ImageUploadWithCropProps = {
  label?: string;
  description?: string;
  presets?: ImagePreset[];
  initialPresetId?: string;
  payload?: MediaUploadPayloadSource;
  onUploadSuccess?: (response: MediaUploadProgress) => void;
  onUploadError?: (error: unknown) => void;
  onUploadStart?: () => void;
  uploadButtonLabel?: string;
  accept?: string;
  zoomRange?: ZoomRange;
  className?: string;
  dropZoneLabel?: string;
  showUploadedPreview?: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const resolvePresetDimensions = (preset: ImagePreset): { preview: PresetDimensions; output: PresetDimensions } => {
  const safeRatio = preset.ratio > 0 ? preset.ratio : 1;
  const preview =
    preset.previewDimensions ??
    {
      width: 220,
      height: Math.max(60, Math.round(220 / safeRatio)),
    };
  const output =
    preset.outputDimensions ??
    {
      width: Math.max(preview.width, 320),
      height: Math.max(preview.height, Math.round(preview.width / safeRatio)),
    };

  return { preview, output };
};

const getCropArea = (
  image: HTMLImageElement,
  ratio: number,
  zoom: number,
  offsetX: number,
  offsetY: number,
) => {
  const safeRatio = ratio > 0 ? ratio : 1;
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const requestedZoom = Math.max(zoom, 0.1);

  let cropWidth = width / requestedZoom;
  let cropHeight = cropWidth / safeRatio;

  if (cropHeight > height) {
    cropHeight = height / requestedZoom;
    cropWidth = cropHeight * safeRatio;
  }

  cropWidth = Math.min(cropWidth, width);
  cropHeight = Math.min(cropHeight, height);

  const maxX = Math.max(width - cropWidth, 0);
  const maxY = Math.max(height - cropHeight, 0);
  const normalizedX = clamp(offsetX / 100, 0, 1);
  const normalizedY = clamp(offsetY / 100, 0, 1);

  return {
    sx: normalizedX * maxX,
    sy: normalizedY * maxY,
    sw: cropWidth,
    sh: cropHeight,
  };
};

const drawCropToCanvas = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  preset: ImagePreset,
  zoom: number,
  offsetX: number,
  offsetY: number,
  dims: PresetDimensions,
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const canvasDims = resolvePresetDimensions(preset);
  const safeDims = dims ?? canvasDims.preview;
  const cropArea = getCropArea(image, preset.ratio, zoom, offsetX, offsetY);
  canvas.width = safeDims.width;
  canvas.height = safeDims.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, cropArea.sx, cropArea.sy, cropArea.sw, cropArea.sh, 0, 0, canvas.width, canvas.height);
};

const resolvePayload = (payload?: MediaUploadPayloadSource): CreateMediaUploadPayload | undefined => {
  if (!payload) return undefined;
  if (typeof payload === "function") {
    try {
      return payload();
    } catch (error) {
      console.error("Failed to resolve media payload", error);
      return undefined;
    }
  }
  return payload;
};

export const ImageUploadWithCrop = ({
  label = "Image",
  description,
  presets,
  initialPresetId,
  payload,
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  uploadButtonLabel = "Upload Image",
  accept = "image/*",
  zoomRange,
  className,
  dropZoneLabel = "Drop or choose an image",
  showUploadedPreview = true,
}: ImageUploadWithCropProps) => {
  const [selectedPresetId, setSelectedPresetId] = useState(initialPresetId ?? DEFAULT_PRESETS[0].id);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(50);
  const [offsetY, setOffsetY] = useState(50);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [pendingFileId, setPendingFileId] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<MediaUploadProgress | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopProgressPolling = useCallback(() => {
    if (progressPollRef.current) {
      clearInterval(progressPollRef.current);
      progressPollRef.current = null;
    }
  }, []);
  const resolvedZoomRange = useMemo(
    () => ({
      min: zoomRange?.min ?? 1,
      max: zoomRange?.max ?? 3,
      step: zoomRange?.step ?? 0.05,
    }),
    [zoomRange],
  );

  const effectivePresets = useMemo(
    () => (presets && presets.length ? presets : DEFAULT_PRESETS),
    [presets],
  );

  const currentPreset = useMemo(
    () => effectivePresets.find((preset) => preset.id === selectedPresetId) ?? effectivePresets[0],
    [effectivePresets, selectedPresetId],
  );

  useEffect(() => {
    if (!effectivePresets.length) return;
    if (
      initialPresetId &&
      effectivePresets.some((preset) => preset.id === initialPresetId) &&
      selectedPresetId !== initialPresetId
    ) {
      setSelectedPresetId(initialPresetId);
      return;
    }
    if (!effectivePresets.some((preset) => preset.id === selectedPresetId)) {
      setSelectedPresetId(effectivePresets[0].id);
    }
  }, [effectivePresets, initialPresetId, selectedPresetId]);

  useEffect(() => {
    if (!currentPreset) return;
    const nextZoom = clamp(currentPreset.defaultZoom ?? resolvedZoomRange.min, resolvedZoomRange.min, resolvedZoomRange.max);
    setZoom(nextZoom);
    setOffsetX(50);
    setOffsetY(50);
  }, [currentPreset, resolvedZoomRange.min, resolvedZoomRange.max]);

  useEffect(() => {
    if (!imageSrc) {
      setSourceImage(null);
      return;
    }
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setSourceImage(img);
    };
    return () => {
      img.onload = null;
    };
  }, [imageSrc]);

  useEffect(() => {
    if (!previewCanvasRef.current || !sourceImage || !currentPreset) return;
    const preview = resolvePresetDimensions(currentPreset).preview;
    drawCropToCanvas(
      previewCanvasRef.current,
      sourceImage,
      currentPreset,
      zoom,
      offsetX,
      offsetY,
      preview,
    );
  }, [sourceImage, currentPreset, zoom, offsetX, offsetY]);

  useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  useEffect(() => {
    if (!pendingFileId) {
      stopProgressPolling();
      setProgressState(null);
      return;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const progress = await mediaAPI.getFileUploadProgress(pendingFileId);
        if (cancelled) return;
        setProgressState(progress);

        if (progress.status === "COMPLETED" || progress.progress >= 100) {
          stopProgressPolling();
          setPendingFileId(null);
          setProgressState(null);
          setUploadedPreviewUrl(progress.url ?? null);
          setIsUploading(false);
          onUploadSuccess?.(progress);
        } else if (progress.status === "FAILED") {
          stopProgressPolling();
          setPendingFileId(null);
          setProgressState(null);
          setIsUploading(false);
          onUploadError?.(new Error("Upload failed"));
        }
      } catch (error) {
        if (cancelled) return;
        stopProgressPolling();
        setPendingFileId(null);
        setProgressState(null);
        setIsUploading(false);
        onUploadError?.(error);
      }
    };

    poll();
    progressPollRef.current = setInterval(poll, 1500);

    return () => {
      cancelled = true;
      stopProgressPolling();
    };
  }, [pendingFileId, onUploadError, onUploadSuccess, stopProgressPolling]);

  const handleFile = useCallback(
    (file: File) => {
      if (!file) return;
      setSelectedFile(file);
      setUploadedPreviewUrl(null);
      const objectUrl = URL.createObjectURL(file);
      setImageSrc(objectUrl);
    },
    [],
  );

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    event.target.value = "";
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragStart: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragEnd: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleUpload = async () => {
    if (!selectedFile || !sourceImage || !currentPreset) return;
    setIsUploading(true);
    setProgressState(null);
    setPendingFileId(null);
    onUploadStart?.();

    try {
      const { output } = resolvePresetDimensions(currentPreset);
      const canvas = document.createElement("canvas");
      drawCropToCanvas(canvas, sourceImage, currentPreset, zoom, offsetX, offsetY, output);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, selectedFile.type || "image/png");
      });
      if (!blob) {
        throw new Error("Unable to extract cropped image");
      }
      const croppedFile = new File([blob], selectedFile.name, { type: selectedFile.type || "image/png" });
      const response = await mediaAPI.uploadFile(croppedFile, resolvePayload(payload));
      setPendingFileId(response.id);
      setProgressState({
        id: response.id,
        status: "PENDING",
        progress: 0,
      });
    } catch (error) {
      onUploadError?.(error);
      setIsUploading(false);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
  };

  const handleReset = () => {
    stopProgressPolling();
    setPendingFileId(null);
    setProgressState(null);
    setIsUploading(false);
    setSelectedFile(null);
    setImageSrc(null);
    setSourceImage(null);
    setUploadedPreviewUrl(null);
    setZoom(resolvedZoomRange.min);
    setOffsetX(50);
    setOffsetY(50);
    setSelectedPresetId(effectivePresets[0]?.id ?? selectedPresetId);
  };

  const previewDimensions = currentPreset ? resolvePresetDimensions(currentPreset).preview : { width: 220, height: 220 };
  const uploadDisabled = !selectedFile || !sourceImage || isUploading;

  return (
    <div className={clsx("space-y-4 rounded-2xl border border-white/20 bg-black/30 p-5", className)}>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">{label}</p>
        {description && <p className="text-xs text-white/60">{description}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {effectivePresets.map((preset) => {
            const isActive = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset.id)}
                className={clsx(
                  "rounded-2xl border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
                  isActive
                    ? "border-[#CEFE10] bg-white/10 text-white"
                    : "border-white/10 bg-white/0 text-white/60 hover:border-white/30",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        {currentPreset?.helperText && (
          <p className="text-[11px] text-white/50">{currentPreset.helperText}</p>
        )}
      </div>

      <div
        className={clsx(
          "rounded-2xl border border-dashed bg-white/5 p-4 transition",
          dragging ? "border-[#CEFE10]" : "border-white/20",
        )}
        onDragOver={handleDragStart}
        onDragEnter={handleDragStart}
        onDragLeave={handleDragEnd}
        onDrop={handleDrop}
      >
        {imageSrc ? (
          <canvas
            ref={previewCanvasRef}
            width={previewDimensions.width}
            height={previewDimensions.height}
            className="w-full rounded-xl border border-white/10 object-cover"
            style={{ aspectRatio: `${previewDimensions.width} / ${previewDimensions.height}` }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-center text-xs text-white/60">
            <p>{dropZoneLabel}</p>
            <button
              type="button"
              className="text-[11px] font-semibold uppercase tracking-wider text-[#CEFE10]"
              onClick={() => inputRef.current?.click()}
            >
              Browse files
            </button>
            <p className="text-[10px] text-white/40">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && (
        <p className="text-[11px] text-white/50">
          Selected file: <span className="font-semibold text-white">{selectedFile.name}</span>
        </p>
      )}

      {sourceImage && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/60">
            <span>Zoom {zoom.toFixed(2)}x</span>
            <span>Preset ratio {currentPreset?.ratio.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={resolvedZoomRange.min}
            max={resolvedZoomRange.max}
            step={resolvedZoomRange.step}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-[#CEFE10]"
          />
          <div className="grid grid-cols-2 gap-3 text-[11px] text-white/60">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-white/60">Horizontal shift</label>
              <input
                type="range"
                min={0}
                max={100}
                value={offsetX}
                onChange={(event) => setOffsetX(Number(event.target.value))}
                className="w-full accent-[#CEFE10]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-white/60">Vertical shift</label>
              <input
                type="range"
                min={0}
                max={100}
                value={offsetY}
                onChange={(event) => setOffsetY(Number(event.target.value))}
                className="w-full accent-[#CEFE10]"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <GameButton
          onClick={handleUpload}
          disabled={uploadDisabled}
          className="flex-1 min-w-[150px]"
        >
          {isUploading ? "Uploading..." : uploadButtonLabel}
        </GameButton>
        <GameButton variant="secondary" onClick={handleReset} disabled={isUploading} className="flex-1 min-w-[150px]">
          Reset
        </GameButton>
      </div>

      {pendingFileId && progressState && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-white/60">
            <span>{progressState.status.replace("_", " ")}</span>
            <span>{Math.min(progressState.progress, 100)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#CEFE10] to-[#9CD80D]"
              style={{ width: `${Math.min(progressState.progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {showUploadedPreview && uploadedPreviewUrl && (
        <div className="flex items-center gap-3 text-[11px] text-white/60">
          <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10">
            <img src={uploadedPreviewUrl} alt="Uploaded preview" className="h-full w-full object-cover" />
          </div>
          <p className="text-[11px] text-white/60">Uploaded media saved.</p>
        </div>
      )}
    </div>
  );
};
