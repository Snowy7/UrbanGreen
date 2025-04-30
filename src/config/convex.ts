import { ConvexProvider, ConvexReactClient } from "convex/react";

// Create a Convex client
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL);

export { convex, ConvexProvider }; 