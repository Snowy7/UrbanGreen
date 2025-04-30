import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

export const handleClerkWebhook = httpAction(async (ctx, request) => {
    const { data, type } = await request.json();

    console.log("~ do something ~ data:", data);

    switch (type) {
        case "user.created":
            await ctx.runMutation(internal.users.createUser, {
                clerkId: data.id,
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email_addresses[0].email_address,
                phone: data.phone_numbers[0].phone_number,
                imageUrl: data.image_url,
                isAdmin: false,
                isActive: true,
            })
            break;
        case "user.updated":
            console.log("~ user updated ~");
            break;
    }

    return new Response(null, { status: 200 });
});

// https://hip-lapwing-157.convex.site/clerk-users-webhook

http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: handleClerkWebhook,
});

export default http;
