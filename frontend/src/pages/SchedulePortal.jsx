// src/pages/SchedulePortal.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Read studentId from logged-in user (stored in localStorage by auth flow)
const getLoggedInUserId = () => {
  try {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return null;
    const user = JSON.parse(userRaw);
    return user?._id || user?.id || null;
  } catch (e) {
    return null;
  }
};

function SchedulePortal() {
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadDocument, setShowUploadDocument] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch folders and documents
  useEffect(() => {
    const userId = getLoggedInUserId();
    if (!userId || !localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchFolders();
  }, [navigate]);

  useEffect(() => {
    if (selectedFolder) {
      fetchDocuments(selectedFolder);
    }
  }, [selectedFolder]);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schedule/folders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch schedule folders: ${res.statusText}`);
      }
      const data = await res.json();
      setFolders(data);
    } catch (err) {
      setError("Failed to fetch schedule folders");
    }
  };

  const fetchDocuments = async (folderId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schedule/documents/${folderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch schedule documents: ${res.statusText}`);
      }
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      setError("Failed to fetch schedule documents");
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      setError("Folder name is required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schedule/folders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newFolderName.trim(),
          description: newFolderDescription.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("✅ Schedule folder created successfully");
        setNewFolderName("");
        setNewFolderDescription("");
        setShowCreateFolder(false);
        fetchFolders();
      } else {
        setError(data.message || "Failed to create folder");
      }
    } catch (err) {
      setError("Server error while creating folder");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle.trim() || !selectedFolder) {
      setError("Please fill all fields and select a folder");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("document", uploadFile);
    formData.append("title", uploadTitle.trim());
    formData.append("description", uploadDescription.trim());
    formData.append("folderId", selectedFolder);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schedule/documents/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("✅ Schedule document uploaded successfully");
        setUploadFile(null);
        setUploadTitle("");
        setUploadDescription("");
        setShowUploadDocument(false);
        fetchDocuments(selectedFolder);
      } else {
        setError(data.message || "Failed to upload document");
      }
    } catch (err) {
      setError("Server error while uploading document");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm("Are you sure you want to delete this folder and all its documents? This action cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schedule/folders/${folderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("✅ Schedule folder deleted successfully");
        if (selectedFolder === folderId) {
          setSelectedFolder(null);
          setDocuments([]);
        }
        fetchFolders();
      } else {
        setError(data.message || "Failed to delete folder");
      }
    } catch (err) {
      setError("Server error while deleting folder");
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schedule/documents/${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("✅ Schedule document deleted successfully");
        fetchDocuments(selectedFolder);
      } else {
        setError(data.message || "Failed to delete document");
      }
    } catch (err) {
      setError("Server error while deleting document");
    }
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/schedule/documents/download/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Failed to download document");
      }
    } catch (err) {
      setError("Server error while downloading document");
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "excel":
      case "xlsx":
      case "xls":
        return "📊";
      case "word":
      case "docx":
      case "doc":
        return "📝";
      case "powerpoint":
      case "pptx":
      case "ppt":
        return "📋";
      case "pdf":
        return "📄";
      default:
        return "📄";
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">📅 Schedule Portal</h1>
            <p className="text-zinc-600 mt-2">Manage training schedules and documents for interns</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateFolder(true)}
              className="px-4 py-2 bg-black text-white font-medium rounded hover:bg-zinc-800 transition"
            >
              📁 Create Folder
            </button>
            <button
              onClick={() => setShowUploadDocument(true)}
              disabled={!selectedFolder}
              className={`px-4 py-2 font-medium rounded transition ${
                selectedFolder
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-zinc-300 text-zinc-500 cursor-not-allowed"
              }`}
            >
              📄 Upload Document
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-2 text-red-600 hover:underline text-sm"
            >
              Dismiss
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
            <button
              onClick={() => setSuccess("")}
              className="mt-2 text-green-600 hover:underline text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Folders Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-zinc-300 rounded-lg shadow-sm">
              <div className="p-4 border-b border-zinc-300">
                <h3 className="text-lg font-semibold text-zinc-900">Schedule Folders</h3>
              </div>
              <div className="p-4">
                {folders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📁</div>
                    <p className="text-zinc-600">No schedule folders yet</p>
                    <p className="text-sm text-zinc-500 mt-1">Create your first folder to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {folders.map((folder) => (
                      <div
                        key={folder._id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedFolder === folder._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                        }`}
                        onClick={() => setSelectedFolder(folder._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">📁</span>
                            <div>
                              <p className="font-medium text-zinc-900">{folder.name}</p>
                              <p className="text-sm text-zinc-500">
                                {folder.documentCount || 0} document(s)
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFolder(folder._id);
                            }}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete folder"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-300 rounded-lg shadow-sm">
              <div className="p-4 border-b border-zinc-300">
                <h3 className="text-lg font-semibold text-zinc-900">
                  {selectedFolder
                    ? `Documents in "${folders.find((f) => f._id === selectedFolder)?.name}"`
                    : "Select a folder to view documents"}
                </h3>
              </div>
              <div className="p-4">
                {!selectedFolder ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-zinc-600 text-lg">Select a folder to view schedule documents</p>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-zinc-600 text-lg">No documents in this folder yet</p>
                    <p className="text-sm text-zinc-500 mt-2">Upload your first schedule document</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((document) => (
                      <div
                        key={document._id}
                        className="border border-zinc-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{getFileIcon(document.fileType)}</span>
                            <div>
                              <h4 className="font-semibold text-zinc-900">{document.title}</h4>
                              <p className="text-sm text-zinc-500">{document.fileName}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteDocument(document._id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete document"
                          >
                            🗑️
                          </button>
                        </div>
                        {document.description && (
                          <p className="text-sm text-zinc-600 mb-3 line-clamp-2">{document.description}</p>
                        )}
                        <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                          <span>Downloads: {document.downloads || 0}</span>
                          <span>Uploaded: {new Date(document.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={() => handleDownloadDocument(document._id, document.fileName)}
                          className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
                        >
                          📥 Download
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Schedule Folder</h3>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Folder Name</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g., Q1 2024 Training Schedule"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Description (Optional)</label>
                <textarea
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  placeholder="Brief description of the schedule folder..."
                  rows={3}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-black text-white font-medium rounded hover:bg-zinc-800 transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Folder"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName("");
                    setNewFolderDescription("");
                  }}
                  className="flex-1 px-4 py-2 border border-zinc-300 rounded hover:bg-zinc-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Schedule Document</h3>
            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Document Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., January 2024 Training Schedule"
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Description (Optional)</label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Brief description of the document..."
                  rows={3}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Document File</label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.docx,.doc,.pptx,.ppt,.pdf"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-zinc-500 mt-1">Supported formats: Excel, Word, PowerPoint, PDF (Max 50MB)</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || !uploadFile || !uploadTitle.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Upload Document"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadDocument(false);
                    setUploadFile(null);
                    setUploadTitle("");
                    setUploadDescription("");
                  }}
                  className="flex-1 px-4 py-2 border border-zinc-300 rounded hover:bg-zinc-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchedulePortal;