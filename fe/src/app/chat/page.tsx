"use client";
import React, { useRef, useEffect, useState } from "react";
import YouTube from "react-youtube";
import Button from "@mui/material/Button";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import {useRouter} from "next/navigation";
export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [videoId, setVideoId] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const router = useRouter();


  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera:", err);
      }
    }

    enableCamera();
  }, []);

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return null;
    const context = canvasRef.current.getContext("2d");
    if (context) {
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      return canvasRef.current.toBlob((blob) => {
        if (blob) {
          console.log("blob:", blob);
          setPhotoURL(URL.createObjectURL(blob));
          sendPhoto(blob);
        }
      }, "image/png");
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (recording) {
      intervalId = setInterval(async () => {
        const photo = capturePhoto();
        if (photo) {
          await sendPhoto(photo);
        }
      }, 10000);
    }
    return () => clearInterval(intervalId);
  }, [recording]);

  const sendPhoto = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob, "photo.png");
    let responseToAddVid;
    try {
      const response = await fetch("http://localhost:8000/api/uploadPhoto", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }
      const result = await response.json();
      if (
        result.face &&
        result.face.predictions &&
        result.face.predictions[0]
      ) {
        responseToAddVid = result.face.predictions[0].emotions;
        await fetch("http://localhost:8000/api/addVid", {
          method: "POST",
          headers: { "Content-Type" : "application/json" },
          body: JSON.stringify({ video_id: videoId, emotions: responseToAddVid }),
        })
      } else {
        responseToAddVid = [];
      }
    } catch (err) {
      console.error("Error sending photo:", err);
    }
  };

  const dataURLtoBlob = (dataUrl: string) => {
    const parts = dataUrl.split(",");
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLink(url);
    const id = extractVideoId(url);
    // router.push(`/chat/${id}`);
    setVideoId(id);
  };

  const extractVideoId = (url: string) => {
    const urlParts = url.split("v=");
    return urlParts[1] ? urlParts[1].split("&")[0] : "";
  };

  return (
    <>
      <div className="flex flex-col md:flex-row space-y-4 items-center justify-center md:space-y-0 md:space-x-4 p-4">
        <div className="flex flex-col space-y-4">
          {videoId && (
            <YouTube
              videoId={videoId}
              className="rounded-lg shadow-lg w-full h-auto"
              opts={{
                height: "480",
                width: "854",
                playerVars: {
                  autoplay: 1,
                },
              }}
            />
          )} 

        </div>
        <div className="flex flex-col space-y-4 items-center justify-center h-screen">
          <form className="space-y-4">
            <label className="block text-4xl font-bold text-gray-700 text-center">
              Media Link
              <input
                type="text"
                name="link"
                value={link}
                onChange={handleChange}
                placeholder="Enter media link here..."
                className="mt-1 mb-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </form>
          <video
            ref={videoRef}
            autoPlay
            width="800"
            height="600"
            className="rounded-lg shadow-lg"
          />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            style={{ display: "none" }}
          />

          {link !== "" && (
          <Button
          onClick={() => setRecording((prev) => !prev)}
          variant="contained"
          color="primary"
          className={`w-48 !text-white p-3 rounded-lg transition`}
          style={{
            background: recording
              ? "linear-gradient(45deg, #FF5858, #F09819)"
              : "linear-gradient(45deg, #56CCF2, #2F80ED)",
          }}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </Button>)}
        </div>
      </div>
   
    </>
  );
}
