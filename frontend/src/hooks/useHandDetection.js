// src/hooks/useHandDetection.js
// Logika kamera + WebSocket yang sebelumnya ada di BelajarPage.js,
// dipisah supaya bisa dipakai di halaman Gerakan Bebas DAN halaman level.
import { useState, useRef, useCallback, useEffect } from "react";

const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8000/ws";
const FRAME_INTERVAL_MS = 400;
const JPEG_QUALITY = 0.5;

// Balik frame yang DIKIRIM ke backend secara horizontal.
// Biarkan false, kecuali webcam/driver-mu sudah memantulkan gambar (teks di depan
// kamera tampak terbalik) DAN modelmu dilatih dengan gambar tidak terbalik.
const MIRROR_SENT_FRAMES = false;

/**
 * @param {(prediction: string) => void} [onPrediction] dipanggil tiap backend membalas
 */
export default function useHandDetection(onPrediction) {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [prediction, setPrediction] = useState("-");
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);
  const callbackRef = useRef(onPrediction);
  callbackRef.current = onPrediction; // selalu pakai callback terbaru

  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (socketRef.current) {
      const socket = socketRef.current;
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      socket.close();
      socketRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setPrediction("-");
  }, []);

  const sendFrame = useCallback(() => {
    const socket = socketRef.current;
    const video = videoRef.current;
    if (
      !socket ||
      socket.readyState !== WebSocket.OPEN ||
      !video ||
      video.paused ||
      video.ended ||
      video.readyState < 3
    ) {
      return;
    }
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (MIRROR_SENT_FRAMES) {
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    canvas.toBlob(
      (blob) => {
        const current = socketRef.current;
        if (blob && current && current.readyState === WebSocket.OPEN) {
          current.send(blob);
        }
      },
      "image/jpeg",
      JPEG_QUALITY
    );
  }, []);

  const startCamera = useCallback(async () => {
    if (streamRef.current) return; // sudah menyala
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (err) {
      console.error("Error mengakses kamera:", err);
      setError("Tidak dapat mengakses kamera. Pastikan kamu memberi izin.");
      return;
    }

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;
    socket.onopen = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(sendFrame, FRAME_INTERVAL_MS);
      }
    };
    socket.onmessage = (event) => {
      const value = String(event.data);
      setPrediction(value);
      if (callbackRef.current) callbackRef.current(value);
    };
    socket.onclose = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    socket.onerror = () => {
      setError("Koneksi ke server gagal. Pastikan server backend berjalan.");
      stopCamera();
    };
  }, [sendFrame, stopCamera]);

  // Matikan kamera & koneksi saat komponen dilepas
  useEffect(() => stopCamera, [stopCamera]);

  return { videoRef, isCameraOn, prediction, error, startCamera, stopCamera };
}