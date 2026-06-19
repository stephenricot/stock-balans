import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-B5icM9w3.mjs";
import { r as requireSuperAdmin } from "./admin.middleware-DpA4M0PG.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getAdminUsers = createServerFn({
  method: "POST"
}).middleware([requireSuperAdmin]).handler(createSsrRpc("5193d73f59a2a05e5253bea70853a304faf46eefbb46b3be819d254debf01c9b"));
export {
  getAdminUsers as g
};
