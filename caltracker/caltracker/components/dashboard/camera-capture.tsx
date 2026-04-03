"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Image as ImageIcon, X, RotateCcw, ScanLine, Tag, Camera, Scan } from "lucide-react";
import { cn } from "@/lib/utils";
import { Html5Qrcode } from "html5-qrcode";

export type CameraMode = 'scan-food' | 'barcode' | 'food-label';

interface CameraCaptureProps {
    onCapture: (base64: string) => void;
    onBarcodeScan?: (barcode: string) => void;
    onClose: () => void;
}

export function CameraCapture({ onCapture, onBarcodeScan, onClose }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isMirror, setIsMirror] = useState(false);
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [mode, setMode] = useState<CameraMode>('scan-food');
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        setMounted(true);
        if (mode === 'scan-food') {
            startCamera(facingMode);
        } else if (mode === 'barcode') {
            stopCamera();
            startBarcodeScanner();
        }

        return () => {
            stopCamera();
            stopBarcodeScanner();
        };
    }, [facingMode, mode]);

    const startBarcodeScanner = async () => {
        try {
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode("barcode-reader");
            }

            await scannerRef.current.start(
                { facingMode: facingMode },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 150 },
                    aspectRatio: 1.0
                },
                (decodedText) => {
                    if (onBarcodeScan) {
                        onBarcodeScan(decodedText);
                        handleClose();
                    }
                },
                (errorMessage) => {
                    // Ignore typical frame errors
                }
            );
        } catch (err) {
            console.error("Barcode scanner setup error", err);
            setError("Impossible de démarrer le lecteur de code-barre.");
        }
    };

    const stopBarcodeScanner = () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(console.error);
        }
    };

    const startCamera = async (mode: 'environment' | 'user') => {
        stopBarcodeScanner();
        stopCamera();
        setError(null);
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mode }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
            setStream(newStream);
            setIsMirror(mode === 'user');
        } catch (err) {
            console.error("Impossible d'accéder à la caméra", err);
            // Fallback without facingMode specification
            try {
                const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = fallbackStream;
                }
                setStream(fallbackStream);
                setIsMirror(false); // Defaulting for fallback
            } catch (fallbackErr) {
                console.error("Aucune caméra trouvée", fallbackErr);
                setError("Impossible d'accéder à la caméra de votre appareil.");
            }
        }
    };

    const stopCamera = () => {
        // Must use function scope variable if needed, but stream state might be stale in cleanup hook
        // we'll rely on the video srcObject fallback
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleTakePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Calculate size maintaining aspect ratio (max 800px)
        const MAX_DIMENSION = 800;
        let width = video.videoWidth;
        let height = video.videoHeight;

        if (width > height) {
            if (width > MAX_DIMENSION) {
                height = Math.round((height * MAX_DIMENSION) / width);
                width = MAX_DIMENSION;
            }
        } else {
            if (height > MAX_DIMENSION) {
                width = Math.round((width * MAX_DIMENSION) / height);
                height = MAX_DIMENSION;
            }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw video frame to canvas
        if (isMirror) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(base64);
        stopCamera();
    };

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                if (!canvasRef.current) return;
                const canvas = canvasRef.current;

                const MAX_DIMENSION = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height = Math.round((height * MAX_DIMENSION) / width);
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width = Math.round((width * MAX_DIMENSION) / height);
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                onCapture(canvas.toDataURL('image/jpeg', 0.8));
                stopCamera();
            };
        };
        reader.readAsDataURL(file);
    };

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-between overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={handleClose} className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md active:scale-95 transition-all">
                    <X className="w-6 h-6" />
                </button>
                <div className="text-white bg-black/40 px-5 py-2 rounded-full text-sm font-black tracking-widest backdrop-blur-md border border-white/10 shadow-lg">
                    CAL AI
                </div>
                <button onClick={toggleCamera} className="p-3 bg-black/40 rounded-full text-white backdrop-blur-md active:scale-95 transition-all">
                    <RotateCcw className="w-6 h-6" />
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
                    <div className="bg-neutral-900 border border-white/10 p-6 rounded-3xl text-center space-y-4">
                        <p className="text-white font-bold">{error}</p>
                        <p className="text-sm text-neutral-400">Veuillez autoriser l'accès à la caméra ou sélectionner une photo depuis votre galerie.</p>
                        <button
                            onClick={handleClose}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl mt-4"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            {/* Camera View */}
            <div className="absolute inset-0 z-0 bg-neutral-900 flex items-center justify-center overflow-hidden">
                {mode === 'barcode' ? (
                    <div id="barcode-reader" className="w-full h-full object-cover"></div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className={cn(
                                "w-full h-full object-cover",
                                isMirror ? "scale-x-[-1]" : ""
                            )}
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Visual Camera Guides (only show for Scan Food mode) */}
                        <div className="absolute inset-0 border-[1px] border-white/20 m-10 rounded-[40px] pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
                            <div className="w-16 h-16 border-t-2 border-l-2 border-white/40 absolute top-10 left-10 rounded-tl-3xl"></div>
                            <div className="w-16 h-16 border-t-2 border-r-2 border-white/40 absolute top-10 right-10 rounded-tr-3xl"></div>
                            <div className="w-16 h-16 border-b-2 border-l-2 border-white/40 absolute bottom-10 left-10 rounded-bl-3xl"></div>
                            <div className="w-16 h-16 border-b-2 border-r-2 border-white/40 absolute bottom-10 right-10 rounded-br-3xl"></div>
                        </div>
                    </>
                )}
            </div>

            {/* Controls bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 pt-20 flex flex-col items-center justify-end z-10 gap-8">

                {/* Mode Tabs */}
                <div className="flex gap-2 p-1 bg-black/40 backdrop-blur-md rounded-2xl w-full max-w-sm overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'scan-food', label: 'Scan Food', icon: Scan },
                        { id: 'barcode', label: 'Barcode', icon: ScanLine },
                        { id: 'food-label', label: 'Food label', icon: Tag },
                        { id: 'gallery', label: 'Gallery', icon: ImageIcon }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                if (tab.id === 'gallery') {
                                    fileInputRef.current?.click();
                                } else {
                                    setMode(tab.id as CameraMode);
                                }
                            }}
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 p-3 rounded-xl min-w-[80px] transition-all flex-1",
                                mode === tab.id ? "bg-white text-black" : "text-white hover:bg-white/10"
                            )}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="text-[10px] font-bold tracking-wide whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleGalleryUpload}
                        className="hidden"
                    />
                </div>

                {/* Shutter Button Container (Hidden if in Barcode auto-scan mode) */}
                <div className="flex w-full items-center justify-center h-24 relative mb-4">
                    {mode !== 'barcode' && (
                        <button
                            onClick={handleTakePhoto}
                            disabled={!!error}
                            className="absolute left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-[3px] border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            <div className="w-[68px] h-[68px] rounded-full bg-white group-active:w-[60px] group-active:h-[60px] transition-all"></div>
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
