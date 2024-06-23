'use client'
import React, { useRef, useEffect, useState } from 'react';

export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing the camera:', err);
      }
    }

    enableCamera();
  }, []);

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return null;
    const context = canvasRef.current.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      return canvasRef.current.toBlob((blob) => {
        if (blob) {
          console.log('blob:', blob);
          setPhotoURL(URL.createObjectURL(blob));
          sendPhoto(blob);
        }
      }, 'image/png');
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (recording) {
      intervalId = setInterval(async () => {
        const photo = capturePhoto();
        console.log('photo:', photo);
        if (photo) {
          await sendPhoto(photo);
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [recording]);

  const sendPhoto = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'photo.png');
  
    try {
      const response = await fetch('http://localhost:8000/api/uploadPhoto', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }
    } catch (err) {
      console.error('Error sending photo:', err);
    }
  };

  const dataURLtoBlob = (dataUrl: string) => {
    const parts = dataUrl.split(',');
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div>
      <video ref={videoRef} autoPlay width="640" height="480" />
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
      <div>
        <button onClick={() => setRecording((prev) => !prev)} className='text-black'>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      {photoURL && (
        <div>
          <h3>Captured Photo:</h3>
          <img src={photoURL} alt="Captured" width="640" height="480" />
        </div>
      )}
    </div>
  );
}
