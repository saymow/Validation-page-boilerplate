import Api from "./api";

export async function SingInCon(data) {
  const response = await Api.post("/login", data);

  return response.data;
}

export async function SignUpCon(data) {
  const response = await Api.post("/register", data);

  return response.data;
}

export async function VerifyToken(authorization) {
  const response = await Api.post(
    "check_token",
    {},
    { headers: { authorization: authorization } }
  ).catch((err) => {
    return err;
  });

  return response.data;
}

export async function ReSendConfirmationEmail(email) {
  const response = await Api.post("/re-send-email", { email });

  return response.data;
}
