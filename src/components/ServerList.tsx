import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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

function ServerList() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axios.get('https://cpanelapi.evhomes.tech/servers');
        setServers(response.data?.data);
      } catch (err) {
        setError('Failed to fetch servers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  return (
    <div className="server-list-container">
      <h1 className="title">Server Management</h1>
      {loading ? (
        <p className="loading-message">Loading servers...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="server-list">
          {servers.map((server) => (
              <Link to={`/server/${server.serverId}`} className="server-link">
            <li key={server._id} className="server-item">
                {server.name}
              {/* <p className="server-path">{server.fullpath}</p> */}
              <p className={`server-path ${server?.status === "online" ?"status-active" :"status-inactive"}`}>{server?.status}</p>
            </li>
              </Link>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ServerList;
