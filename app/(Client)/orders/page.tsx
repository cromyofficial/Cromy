import RequiredUser from "@/hooks/RequiredUser";
import React from "react";

const OrderPage = async () => {
  await RequiredUser();

  return <div>page</div>;
};

export default OrderPage;
