import connectDB from "@/config/database";
import Property from "@/models/Property";
import cloudinary from "@/config/cloudinary";
import { getSessionUser } from "@/utils/getSessionUser";

//GET /api/properties
export const GET = async (request: any) => {
  try {
    await connectDB();

    const properties = await Property.find({});
    return new Response(JSON.stringify(properties), { status: 200 });
  } catch (error) {
    return new Response("Something Went Wrong", { status: 500 });
  }
};

//POST /api/properties
export const POST = async (request: any) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { userId } = sessionUser;

    const formData = await request.formData();

    const amenities = formData.getAll("amenities");
    const images = formData
      .getAll("images")
      .filter((image: any) => image.name !== "");

    //create propertyData object for database
    const propertyData = {
      type: formData.get("property_type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      rates: {
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
        nightly: formData.get("rates.nightly."),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
      images: [] as any[],
    };

    const imageUploadPromises = [];
    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      //convert the image data to base64
      const imageBase64 = imageData.toString("base64");

      //make request to upload to cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: "propertypulse",
        }
      );

      imageUploadPromises.push(result.secure_url);

      //wait for all images to upload
      const uploadedImages = await Promise.all(imageUploadPromises);
      //add uploaded images to the propertyData object
      propertyData.images = uploadedImages;
    }

    const newProperty = new Property(propertyData);
    await newProperty.save();

    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );
    // console.log(propertyData);
    // return new Response(JSON.stringify({ message: "Sucess" }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error || "Failed to save property" }),
      {
        status: 500,
      }
    );
  }
};
