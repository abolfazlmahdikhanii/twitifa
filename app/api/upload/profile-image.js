import connectToDB from "@/configs/db";
import { verifyToken } from "@/lib/utils";
import usersModel from "@/models/users";
import { deleteFile, uploadFile } from "@/service/fileService";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser to allow formidable to handle form data
  },
};

const handler = async (req, res) => {
  const { token } = req.cookies;
  await connectToDB();
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

      const uploadResult = await uploadFile(file, `profile/${user.username}`);

      if (uploadResult) {
        return res.status(200).json({
          success: true,
          url: uploadResult.url,
          fid: uploadResult.fileId,
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
      const { fid } = req.query;

      if (!fid) {
        return res.status(404).json({
          message: "No id exist!",
          success: false,
        });
      }

      const uploadResult = await deleteFile(fid);

      if (uploadResult) {
        const user = await usersModel.findOneAndUpdate(
          { imgId: fid },
          { profileImage: "", imgId: "" }
        );
        if (!user) {
          return res.status(400).json({
            success: false,
            message: "User Profile Update failed",
          });
        }
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
