"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addImageToCanvas } from "@/fabric/fabric-utils";
// import { fetchWithAuth } from "@/services/base-service";
import { uploadFileWithAuth } from "@/services/upload-service";
import { useTshirtStore } from "@/app/store";
import { Loader2, Upload } from "lucide-react";
// import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

function UploadPanel() {
  const { canvas } = useTshirtStore();

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userUploads, setUserUploads] = useState([]);

//   const { data: session, status } = useSession();

  const fetchUserUploads = useCallback(async () => {
    // if (status !== "authenticated" || !session?.idToken) return;

    try {
      setIsLoading(true);
      const data = await axios.get('/api/media');
      setUserUploads(data?.data?.images || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

//   useEffect(() => {
    // if (status === "authenticated") 
        // fetchUserUploads();
//   }, [status, fetchUserUploads]);

    useEffect(()=>{
        fetchUserUploads();
    },[]);

  const handleFileUpload = async (e) => {
    console.log(e.target.files);
    const file = e.target.files[0];

    setIsUploading(true);
 
    try {
      const result = await uploadFileWithAuth(file);

      setUserUploads(result.image);

      console.log(result);
    } catch (e) {
      console.error("Error while uploading the file",e);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddImage = (imageUrl) => {
    if (!canvas) return;
    addImageToCanvas(canvas, imageUrl);
  };

  console.log(userUploads.url, "userUploads");

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Label
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white
          rounded-md cursor-pointer h-12 font-medium transition-colors ${
            isUploading ? "opacity-70 cursor-not-allowed" : ""
          }
          `}
          >
            <Upload className="w-5 h-5" />
            <span>{isUploading ? "Uploading..." : "Upload Files"}</span>
            <Input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </Label>
        </div>
        <div className="mt-5">
          <h4 className="text-sm text-gray-500 mb-5">Your Uploads</h4>
          {isLoading ? (
            <div className="border p-6 flex rounded-md items-center justify-center">
              <Loader2 className="w-4 h-4" />
              <p className="font-bold text-sm">Loading your uploads...</p>
            </div>
          ) : 
            userUploads.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {userUploads.map((imageData) => (
                <div
                  className="aspect-auto bg-gray-50 rounded-md overflow-hidden hover:opacity-85 transition-opacity relative group"
                  key={imageData._id}
                  onClick={() => handleAddImage(imageData.url)}
                >
                  <img
                    src={imageData.url}
                    alt={imageData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>No Uploads yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPanel;
