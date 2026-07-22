import React, { useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Maximize2, Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
  fileName: string;
  fileType?: string;
}

export function DocumentViewerModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType = "pdf",
}: DocumentViewerModalProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !fileUrl) return null;

  const isPdf = fileType.includes("pdf") || fileName.toLowerCase().endsWith(".pdf");

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-foreground truncate max-w-md text-sm sm:text-base">
              {fileName}
            </h3>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {!isPdf && (
              <>
                <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom Out">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs font-mono text-muted-foreground w-10 text-center">
                  {zoom}%
                </span>
                <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom In">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleRotate} title="Rotate 90°">
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                  Reset
                </Button>
              </>
            )}

            <a href={fileUrl} target="_blank" rel="noopener noreferrer" download={fileName}>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Download className="w-3.5 h-3.5 mr-1" /> Download
              </Button>
            </a>

            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 bg-neutral-900/90 flex items-center justify-center p-4 overflow-auto relative">
          {isPdf ? (
            <iframe
              src={`${fileUrl}#toolbar=1`}
              title={fileName}
              className="w-full h-full rounded-lg border-0 shadow-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center overflow-auto">
              <img
                src={fileUrl}
                alt={fileName}
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transition: "transform 0.2s ease-in-out",
                }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
