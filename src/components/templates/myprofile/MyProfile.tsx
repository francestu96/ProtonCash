import {
  Heading,
  Box,
  Button,
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  FormControl,
  Input,
  useToast,
  Link,
  useColorMode,
  FormLabel,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure
} from '@chakra-ui/react';
import axios from 'axios';
import { Error } from 'components/elements/Error';
import { Formik, Form, Field } from 'formik';
import { signOut, useSession } from 'next-auth/react';
import { useRef } from 'react';
import { useState } from 'react';

const MyProfile = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [name, setName] = useState(session?.user.name);
  const [email, setEmail] = useState(session?.user.email);
  const [phone, setPhone] = useState(session?.user.phone);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null);

  const checkAlert = (actions: any) => {
    actions.setSubmitting(false);
    onOpen();
  };

  const formSubmit: any = async () => {
    onClose();
    let telegramId = session?.user?.telegramId || "";

    const res = await axios.post("/api/update", { telegramId, name, email, phone })
      .then(() => {
        signOut();
      })
      .catch((error) => {
        toast({description: error.response.data.error, status: 'error', position: 'bottom-right', isClosable: true, duration: 3000})
      });
  };

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        Your Information
      </Heading>
      { !session ? <Error msg={"<b>Sign In</b> to your account first"}/> :
        <Box>
          <Box borderWidth='2px' borderRadius='lg' p="1em" w={["100%", "75%", "50%"]}>
            <Formik initialValues={{}} validateOnChange={false} validateOnBlur={false} onSubmit={(_, actions) => {checkAlert(actions);}}>
              {(props) => (
                <Form style={{ width: "100%" }}>
                  <Box display="flex" flexDirection="column" w="100%" mb={4}>
                    <Field name="telegramId">
                      {() => (
                        <FormControl isRequired mb={6}>
                          <FormLabel htmlFor="telegramId">Telegram ID:</FormLabel>
                          <Tooltip label="Telegram ID cannot be changed" fontSize='sm' placement='top' hasArrow>
                            <Input value={session.user?.telegramId || ""} readOnly placeholder="Telegram ID" background={colorMode === "dark" ? "rgba(49, 130, 206, 0.4)" : "#90cdf4"}/>
                          </Tooltip>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="username">
                      {() => (
                        <FormControl isRequired mb={6}>
                          <FormLabel htmlFor="username">Name:</FormLabel>
                          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your displayed Name" background={colorMode === "dark" ? "rgba(49, 130, 206, 0.4)" : "#90cdf4"}/>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="email">
                      {() => (
                        <FormControl mb={6}>
                          <FormLabel htmlFor="email">Email:</FormLabel>
                          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="No email set" background={colorMode === "dark" ? "rgba(49, 130, 206, 0.4)" : "#90cdf4"}/>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="phone">
                      {() => (
                        <FormControl mb={6}>
                          <FormLabel htmlFor="phone">Phone number:</FormLabel>
                          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="No phone number set" background={colorMode === "dark" ? "rgba(49, 130, 206, 0.4)" : "#90cdf4"}/>
                        </FormControl>
                      )}
                    </Field>
                    <Button mt={6} bg={colorMode === "dark" ? "#90cdf4" : "#3182ce"} isLoading={props.isSubmitting} type="submit">
                      Update Information
                    </Button>
                    <AlertDialog motionPreset='slideInBottom' leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen} isCentered>
                      <AlertDialogOverlay/>
                      <AlertDialogContent>
                        <AlertDialogHeader>Update Information?</AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>For updating your information you need to Sign Out.<br></br>Do you want to continue?</AlertDialogBody>
                        <AlertDialogFooter>
                          <Button ref={cancelRef} onClick={onClose}>
                            No
                          </Button>
                          <Button colorScheme='red' ml={3} onClick={formSubmit}>
                            Yes
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>

          <Heading size="mg" mt={6} mb={4}>
            Deposit History
          </Heading>
          <TableContainer borderWidth='2px' borderRadius='lg' pl={4} pr={4}>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Tx Hash</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Yesterday at 16:46:12 UTC</Td>
                  <Td>
                    <Link href={"https://bscscan.com/tx/0x2e25cdac741a092f1fab3304d2dbdcf3d6d30e0406cd4b10dafe261c225d3be2"} color={colorMode === "dark" ? "#90cdf4" : "#3182ce"} isExternal>
                      0x2e25cdac741a092f1fab3304d2dbdcf3d6d30e0406cd4b10dafe261c225d3be2
                    </Link>
                  </Td>
                  <Td>2.12 BTCB</Td>
                </Tr>
                <Tr>
                  <Td>2022/09/28 09:23:17 UTC</Td>
                  <Td>
                    <Link href={"https://bscscan.com/tx/0x355de1bff433fb4f43a389dec80ef0ee80b53ce9a233f98754627a63fee4d402"} color={colorMode === "dark" ? "#90cdf4" : "#3182ce"} isExternal>
                      0x355de1bff433fb4f43a389dec80ef0ee80b53ce9a233f98754627a63fee4d402
                    </Link>
                  </Td>
                  <Td>0.05 BTCB</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      }
    </>
  );
};

export default MyProfile;
