import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  FileText,
  Image,
  FileIcon,
  Edit,
  Trash2,
  Upload,
  Eye,
  Download,
} from "lucide-react";

const MaterialManagement = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    type: "pdf",
    file: null,
    status: "Active",
  });
  const [editMaterial, setEditMaterial] = useState({
    title: "",
    description: "",
    status: "Active",
    file: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/all_metarial_data`
        );
        const fetchedMaterials = Array.isArray(response.data)
          ? response.data
          : [];
        setMaterials(fetchedMaterials);
      } catch (err) {
        console.error("Error fetching materials:", err.response || err.message);
        setError("Failed to fetch materials");
        setMaterials([]);
      }
    };
    fetchMaterials();
  }, []);

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "image":
        return <Image className="w-5 h-5 text-blue-500" />;
      default:
        return <FileIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const uploadFile = async (file, type) => {
    if (!file) {
      throw new Error("No file selected");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size exceeds 10MB limit");
    }

    const formData = new FormData();
    if (type === "image") {
      formData.append("image", file);
      try {
        const imgbbResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=a710bf9dd69fd9fc2860512c2c901c31`,
          formData
        );
        return imgbbResponse.data.data.url;
      } catch (err) {
        throw new Error(
          err.response?.data?.error?.message ||
            "Failed to upload image to ImgBB"
        );
      }
    } else if (type === "pdf") {
      formData.append("file", file);
      try {
        const pdfcoResponse = await axios.post(
          "https://api.pdf.co/v1/file/upload",
          formData,
          {
            headers: {
              "x-api-key":
                "akwebdev69@gmail.com_t9X8MSFZRD73MGhARssr0t2SijHRymWfUcIZbP5E2xPw9gh9ChiUTZkq2BggcIau",
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return pdfcoResponse.data.url;
      } catch (err) {
        throw new Error(
          err.response?.data?.error || "Failed to upload PDF to PDF.co"
        );
      }
    } else {
      throw new Error("Unsupported file type");
    }
  };

  const handleUpload = async () => {
    setLoadingUpload(true);
    setError("");
    try {
      if (!newMaterial.title || !newMaterial.description) {
        setError("Title and description are required");
        return;
      }
      if (!newMaterial.file) {
        setError("Please select a file to upload");
        return;
      }

      const fileUrl = await uploadFile(newMaterial.file, newMaterial.type);

      const materialData = {
        title: newMaterial.title,
        description: newMaterial.description,
        type: newMaterial.type,
        fileSize: newMaterial.file
          ? `${(newMaterial.file.size / 1024 / 1024).toFixed(1)} MB`
          : "",
        uploadDate: new Date().toISOString().split("T")[0],
        status: newMaterial.status,
        downloads: 0,
        thumbnail: fileUrl,
        fileUrl: fileUrl,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post_a_new_metarila`,
        materialData
      );
      setMaterials([response.data, ...materials]);
      setIsUploadModalOpen(false);
      setNewMaterial({
        title: "",
        description: "",
        type: "pdf",
        file: null,
        status: "Active",
      });
      setError("");
    } catch (err) {
      console.error("Error uploading material:", err.response || err.message);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload material"
      );
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleView = (material) => {
    setSelectedMaterial(material);
    setIsViewModalOpen(true);
  };

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setEditMaterial({
      title: material.title,
      description: material.description,
      status: material.status,
      file: null,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (material) => {
    setSelectedMaterial(material);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!selectedMaterial?._id) {
        setError("No material selected for deletion");
        return;
      }

      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/delete_metarila_data/${
          selectedMaterial._id
        }`
      );
      setMaterials(materials.filter((m) => m._id !== selectedMaterial._id));
      setIsDeleteDialogOpen(false);
      setSelectedMaterial(null);
      setError("");
    } catch (err) {
      console.error("Error deleting material:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to delete material");
    }
  };

  const saveEdit = async () => {
    setError("");
    try {
      if (!editMaterial.title || !editMaterial.description) {
        setError("Title and description are required");
        return;
      }

      let fileUrl = selectedMaterial.fileUrl;
      let thumbnail = selectedMaterial.thumbnail;

      if (editMaterial.file) {
        fileUrl = await uploadFile(editMaterial.file, selectedMaterial.type);
        thumbnail = fileUrl;
      }

      const updatedData = {
        title: editMaterial.title,
        description: editMaterial.description,
        status: editMaterial.status,
        thumbnail: thumbnail,
        fileUrl: fileUrl,
        fileSize: editMaterial.file
          ? `${(editMaterial.file.size / 1024 / 1024).toFixed(1)} MB`
          : selectedMaterial.fileSize,
      };

      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/update_metarila_data/${
          selectedMaterial._id
        }`,
        updatedData
      );
      setMaterials(
        materials.map((m) =>
          m._id === selectedMaterial._id ? { ...m, ...updatedData } : m
        )
      );
      setIsEditModalOpen(false);
      setSelectedMaterial(null);
      setEditMaterial({
        title: "",
        description: "",
        status: "Active",
        file: null,
      });
      setError("");
    } catch (err) {
      console.error("Error updating material:", err.response || err.message);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update material"
      );
    }
  };

  const totalDownloads = Array.isArray(materials)
    ? materials.reduce((sum, m) => sum + (m.downloads || 0), 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Material Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage study materials for the public website
          </p>
        </div>

        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Upload New Material
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter material title"
                  value={newMaterial.title}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter material description"
                  rows={3}
                  value={newMaterial.description}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={newMaterial.type}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      type: e.target.value,
                      file: null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pdf">PDF</option>
                  <option value="image">Image</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    {newMaterial.type === "pdf"
                      ? "PDF up to 10MB"
                      : "PNG, JPG, JPEG up to 10MB"}
                  </p>
                  <Input
                    id="file"
                    type="file"
                    className=""
                    accept={
                      newMaterial.type === "pdf" ? ".pdf" : ".png,.jpg,.jpeg"
                    }
                    onChange={(e) =>
                      setNewMaterial({
                        ...newMaterial,
                        file: e.target.files[0],
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={newMaterial.status}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={loadingUpload}>
                  {loadingUpload ? "Uploading..." : "Upload Material"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Materials
            </CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">
              Updated in real-time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Downloads
            </CardTitle>
            <Download className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">
              Across all materials
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Materials List */}
      <Card>
        <CardHeader>
          <CardTitle>All Materials</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {getFileIcon(material.type)}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">
                            {material.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {material.description.slice(0, 40) + "..."}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-sm bg-gray-100 px-2 py-1 rounded">
                        {material.type}
                      </span>
                    </TableCell>
                    <TableCell>{material.fileSize}</TableCell>
                    <TableCell>{material.uploadDate}</TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-blue-600">
                        {material.downloads || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          material.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {material.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(material)}
                          className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          title="View material"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(material)}
                          className="hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                          title="Edit material"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(material)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200"
                          title="Delete material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {materials.map((material) => (
              <div
                key={material._id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getFileIcon(material.type)}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {material.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {material.description.slice(0, 50) + "..."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs">Type</span>
                    <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs inline-block w-fit">
                      {material.type}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs">Size</span>
                    <span className="text-gray-900 text-sm">
                      {material.fileSize}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs">Uploaded</span>
                    <span className="text-gray-900 text-sm">
                      {material.uploadDate}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs">Downloads</span>
                    <span className="font-medium text-blue-600 text-sm">
                      {material.downloads || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-gray-500 text-xs">Status: </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        material.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {material.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(material)}
                      className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 p-2"
                      title="View material"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(material)}
                      className="hover:bg-green-50 hover:text-green-600 transition-colors duration-200 p-2"
                      title="Edit material"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(material)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200 p-2"
                      title="Delete material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Material Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>View Material</DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {getFileIcon(selectedMaterial.type)}
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedMaterial.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedMaterial.type.toUpperCase()} •{" "}
                    {selectedMaterial.fileSize}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-700 mt-1">
                  {selectedMaterial.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Upload Date</Label>
                  <p className="text-sm text-gray-700">
                    {selectedMaterial.uploadDate}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Downloads</Label>
                  <p className="text-sm font-medium text-blue-600">
                    {selectedMaterial.downloads || 0}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p
                    className={`text-sm font-medium ${
                      selectedMaterial.status === "Active"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {selectedMaterial.status}
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Material Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  defaultValue={selectedMaterial.title}
                  placeholder="Enter material title"
                  onChange={(e) =>
                    setEditMaterial({ ...editMaterial, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  defaultValue={selectedMaterial.description}
                  placeholder="Enter material description"
                  rows={3}
                  onChange={(e) =>
                    setEditMaterial({
                      ...editMaterial,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Current File</Label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getFileIcon(selectedMaterial.type)}
                  <div className="flex-1">
                    <div className="font-medium">{selectedMaterial.title}</div>
                    <div className="text-sm text-gray-500">
                      {selectedMaterial.type.toUpperCase()} •{" "}
                      {selectedMaterial.fileSize}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="replace-file">Replace File (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedMaterial.type === "pdf"
                      ? "PDF up to 10MB"
                      : "PNG, JPG, JPEG up to 10MB"}
                  </p>
                  <Input
                    id="replace-file"
                    type="file"
                    className=""
                    accept={
                      selectedMaterial.type === "pdf"
                        ? ".pdf"
                        : ".png,.jpg,.jpeg"
                    }
                    onChange={(e) =>
                      setEditMaterial({
                        ...editMaterial,
                        file: e.target.files[0],
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  defaultValue={selectedMaterial.status}
                  onChange={(e) =>
                    setEditMaterial({ ...editMaterial, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={saveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              material "{selectedMaterial?.title}" from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MaterialManagement;
