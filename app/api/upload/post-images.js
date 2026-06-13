import { verifyToken } from "@/lib/utils";
import postImagesModel from "@/models/potsImages";
import usersModel from "@/models/users";
import { deleteFile, uploadFile } from "@/service/fileService";
import formidable from "formidable";
import { url } from "inspector";
import { isValidObjectId } from "mongoose";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser to allow formidable to handle form data
  },
};

const handler = async (req, res) => {
  const { token } = req.cookies;
  const { imgType, id } = req.query;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  const validToken = verifyToken(token);
  if (!validToken) {
    return res.status(401).json({ message: "Invalid Token", success: false });
  }
  if (req.method === "POST") {
    try {
      // Parse the form once
      const form = formidable({
        multiples: false,
        keepExtensions: true,
        maxFileSize: 2 * 1024 * 1024,
      });

      const [fields, files] = await form.parse(req);

      const file = files.image?.[0];

      if (!file) {
        return res.status(400).json({
          message: "No file uploaded!",
          success: false,
        });
      }

      const user = await usersModel.findOne({ email: validToken.email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      }

      const uploadResult = await uploadFile(file, `blogs/${user.username}`);

      if (uploadResult) {
        const newUpload = await postImagesModel.create({
          imageId: uploadResult.fileId,
          userId: user._id,
          imageUrl: uploadResult.url,
          postId: id  ? id : null,
          imageType: imgType ? "posts" : "cover",
        });
        if (!newUpload) {
          await deleteFile(uploadResult.fileId);
          return res.status(400).json({
            success: false,
            message: "File upload failed",
          });
        }
        
        return res.status(200).json({
          success: true,
          url: uploadResult.url,
          fid: uploadResult.fileId,
          imgId: newUpload._id
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "File upload failed",
        });
      }
    } catch (error) {
     
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
  if (req.method === "DELETE") {
    try {
      const { fid, url,type } = req.query;
      if (!fid && !url) {
        return res.status(400).json({
          message: "No identifier provided (fid, url, or docId required)",
          success: false,
        });
      }

      let imageToDelete = null;
      if (fid&&type) {
        const removeImg = await postImagesModel.findOneAndDelete({
          imageId: fid,
          imageType:"cover"
        });
        if (!removeImg) {
          return res.status(400).json({
            message: "remove failed!",
            success: false,
          });
        }
        imageToDelete = fid;
      } else if (url&&!type) {
        const postImg = await postImagesModel.findOne({ imageUrl: url });
        if (!postImg) {
          return res.status(404).json({
            message: "No image exist!",
            success: false,
          });
        }
        const removeImg = await postImagesModel.findOneAndDelete({
          imageId: postImg.imageId,
        });
        if (!removeImg) {
          return res.status(400).json({
            message: "remove failed!",
            success: false,
          });
        }
        imageToDelete = postImg.imageId;
      }
      if (!imageToDelete) {
        return res.status(404).json({
          message: "Image not found in database",
          success: false,
        });
      }

      const uploadResult = await deleteFile(imageToDelete);

      if (uploadResult) {
        return res.status(200).json({
          success: true,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "File Delete failed",
        });
      }
    } catch (error) {
   
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
};

export default handler;
