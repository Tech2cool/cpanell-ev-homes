import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface FileResp {
  token: string;
  filename: string;
  downloadUrl: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileResp, setFileResp] = useState<FileResp | null>(null);
  const [message, setMessage] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadProgress(0); // Reset progress for new file selection
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post<FileResp>(
        "https://api.evhomes.tech/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      const { token, filename, downloadUrl } = response.data;
      setFileResp(response.data);
      setMessage(
        `File uploaded successfully:\nToken: ${token}\nFilename: ${filename}\nDownload URL: ${downloadUrl}`
      );
    } catch (error) {
      setMessage("Error uploading file.");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h1>Upload File</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Upload
        </button>
      </form>

      {uploadProgress > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <progress value={uploadProgress} max="100" />
          <span>{uploadProgress}%</span>
        </div>
      )}

      {message && (
        <pre style={{ marginTop: "1rem", color: "green" }}>{message}</pre>
      )}
      <p>{fileResp?.downloadUrl}</p>
    </div>
  );
};

export default FileUpload;

// import React, { useState, ChangeEvent, FormEvent } from "react";
// import axios from "axios";

// interface FileResp {
//   token: string;
//   filename: string;
//   downloadUrl: string;
// }

// const FileUpload: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [fileResp, setFileResp] = useState<FileResp | null>(null);

//   const [message, setMessage] = useState<string>("");

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: FormEvent): Promise<void> => {
//     e.preventDefault();
//     if (!file) {
//       setMessage("Please select a file to upload.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post<FileResp>(
//         "https://api.evhomes.tech/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       const { token, filename, downloadUrl } = response.data;
//       setFileResp(response.data);
//       setMessage(
//         `File uploaded successfully:\nToken: ${token}\nFilename: ${filename}\nDownload URL: ${downloadUrl}`
//       );
//     } catch (error) {
//       setMessage("Error uploading file.");
//       console.error(error);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "0 auto" }}>
//       <h1>Upload File</h1>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: "1rem" }}>
//           <input type="file" onChange={handleFileChange} />
//         </div>
//         <button type="submit" style={{ padding: "0.5rem 1rem" }}>
//           Upload
//         </button>
//       </form>
//       {message && (
//         <pre style={{ marginTop: "1rem", color: "green" }}>{message}</pre>
//       )}
//       <p>{fileResp?.downloadUrl}</p>
//     </div>
//   );
// };

// export default FileUpload;
