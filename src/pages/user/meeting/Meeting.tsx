import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button"; // Assuming these components are provided by the user
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming these components are provided by the user

// --- PermissionCheck Component ---
// This component handles requesting and checking camera and microphone permissions.
const PermissionCheck: React.FC<{ onPermissionGranted: () => void }> = ({
  onPermissionGranted,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<{
    camera: boolean;
    microphone: boolean;
    checking: boolean;
  }>({
    camera: false,
    microphone: false,
    checking: false,
  });

  // Function to request media device permissions
  const requestPermissions = async () => {
    setPermissionStatus((prev) => ({ ...prev, checking: true }));

    try {
      // Request both video and audio streams initially for a comprehensive check
      // User can later choose to disable webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Stop tracks immediately after getting them to release resources
      stream.getTracks().forEach((track) => track.stop());

      // Update permission status to granted
      setPermissionStatus({
        camera: true,
        microphone: true,
        checking: false,
      });

      toast.success("Camera và microphone đã được cấp quyền!");
      onPermissionGranted(); // Callback to parent when permissions are granted
    } catch (error) {
      console.error("Lỗi quyền:", error);
      setPermissionStatus((prev) => ({ ...prev, checking: false }));

      // Provide user-friendly error messages based on the error type
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          toast.error(
            "Quyền truy cập camera/microphone bị từ chối. Vui lòng cấp quyền và làm mới trang."
          );
        } else if (error.name === "NotFoundError") {
          toast.error("Không tìm thấy camera hoặc microphone trên thiết bị.");
        } else if (error.name === "NotReadableError") {
          toast.error(
            "Camera hoặc microphone đang được sử dụng bởi ứng dụng khác."
          );
        } else {
          toast.error(`Lỗi quyền: ${error.message}`);
        }
      }
    }
  };

  // Effect to check initial permission status on component mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Query permission status for camera and microphone
        const cameraPermission = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        const micPermission = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });

        // If both are granted, update state and call onPermissionGranted
        // Or if only microphone is granted and camera is not required by default
        if (
          (cameraPermission.state === "granted" &&
            micPermission.state === "granted") ||
          micPermission.state === "granted"
        ) {
          setPermissionStatus({
            camera: cameraPermission.state === "granted",
            microphone: micPermission.state === "granted",
            checking: false,
          });
          onPermissionGranted();
        }
      } catch {
        // Fallback if navigator.permissions.query is not supported
        console.log("Kiểm tra quyền không được hỗ trợ, sẽ yêu cầu trực tiếp");
      }
    };

    checkPermissions();
  }, [onPermissionGranted]);

  // If permissions are already granted, render nothing
  // Only require microphone to be granted to proceed
  if (permissionStatus.microphone) {
    return null;
  }

  // Render the permission request card
  return (
    <Card className="p-6 max-w-md mx-auto mt-8 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-center text-gray-800">
          Yêu cầu quyền truy cập Camera & Microphone
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6 text-center">
          Để tham gia cuộc họp, vui lòng cấp quyền truy cập microphone. Quyền
          truy cập camera là tùy chọn.
        </p>
        <div className="space-y-3 mb-6">
          <p className="flex items-center text-lg">
            <span
              className={`w-4 h-4 rounded-full mr-3 ${
                permissionStatus.camera ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            Camera:{" "}
            <span
              className={`font-semibold ${
                permissionStatus.camera ? "text-green-700" : "text-gray-500"
              }`}
            >
              {permissionStatus.camera ? "Đã cấp" : "Cần cấp (Tùy chọn)"}
            </span>
          </p>
          <p className="flex items-center text-lg">
            <span
              className={`w-4 h-4 rounded-full mr-3 ${
                permissionStatus.microphone ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            Microphone:{" "}
            <span
              className={`font-semibold ${
                permissionStatus.microphone ? "text-green-700" : "text-gray-500"
              }`}
            >
              {permissionStatus.microphone ? "Đã cấp" : "Cần cấp (Bắt buộc)"}
            </span>
          </p>
        </div>
        <Button
          onClick={requestPermissions}
          disabled={permissionStatus.checking}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          {permissionStatus.checking
            ? "Đang yêu cầu quyền..."
            : "Cấp quyền Camera & Microphone"}
        </Button>
        <div className="mt-6 text-sm text-gray-500 border-t pt-4 border-gray-200">
          <p className="font-semibold text-gray-700 mb-2">
            <strong>Nếu bạn thấy popup:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Nhấn "Cho phép" khi được hỏi</li>
            <li>
              Nếu vô tình từ chối, nhấn vào biểu tượng camera ở thanh địa chỉ
              trình duyệt
            </li>
            <li>Chọn "Luôn cho phép" cho trang này</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

// --- ParticipantView Component ---
// Displays an individual participant's video and audio streams.
const ParticipantView: React.FC<{ participantId: string }> = ({
  participantId,
}) => {
  const micRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Use useParticipant hook to get participant's media streams and status
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  // Memoize video stream to prevent unnecessary re-creations
  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
    return null; // Return null if webcam is off or stream is not available
  }, [webcamStream, webcamOn]);

  // Effect to attach video stream to the video element
  useEffect(() => {
    if (videoRef.current) {
      if (webcamOn && videoStream) {
        videoRef.current.srcObject = videoStream;
        videoRef.current
          .play()
          .catch((error) =>
            console.error("videoRef.current.play() failed", error)
          );
      } else {
        videoRef.current.srcObject = null; // Clear srcObject if webcam is off
      }
    }
  }, [videoStream, webcamOn]);

  // Effect to attach audio stream to the audio element
  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("micRef.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null; // Clear srcObject if mic is off
      }
    }
  }, [micStream, micOn]);

  return (
    <Card className="w-full h-full bg-gray-800 text-white overflow-hidden relative flex flex-col border border-[#eee]">
      <CardContent className="p-0 flex-1 flex items-center justify-center">
        {webcamOn && videoStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal} // Mute local participant's video to avoid echo
            className="w-full h-full object-cover rounded-lg"
            onError={(err) => {
              console.error("participant video error:", err);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center rounded-lg">
            <span className="text-gray-400 text-lg">
              {displayName || "Người tham gia"}
            </span>
            <span className="text-gray-500 text-sm mt-2">
              Camera đã tắt hoặc không có stream
            </span>
          </div>
        )}
        <audio ref={micRef} autoPlay muted={isLocal} /> {/* Mute local audio */}
      </CardContent>
    </Card>
  );
};

// --- Controls Component ---
// Provides buttons to toggle mic, webcam, and leave the meeting.
const Controls: React.FC = () => {
  const { leave, toggleMic, toggleWebcam, localParticipant } = useMeeting();
  const micOn = localParticipant?.micOn || false;
  const webcamOn = localParticipant?.webcamOn || false;

  const handleToggleMic = () => {
    if (toggleMic) {
      toggleMic();
      toast.success(`Mic đã ${micOn ? "tắt" : "bật"}`);
    } else {
      toast.error("Không thể bật/tắt mic");
    }
  };

  const handleToggleWebcam = () => {
    if (toggleWebcam) {
      toggleWebcam();
      toast.success(`Webcam đã ${webcamOn ? "tắt" : "bật"}`);
    } else {
      toast.error("Không thể bật/tắt webcam");
    }
  };

  const handleLeaveMeeting = () => {
    leave();
    toast.success("Đã rời cuộc họp!");
    // Redirect to home page (simulated in Canvas environment)
    window.location.href = "/"; // Or window.location.reload()
  };

  return (
    <div className="flex items-center justify-center gap-6 bg-gray-900 p-4 rounded-full shadow-lg">
      <Button
        onClick={handleToggleMic}
        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
          micOn
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-gray-200"
        }`}
      >
        {micOn ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3zm0 0V9m0 6h.01"
            />
          </svg>
        )}
        <span className="ml-2 hidden sm:inline">
          {micOn ? "Tắt Mic" : "Bật Mic"}
        </span>
      </Button>
      <Button
        onClick={handleToggleWebcam}
        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
          webcamOn
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-gray-200"
        }`}
      >
        {webcamOn ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 12a3 3 0 100-6 3 3 0 000 6zm0 0v6a3 3 0 100-6zm0 0h.01"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 12a3 3 0 100-6 3 3 0 000 6zm0 0v6a3 3 0 100-6zm0 0h.01M21 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
        <span className="ml-2 hidden sm:inline">
          {webcamOn ? "Tắt Cam" : "Bật Cam"}
        </span>
      </Button>
      <Button
        onClick={handleLeaveMeeting}
        className="px-6 py-3 rounded-full font-semibold bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span className="ml-2 hidden sm:inline">Rời Cuộc Họp</span>
      </Button>
    </div>
  );
};

// --- MeetingView Component ---
// Manages the layout of participants and meeting controls.
const MeetingView: React.FC = () => {
  const { join, participants, localParticipant } = useMeeting();
  const [isMeetingJoined, setIsMeetingJoined] = useState(false);

  // Combine local and remote participants for a unified grid
  const allParticipants = useMemo(() => {
    const all = Array.from(participants.values());
    // Ensure local participant is always present if available
    if (localParticipant && !all.some((p) => p.id === localParticipant.id)) {
      all.unshift(localParticipant); // Add local participant to the beginning
    }
    return all;
  }, [participants, localParticipant]);

  // Auto-join the meeting after a short delay
  useEffect(() => {
    // Only attempt to join if not already joined
    if (!isMeetingJoined && join) {
      const timer = setTimeout(() => {
        join();
        setIsMeetingJoined(true);
        toast.success("Tham gia cuộc họp thành công!");
      }, 500); // Small delay to ensure meeting context is ready
      return () => clearTimeout(timer);
    }
  }, [join, isMeetingJoined]); // Depend on 'join' function and isMeetingJoined state

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white font-sans">
      {/* Header for Meeting ID */}
      <header className="p-4 bg-gray-800 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">
          Mã Cuộc Họp:{" "}
          <span className="text-blue-400">{useMeeting().meetingId}</span>
        </h1>
        {/* You can add more header elements here like meeting title, time etc. */}
      </header>

      {/* Main Content Area: All Participants Grid */}
      <div className="flex-1 p-4 overflow-hidden">
        {/* Grid for all participants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full overflow-y-auto ">
          {allParticipants.length > 0 ? (
            allParticipants.map((participant) => (
              <ParticipantView
                key={participant.id}
                participantId={participant.id}
              />
            ))
          ) : (
            <div className="col-span-full h-full flex items-center justify-center bg-gray-900 rounded-xl shadow-inner">
              <div className="text-gray-400 text-lg text-center">
                Đang chờ người tham gia...
                {/* Removed the manual join button as useEffect handles auto-join */}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls at the bottom */}
      <div className="flex justify-center p-4 bg-gray-800 rounded-t-3xl shadow-2xl">
        <Controls />
      </div>
    </div>
  );
};

// --- Main Meeting Component ---
// This is the entry point for the meeting application.
const Meeting: React.FC = () => {
  // Parse query parameters directly from window.location.search
  const query = new URLSearchParams(window.location.search);
  const roomId = query.get("roomId");
  const token = query.get("token");

  // Placeholder for VITE_VIDEOSDK_API_KEY. In a real environment, this would be loaded from .env
  const VIDEOSDK_API_KEY =
    typeof import.meta.env !== "undefined"
      ? import.meta.env.VITE_VIDEOSDK_API_KEY
      : "YOUR_VIDEOSDK_API_KEY_HERE";

  console.log("roomId:", roomId);
  console.log("token:", token);
  console.log("API Key:", VIDEOSDK_API_KEY);

  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Check for required parameters
  if (
    !roomId ||
    !token ||
    !VIDEOSDK_API_KEY ||
    VIDEOSDK_API_KEY === "YOUR_VIDEOSDK_API_KEY_HERE"
  ) {
    console.error("Thiếu tham số bắt buộc:", {
      roomId,
      token,
      apiKey: VIDEOSDK_API_KEY,
    });
    toast.error("Thiếu tham số cuộc họp bắt buộc.");
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="p-6 max-w-md mx-auto shadow-lg rounded-xl bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-500 text-center">
              Lỗi: Thiếu tham số cuộc họp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-center">
              Vui lòng đảm bảo cung cấp roomId, token và API Key hợp lệ.
            </p>
            <p className="text-gray-400 text-sm mt-4 text-center">
              Ví dụ URL: `?roomId=your_room_id&token=your_token`
            </p>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    );
  }

  // Render permission check first
  if (!permissionsGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <PermissionCheck
          onPermissionGranted={() => setPermissionsGranted(true)}
        />
        <Toaster />
      </div>
    );
  }

  // Once permissions are granted, render the MeetingProvider and MeetingView
  return (
    <MeetingProvider
      config={{
        meetingId: roomId,
        name: "Participant", // You can customize the participant's name
        micEnabled: true, // Mic is enabled by default
        webcamEnabled: false, // Webcam is disabled by default
        debugMode: true, // Enable debug mode for more console logs
      }}
      token={token}
    >
      <MeetingView />
      <Toaster /> {/* Toaster for displaying toast notifications */}
    </MeetingProvider>
  );
};

export default Meeting;
