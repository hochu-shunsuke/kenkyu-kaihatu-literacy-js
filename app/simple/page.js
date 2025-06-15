'use client';

import { useState, useRef, useEffect } from 'react';
import './simple.css';

export default function SimplePage() {
  // カメラ関連
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);

  // 位置情報
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // マイク録音
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // その他の機能
  const [counter, setCounter] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  const [systemInfo, setSystemInfo] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでの初期化
  useEffect(() => {
    setIsClient(true);
  }, []);

  // システム情報をクライアントサイドで取得
  useEffect(() => {
    if (isClient) {
      setSystemInfo({
        userAgent: navigator.userAgent.substring(0, 80) + '...',
        screenSize: `${screen.width} × ${screen.height}`,
        language: navigator.language,
        platform: navigator.platform,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    }
  }, [isClient]);

  // カメラ開始
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('カメラエラー:', err);
      alert('カメラにアクセスできません');
    }
  };

  // カメラ停止
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // 写真撮影
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const dataURL = canvas.toDataURL('image/png');
      setPhotos(prev => [...prev, { id: Date.now(), url: dataURL, timestamp: new Date() }]);
    }
  };

  // 位置情報取得
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('位置情報はサポートされていません');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        });
        setLocationError(null);
      },
      (error) => {
        setLocationError(`位置情報エラー: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // 録音開始
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      // MediaRecorderのオプション設定
      const options = {
        audioBitsPerSecond: 128000,
        mimeType: 'audio/webm;codecs=opus'
      };
      
      // ブラウザがopusをサポートしていない場合はデフォルトを使用
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/webm';
      }
      
      const recorder = new MediaRecorder(stream, options);
      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: recorder.mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error('録音エラー:', err);
      alert('マイクにアクセスできません: ' + err.message);
    }
  };

  // 録音停止
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  // フルスクリーン切り替え
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="simple-container">
      <h1>シンプルWebアプリケーション</h1>
      <p>このページは昔のHTMLサイト風のシンプルなデザインですが、最新のWeb機能をたくさん使用できます。</p>
      
      <h2>システム情報</h2>
      <div className="info-box">
        <p>このページではカメラ、位置情報、マイク録音、その他の機能を試すことができます。</p>
      </div>
      
      <hr />
      
      <h2>カメラ</h2>
      <p>
        {!cameraActive ? (
          <button onClick={startCamera}>カメラ開始</button>
        ) : (
          <>
            <button onClick={takePhoto}>写真撮影</button>
            <button onClick={stopCamera}>カメラ停止</button>
          </>
        )}
      </p>
      <video ref={videoRef} autoPlay width="320" style={{ display: cameraActive ? 'block' : 'none' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      
      {photos.length > 0 && (
        <div className="photo-gallery">
          <h3>撮影した写真</h3>
          <div className="photos-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="photo-item">
                <img src={photo.url} alt="撮影写真" />
                <br />
                <small>{photo.timestamp.toLocaleTimeString('ja-JP')}</small>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <hr />
      
      <h2>位置情報</h2>
      <p><button onClick={getLocation}>現在地取得</button></p>
      {location && (
        <div className="info-box">
          <h3>位置情報詳細</h3>
          <p><strong>緯度:</strong> {location.latitude.toFixed(6)}</p>
          <p><strong>経度:</strong> {location.longitude.toFixed(6)}</p>
          <p><strong>精度:</strong> {location.accuracy.toFixed(0)}m</p>
          <p><strong>取得時刻:</strong> {location.timestamp.toLocaleString('ja-JP')}</p>
          <p><strong>Google Maps:</strong> <a href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`} target="_blank" rel="noopener noreferrer">地図で見る</a></p>
        </div>
      )}
      {locationError && <p className="error">エラー: {locationError}</p>}
      
      <hr />
      
      <h2>Google Map</h2>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.747386231267!2d139.76454431525392!3d35.68123598019441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bfbd89f700b%3A0x277c49ba34ed38!2z5p2x5Lqs6aeF!5e0!3m2!1sja!2sjp!4v1623456789012!5m2!1sja!2sjp"
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      
      <hr />
      
      <h2>音声録音</h2>
      <p>
        {!isRecording ? (
          <button onClick={startRecording}>🎤 録音開始</button>
        ) : (
          <button onClick={stopRecording}>⏹️ 録音停止</button>
        )}
        {isRecording && <span style={{ color: 'red', marginLeft: '10px' }}>● 録音中...</span>}
      </p>
      {audioURL && (
        <div className="info-box">
          <h3>録音された音声</h3>
          <audio controls src={audioURL}></audio>
          <br />
          <a href={audioURL} download="recording.webm">📁 ダウンロード</a>
        </div>
      )}
      
      <hr />
      
      <h2>その他の機能</h2>
      
      <h3>クリックカウンター</h3>
      <p>
        クリック数: <strong>{counter}</strong> 
        <button onClick={() => setCounter(counter + 1)}>+1</button>
        <button onClick={() => setCounter(0)}>リセット</button>
      </p>
      
      <h3>カラーピッカー</h3>
      <p>
        色選択: <input 
          type="color" 
          value={selectedColor} 
          onChange={(e) => setSelectedColor(e.target.value)}
        />
        選択した色: <strong>{selectedColor}</strong>
      </p>
      <div className="color-display" style={{ backgroundColor: selectedColor }}>
        この色: {selectedColor}
      </div>
      
      <h3>デバイス機能</h3>
      <p>
        <button onClick={toggleFullscreen}>🖥️ フルスクリーン</button>
        <button onClick={() => window.print()}>🖨️ 印刷</button>
        <button onClick={() => {
          const text = prompt('音声で読み上げるテキストを入力してください:');
          if (text && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            speechSynthesis.speak(utterance);
          }
        }}>� 音声読み上げ</button>
      </p>
      
      <h2>基本システム情報</h2>
      <div className="info-box">
        {systemInfo ? (
          <>
            <p><strong>ユーザーエージェント:</strong> {systemInfo.userAgent}</p>
            <p><strong>画面解像度:</strong> {systemInfo.screenSize}</p>
            <p><strong>言語:</strong> {systemInfo.language}</p>
            <p><strong>プラットフォーム:</strong> {systemInfo.platform}</p>
            <p><strong>タイムゾーン:</strong> {systemInfo.timeZone}</p>
          </>
        ) : (
          <p>システム情報を読み込み中...</p>
        )}
      </div>
    </div>
  );
}
