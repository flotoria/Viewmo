'use client'
import React, { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import Button from '@mui/material/Button';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';


export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [videoId, setVideoId] = useState<string>('');
  const [link, setLink] = useState<string>('');

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
        if (photo) {
          await sendPhoto(photo);
        }
      }, 4000);
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
      const result = await response.json();
      if (result.face && result.face.predictions && result.face.predictions[0] && result.face.predictions[0].emotions) {
        setEmotions(result.face.predictions[0].emotions);
      } else {
        setEmotions([]);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLink(url);
    const id = extractVideoId(url);
    setVideoId(id);
  };

  const extractVideoId = (url: string) => {
    const urlParts = url.split('v=');
    return urlParts[1] ? urlParts[1].split('&')[0] : '';
  };

  return (
    <>
    <div className='flex flex-row'>
      <div className = "flex flex-col">
      <form>
          <label className="text-black">
            Media Link
            <input type="text" name="link" value={link} onChange={handleChange} />
          </label>
        </form>
        {videoId && <YouTube videoId={videoId} />}
      </div>
      <div className = 'flex flex-col'>
      <video ref={videoRef} autoPlay width="640" height="480" />
      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
     
      <Button
      onClick={() => setRecording((prev) => !prev)}
      variant="contained" // You can change the variant to "outlined" or "text" based on your preference
      color="primary" // You can change the color to "secondary" or other available colors
      className="text-black" // You can add your custom styles here
    >
      {recording ? 'Stop Recording' : 'Start Recording'}
    </Button>
      </div>
      { /* photoURL && (
        <div>
          <h3>Captured Photo:</h3>
          <img src={photoURL} alt="Captured" width="640" height="480" />
        </div>
      ) */ }
   
  </div>
  {emotions && (
      <div>
        <h3>Emotion Analysis:</h3>
        <ul>
          {emotions.map((emotion, index) => (
            <li className="text-black" key={index}>{`${emotion.name}: ${(emotion.score * 100).toFixed(2)}%`}</li>
          ))}
        </ul>
      </div>
    )}
  </>
  );
}
