import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const RequiredUser = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }
};

export default RequiredUser;
