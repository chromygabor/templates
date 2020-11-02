import { Box, Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import * as React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { mapErrors } from "../utils/mapErrors";
import { useRouter } from "next/router";

interface LoginProps {}

const Login: React.FC<LoginProps> = (params) => {
  const [, login] = useLoginMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const result = await login(values);
          if (result.data?.login?.failures) {
            setErrors(mapErrors(result.data.login.failures));
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="E-mail"
              placeholder="email"
              type="email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              variantColor="teal"
              mt={4}
              isLoading={isSubmitting}
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default Login;
