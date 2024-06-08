import connectDB from "@/config/database";
import Property from "@/models/Property";

//GET /api/properties/user/:userId
export const GET = async (request: any, { params }: any) => {
  try {
    await connectDB();
    const userId = params.userId;
    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }
    const property = await Property.find({ owner: userId });

    if (!property)
      return new Response("Not listing has been found", { status: 404 });

    return new Response(JSON.stringify(property), { status: 200 });
  } catch (error) {
    return new Response("Something Went Wrong", { status: 500 });
  }
};
