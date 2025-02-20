"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, FileIcon, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FileWithPreview extends File {
  preview: string
}

interface MultipleFileUploadProps {
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>; // Permite funções e arrays
  files: FileWithPreview[];
  setUploadStatus: React.Dispatch<React.SetStateAction<{ [key: string]: "success" | "error" | null }>>;
  uploadStatus: { [key: string]: "success" | "error" | null };
}

export function MultipleFileUpload({ setFiles, files, setUploadStatus, uploadStatus }: MultipleFileUploadProps) {
  // const [uploadStatus, setUploadStatus] = useState<{ [key: string]: "success" | "error" | null }>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles: FileWithPreview[]) => {
      const existingFileNames = new Set(prevFiles.map((file) => file.name));

      const newFiles: FileWithPreview[] = acceptedFiles
        .filter((file) => !existingFileNames.has(file.name))
        .map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

      return [...prevFiles, ...newFiles];
    });
  }, [setFiles]);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeFile = (file: FileWithPreview) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    URL.revokeObjectURL(file.preview);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Drag &amp; drop files here, or click to select files</p>
      </div>

      {files.length > 0 && (
        <ul className="mt-6 space-y-4">
          {files.map((file) => (
            <li key={file.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-3">
                <FileIcon className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">{file.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {uploadStatus[file.name] === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {uploadStatus[file.name] === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                <Button onClick={() => removeFile(file)} variant="outline" className="text-red-500 hover:text-red-700">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}