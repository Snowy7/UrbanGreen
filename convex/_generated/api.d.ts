/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as contentRequests from "../contentRequests.js";
import type * as events from "../events.js";
import type * as favorites from "../favorites.js";
import type * as greenspaces from "../greenspaces.js";
import type * as http from "../http.js";
import type * as joinedEvents from "../joinedEvents.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  contentRequests: typeof contentRequests;
  events: typeof events;
  favorites: typeof favorites;
  greenspaces: typeof greenspaces;
  http: typeof http;
  joinedEvents: typeof joinedEvents;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
