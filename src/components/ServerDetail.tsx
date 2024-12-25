import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import updatingAnimation from "../assets/updating_animation.json";

interface Server {
  _id: string;
  name: string;
  serverId: string;
  fullpath: string;
  status: String;
  mode: String;
  pid: Number;
  cpu: Number;
  memory: Number;
}

function ServerDetail() {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Boolean>(false);
  const [error, setError] = useState("");
  const toggleUpdating = () => {
    setUpdating((prevState) => !prevState);
  };

  function formatBytes(bytes: any) {
    const toMB = bytes / (1024 * 1024); // Convert to MB
    const toGB = bytes / (1024 * 1024 * 1024); // Convert to GB

    if (toGB >= 1) {
      return `${toGB.toFixed(2)} GB`;
    } else {
      return `${toMB.toFixed(2)} MB`;
    }
  }

  useEffect(() => {
    const fetchServer = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://cpanelapi.evhomes.tech/server/${id}`
        );
        setServer(response.data?.data);
      } catch (err) {
        setError("Failed to fetch server details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServer();
  }, [id]);

  const handleUpdate = async () => {
    try {
      toggleUpdating();
      await axios.post(`https://cpanelapi.evhomes.tech/update/${id}`, {
        server: id,
      });
      alert("Server updated successfully!");
      // navigate('/');
    } catch (err) {
      alert("Failed to update server");
      console.error("Error updating server:", err);
    }
    toggleUpdating();
  };
  const handleStart = async () => {
    try {
      toggleUpdating();
      await axios.post(`https://cpanelapi.evhomes.tech/start/${id}`, {
        server: id,
      });
      alert("Server started successfully!");
      // navigate('/');
    } catch (err) {
      alert("Failed to start server");
      console.error("Error updating server:", err);
    }
    toggleUpdating();
  };

  const handleRestart = async () => {
    try {
      toggleUpdating();
      await axios.post(`https://cpanelapi.evhomes.tech/restart/${id}`, {
        server: id,
      });
      alert("Server restart successfully!");
      // navigate('/');
    } catch (err) {
      alert("Failed to restarting server");
      console.error("Error restarting server:", err);
    }
    toggleUpdating();
  };

  const handleStop = async () => {
    try {
      toggleUpdating();
      await axios.post(`https://cpanelapi.evhomes.tech/stop/${id}`, {
        server: id,
      });
      alert("Server stop successfully!");
      // navigate('/');
    } catch (err) {
      alert("Failed to stop server");
      console.error("Error stopping server:", err);
    }
    toggleUpdating();
  };

  if (loading) {
    return <p className="loading-message">Loading server details...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="server-info-container">
      {updating ? (
        <>
          <div className="bg-position"></div>
          <div className="loading-container">
            <Lottie animationData={updatingAnimation} />
          </div>
        </>
      ) : null}
      <div className="server-detail-container">
        <h2 className="title">Server Details</h2>
        <div className="server-detail">
          <p>
            <strong>Name:</strong> {server?.name}
          </p>
          <p>
            <strong>Server ID:</strong> {server?.serverId}
          </p>
          <p>
            <strong>Status: </strong>
            <span
              className={`${
                server?.status === "online"
                  ? "status-active"
                  : "status-inactive"
              }`}
            >
              {server?.status}
            </span>
          </p>
          <p>
            <strong>Fork:</strong> {server?.mode}
          </p>
          <p>
            <strong>CPU:</strong> {server?.cpu?.toString()}%
          </p>
          <p>
            <strong>Memory:</strong> {formatBytes(server?.memory ?? 0)}
          </p>
          <p>
            <strong>Full Path:</strong> {server?.fullpath}
          </p>
        </div>
        {server?.status === "online" ? (
          <button className="update-button update-stop" onClick={handleStop}>
            Stop Server
          </button>
        ) : (
          <button className="update-button" onClick={handleStart}>
            Start Server
          </button>
        )}
        <button
          className="update-button update-restart"
          onClick={handleRestart}
        >
          Restart Server
        </button>

        <button className="update-button update-cls" onClick={handleUpdate}>
          Update Server
        </button>
      </div>
    </div>
  );
}

export default ServerDetail;
