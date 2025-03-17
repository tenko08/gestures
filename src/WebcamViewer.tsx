import React, { useRef, useEffect, useState } from "react";

export function WebcamViewer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const startWebcam = async () => {
    try {
      console.log("Requesting webcam permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Webcam permission granted, stream received:", stream);
      
      // Set hasPermission first to render the video element
      setHasPermission(true);
      
      // Wait for React to render the video element
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (videoRef.current) {
        console.log("Video element found, setting stream...");
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      } else {
        console.error("Video element not found! videoRef:", videoRef);
        // Reset permission if video element isn't available
        setHasPermission(false);
        setError("Failed to initialize video element. Please try again.");
      }
    } catch (err) {
      setError("Failed to access webcam. Please ensure you have given permission.");
      console.error("Webcam error:", err);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup: stop all tracks when component unmounts
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="mt-8 mx-auto w-full max-w-2xl">
      {!hasPermission ? (
        <button
          onClick={startWebcam}
          className="bg-[#fbf0df] text-[#1a1a1a] px-5 py-2 rounded-lg font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px"
        >
          Start Webcam
        </button>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-xl border-2 border-[#fbf0df]"
        />
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
} 