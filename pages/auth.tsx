import { useState } from "react";
import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Box,
  Heading,
  Text,
  useToast,
  useColorMode,
  Tooltip,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import Router from "next/router";
import { Default } from "components/templates/Default";
import { InfoIcon } from "@chakra-ui/icons";

interface IDivicerProps {
  word?: string;
}

const Divider = ({ word }: IDivicerProps) => {
  return (
    <>
      {word ? (
        <Flex
          w="100%"
          alignItems="center"
          justifyContent="center"
          gap={2}
          mb={4}
        >
          <Box w="100%" border="solid" borderBottom={2} rounded="full"></Box>
          <Text>Or</Text>
          <Box w="100%" border="solid" borderBottom={2} rounded="full"></Box>
        </Flex>
      ) : (
        <Box
          w="100%"
          border="solid"
          borderBottom={2}
          rounded="full"
          mb={6}
        ></Box>
      )}
    </>
  );
};

const Auth: NextPage = () => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [authType, setAuthType] = useState("Login");
  const oppAuthType: { [key: string]: string } = {
    Login: "Register",
    Register: "Login",
  };
  const [name, setName] = useState("");
  const [isLabelOpen, setIsLabelOpen] = useState(false)
  const [telegramId, setTelegramId] = useState("");
  const [password, setPassword] = useState("");

  const redirectToHome = () => {
    const { pathname } = Router;
    if (pathname === "/auth") {
      Router.push("/");
    }
  };

  const tooltip = "Try the NEW anonymous Sign In feature! You can now login completely anonymously by using your Telegram ID!"

  const registerUser = async () => {
    const res = await axios.post("/api/register", { name, telegramId, password })
      .then(async () => {
        await loginUser();
        redirectToHome();
      })
      .catch((error) => {
        toast({description: error.response.data.error, status: 'error', position: 'bottom-right', isClosable: true, duration: 3000})
      });
  };

  const loginUser = async () => {
    const res: any = await signIn("credentials", {
      redirect: false,
      telegramId: telegramId,
      password: password,
      callbackUrl: `${window.location.origin}`
    });

    res.error ? toast({description: res.error, status: 'error', position: 'bottom-right', isClosable: true, duration: 3000}) : redirectToHome();
  };

  const formSubmit = (actions: any) => {
    actions.setSubmitting(false);

    authType === "Login" ? loginUser() : registerUser();
  };

  return (
    <Default pageName="Home">
      <Box w={["100%", "100%", "75%", "50%"]} rounded="md" bgGradient="linear(to-r, #ffffff80, #ffffff20)" p={12} m="auto">
        <Flex direction="column" justifyContent="center" alignItems="center">
          <Heading size="xl">{authType}</Heading>
          <Text fontSize="sm" mb={6}>
            {authType === "Login"
              ? "Not registered yet? "
              : "Already have an account? "}
            <button onClick={() => setAuthType(oppAuthType[authType])}>
              <Text as="u">{oppAuthType[authType]}</Text>
            </button>
          </Text>

          <Divider />

          <Divider word="Or" />

          <Formik initialValues={{}} validateOnChange={false} validateOnBlur={false} onSubmit={(_, actions) => {formSubmit(actions);}}>
            {(props) => (
              <Form style={{ width: "100%" }}>
                <Box display="flex" flexDirection="column" w="100%" mb={4}>
                  {authType === "Register" && (
                    <Field name="name">
                      {() => (
                        <FormControl isRequired mb={6}>
                          <FormLabel htmlFor="name">Name:</FormLabel>
                          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your displayed Name" background={colorMode === "dark" ? "rgba(49, 130, 206, 0.4)" : "#90cdf4"}/>
                        </FormControl>
                      )}
                    </Field>
                  )}
                  <Field name="id">
                    {() => (
                      <>
                        <FormControl isRequired mb={6} mt={2}>
                          <FormLabel htmlFor="telegramId">
                            Telegram ID:
                          </FormLabel>
                          <Flex>
                            <Input flex="84" value={telegramId} onChange={(e) => setTelegramId(e.target.value)} placeholder="Telegram ID" background={colorMode === "dark" ? "rgba(49, 130, 206, 0.4)" : "#90cdf4"}/>
                            <Box flex="2"></Box>
                            <Tooltip alignSelf="end" hasArrow label={tooltip} fontSize='sm' isOpen={isLabelOpen}>
                              <Flex flex="14" align="center" p="2" bg={colorMode === "dark" ? "#90cdf4" : "#3182ce"} borderRadius="full" fontSize={["3xs", "2xs", "xs", "xs"]} onMouseEnter={() => setIsLabelOpen(true)} onMouseLeave={() => setIsLabelOpen(false)}>
                                New
                                <InfoIcon ml="2"/>
                              </Flex>
                            </Tooltip>
                          </Flex>
                        </FormControl>
                      </>
                    )}
                  </Field>
                  <Field name="password">
                    {() => (
                      <FormControl isRequired mb={3}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" background={colorMode === "dark" ? "rgba(49, 130, 206, 0.4)" : "#90cdf4"}/>
                      </FormControl>
                    )}
                  </Field>
                  <Button mt={6} bg={colorMode === "dark" ? "#90cdf4" : "#3182ce"} isLoading={props.isSubmitting} type="submit">
                    {authType}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Flex>
      </Box>
    </Default>
  );
};

export default Auth;
