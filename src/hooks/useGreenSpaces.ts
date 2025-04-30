import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

export const useGreenSpaces = () => {
  const greenSpaces = useQuery(api.greenspaces.getAll);
  const createGreenSpace = useMutation(api.greenspaces.create);
  const updateGreenSpace = useMutation(api.greenspaces.update);
  const deleteGreenSpace = useMutation(api.greenspaces.remove);

  const getGreenSpaceById = (id: Id<"greenSpaces">) => {
    return useQuery(api.greenspaces.getById, { id });
  };

  return {
    greenSpaces,
    createGreenSpace,
    updateGreenSpace,
    deleteGreenSpace,
    getGreenSpaceById,
  };
}; 