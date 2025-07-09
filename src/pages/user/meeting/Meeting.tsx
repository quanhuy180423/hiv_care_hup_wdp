import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  const requestPermissions = async () => {
    setPermissionStatus((prev) => ({ ...prev, checking: true }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      stream.getTracks().forEach((track) => track.stop());

      setPermissionStatus({
        camera: true,
        microphone: true,
        checking: false,
      });

      toast.success("Camera và microphone đã được cấp quyền!");
      onPermissionGranted();
    } catch (error) {
      console.error("Lỗi quyền:", error);
      setPermissionStatus((prev) => ({ ...prev, checking: false }));

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

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const cameraPermission = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        const micPermission = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });

        if (
          cameraPermission.state === "granted" &&
          micPermission.state === "granted"
        ) {
          setPermissionStatus({
            camera: true,
            microphone: true,
            checking: false,
          });
          onPermissionGranted();
        }
      } catch {
        console.log("Kiểm tra quyền không được hỗ trợ, sẽ yêu cầu trực tiếp");
      }
    };

    checkPermissions();
  }, [onPermissionGranted]);

  if (permissionStatus.camera && permissionStatus.microphone) {
    return null;
  }

  return (
    <Card className="p-6 max-w-md mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Yêu cầu quyền truy cập Camera & Microphone
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Để tham gia cuộc họp, vui lòng cấp quyền truy cập camera và
          microphone.
        </p>
        <div className="space-y-2 mb-4">
          <p className="flex items-center">
            <span
              className={`w-3 h-3 rounded-full mr-2 ${
                permissionStatus.camera ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            Camera: {permissionStatus.camera ? "Đã cấp" : "Cần cấp"}
          </p>
          <p className="flex items-center">
            <span
              className={`w-3 h-3 rounded-full mr-2 ${
                permissionStatus.microphone ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            Microphone: {permissionStatus.microphone ? "Đã cấp" : "Cần cấp"}
          </p>
        </div>
        <Button
          onClick={requestPermissions}
          disabled={permissionStatus.checking}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {permissionStatus.checking
            ? "Đang yêu cầu quyền..."
            : "Cấp quyền Camera & Microphone"}
        </Button>
        <div className="mt-4 text-sm text-gray-500">
          <p>
            <strong>Nếu bạn thấy popup:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Nhấn "Cho phép" khi được hỏi</li>
            <li>
              Nếu vô tình từ chối, nhấn vào biểu tượng camera ở thanh địa chỉ
            </li>
            <li>Chọn "Luôn cho phép" cho trang này</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

const ParticipantView: React.FC<{ participantId: string }> = ({
  participantId,
}) => {
  const micRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    console.log(`Participant ${participantId} - webcamOn:`, webcamOn);
    console.log(`Participant ${participantId} - webcamStream:`, webcamStream);
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current
        .play()
        .catch((error) =>
          console.error("videoRef.current.play() failed", error)
        );
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoStream, webcamOn]);

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
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  // Kiểm tra thiết bị webcam
  useEffect(() => {
    const checkWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        console.log(
          `Participant ${participantId} - Device check: Webcam available`
        );
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error(
          `Participant ${participantId} - Webcam device error:`,
          error
        );
      }
    };
    checkWebcam();
  }, [participantId]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{displayName || "Không xác định"}</span>
          <div className="flex gap-2">
            <Badge variant={micOn ? "success" : "destructive"}>
              Mic {micOn ? "Bật" : "Tắt"}
            </Badge>
            <Badge variant={webcamOn ? "success" : "destructive"}>
              Webcam {webcamOn ? "Bật" : "Tắt"}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {webcamOn && videoStream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="w-full h-48 object-cover rounded-lg"
            onError={(err) => {
              console.error("participant video error:", err);
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">Không có stream video</span>
          </div>
        )}
        <audio ref={micRef} autoPlay muted={isLocal} />
      </CardContent>
    </Card>
  );
};

const Controls: React.FC = () => {
  const {
    leave,
    toggleMic,
    toggleWebcam,
    localParticipant,
    enableMic,
    enableWebcam,
  } = useMeeting();
  const micOn = localParticipant?.micOn || false;
  const webcamOn = localParticipant?.webcamOn || false;

  useEffect(() => {
    console.log("Mic Status:", micOn);
    console.log("Webcam Status:", webcamOn);
  }, [micOn, webcamOn]);

  const handleToggleMic = () => {
    if (toggleMic) {
      toggleMic();
      toast.success(`Mic ${micOn ? "tắt" : "bật"}`);
    } else {
      toast.error("Không thể bật/tắt mic");
    }
  };

  const handleToggleWebcam = () => {
    if (toggleWebcam) {
      toggleWebcam();
      toast.success(`Webcam ${webcamOn ? "tắt" : "bật"}`);
    } else {
      toast.error("Không thể bật/tắt webcam");
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        onClick={handleToggleMic}
        variant={micOn ? "default" : "outline"}
        className="bg-green-500 hover:bg-green-600"
      >
        Bật/Tắt Mic
      </Button>
      <Button
        onClick={handleToggleWebcam}
        variant={webcamOn ? "default" : "outline"}
        className="bg-yellow-500 hover:bg-yellow-600"
      >
        Bật/Tắt Webcam
      </Button>
      <Button
        onClick={leave}
        variant="destructive"
        className="bg-red-500 hover:bg-red-600"
      >
        Rời Cuộc Họp
      </Button>
    </div>
  );
};

const MeetingView: React.FC = () => {
  const { join, participants, error, enableMic, enableWebcam } = useMeeting();
  const [isMeetingJoined, setIsMeetingJoined] = useState(false);

  useEffect(() => {
    if (error) {
      console.error("Lỗi cuộc họp:", error);
      toast.error(`Lỗi cuộc họp: ${error.message}`);
    }
    if (isMeetingJoined) {
      console.log("Tham gia cuộc họp thành công");
      if (enableWebcam) {
        enableWebcam();
        console.log("enableWebcam called after join");
      }
      if (enableMic) {
        enableMic();
        console.log("enableMic called after join");
      }
    }
  }, [error, isMeetingJoined, enableMic, enableWebcam]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (join) {
        join();
        setIsMeetingJoined(true);
        console.log("Auto-join function called:", join);
        toast.success("Tham gia cuộc họp thành công!");
      } else {
        console.error("Hàm join không xác định");
        toast.error("Không thể tham gia cuộc họp.");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4">
      {isMeetingJoined ? (
        <p className="text-green-600 font-semibold">
          Tham gia cuộc họp thành công
        </p>
      ) : (
        <Button
          onClick={() => {
            if (join) {
              join();
              setIsMeetingJoined(true);
              console.log("Manual join function called:", join);
              toast.success("Tham gia cuộc họp thành công!");
            } else {
              console.error("Hàm join không xác định");
              toast.error("Không thể tham gia cuộc họp.");
            }
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Tham Gia Cuộc Họp
        </Button>
      )}
      <h2 className="text-2xl font-bold mt-4 mb-2">Danh Sách Người Tham Gia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...participants.values()].map((participant) => (
          <ParticipantView
            key={participant.id}
            participantId={participant.id}
          />
        ))}
      </div>
      <div className="mt-4">
        <Controls />
      </div>
    </div>
  );
};

const Meeting: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const roomId = query.get("roomId");
  const token = query.get("token");
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  console.log("roomId:", roomId);
  console.log("token:", token);
  console.log("API Key:", import.meta.env.VITE_VIDEOSDK_API_KEY);

  if (!roomId || !token || !import.meta.env.VITE_VIDEOSDK_API_KEY) {
    console.error("Thiếu tham số bắt buộc:", {
      roomId,
      token,
      apiKey: import.meta.env.VITE_VIDEOSDK_API_KEY,
    });
    toast.error("Thiếu tham số cuộc họp bắt buộc.");
    return (
      <Card className="p-4 max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Lỗi: Thiếu tham số cuộc họp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Vui lòng đảm bảo cung cấp roomId, token và API Key.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!permissionsGranted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <PermissionCheck
          onPermissionGranted={() => setPermissionsGranted(true)}
        />
      </div>
    );
  }

  return (
    <MeetingProvider
      config={{
        meetingId: roomId,
        name: "Participant",
        micEnabled: true,

        webcamEnabled: true,
        debugMode: true,
      }}
      token={token}
    >
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-4">Mã Cuộc Họp: {roomId}</h1>
        <MeetingView />
      </div>
    </MeetingProvider>
  );
};

export default Meeting;
