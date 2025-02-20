// "use client";

// import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
// import React, { useCallback, useEffect, useRef, useState } from "react";

// interface FileInputProps {
//   onChange: (files: File[]) => void;
//   value?: File[];
//   maxFiles?: number;
//   acceptedFormats?: string[];
// }

// const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
//   ({ onChange, value = [], maxFiles = 1, acceptedFormats = ["image/*"], ...props }, ref) => {
//     const [previews, setPreviews] = useState<File[]>(value);
//     const [error, setError] = useState<string | null>(null);
//     const fileInputRef = useRef<HTMLInputElement>();
//     const { toast } = useToast();

//     useEffect(() => {
//       if (value && JSON.stringify(previews) !== JSON.stringify(value)) {
//         setPreviews(value);
//       }
//     }, [value]);

//     const validateFiles = (files: File[]): boolean => {
//       if (files.length + previews.length > maxFiles) {
//         setError(`Você pode fazer upload de no máximo ${maxFiles} arquivo(s).`);
//         return false;
//       }

//       const invalidFiles = files.filter((file) => !acceptedFormats.some((format) => file.type.match(format)));
//       if (invalidFiles.length > 0) {
//         setError(`Formatos aceitos: ${acceptedFormats.join(", ")}`);
//         return false;
//       }

//       setError(null);
//       return true;
//     };

//     const handleFiles = useCallback(
//       async (files: FileList | null) => {
//         if (files) {
//           const fileArray = Array.from(files);
//           if (validateFiles(fileArray)) {
//             const newPreviews: File[] = [];
//             for (const file of fileArray) {
//               newPreviews.push(file);
//             }
//             setPreviews((prev) => [...prev, ...newPreviews]);
//             onChange([...value, ...newPreviews]);
//           }
//         }
//       },
//       [onChange, value, maxFiles, acceptedFormats, previews]
//     );

//     const handleDrop = useCallback(
//       (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         handleFiles(e.dataTransfer.files);
//       },
//       [handleFiles]
//     );

//     const handleFileChange = useCallback(
//       (event: React.ChangeEvent<HTMLInputElement>) => {
//         handleFiles(event.target.files);
//       },
//       [handleFiles]
//     );

//     const handleClick = () => {
//       fileInputRef.current?.click();
//     };

//     const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//     }, []);

//     return (
//       <>
//         <div
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           onClick={handleClick}
//           className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
//         >
//           <Input
//             id="file-upload"
//             type="file"
//             accept={acceptedFormats.join(",")}
//             onChange={handleFileChange}
//             ref={(e) => {
//               if (e) {
//                 fileInputRef.current = e;
//                 if (typeof ref === "function") ref(e);
//                 else if (ref) ref.current = e;
//               }
//             }}
//             multiple={maxFiles > 1}
//             className="hidden"
//             {...props}
//           />
//           <p>Clique ou arraste e solte</p>
//           <p className="text-sm text-gray-500">
//             Máximo de {maxFiles} {maxFiles > 1 ? "arquivos" : "arquivo"} ({acceptedFormats.join(", ")})
//           </p>
//         </div>
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
//           {previews.map((preview, index) => (
//             <p key={index} className="relative">
//               {preview.name.slice(0, 20)}
//             </p>
//           ))}
//         </div>
//       </>
//     );
//   }
// );

// FileInput.displayName = "FileInput";

// export default FileInput;
