import { Box, Link, Spinner, Td, useColorMode } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, TableContainer, Heading } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react';
import { useSDK } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import BTCB_ABI from '../../../utils/BTCB_ABI.json'

const Home = () => {
  const sdk = useSDK();
  const [transactions, setTransactions] = useState<any>([]);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const init = async () => {
      let contract = await sdk?.getContractFromAbi(process.env.NEXT_PUBLIC_BTCB_ADDRESS || "", BTCB_ABI);
      const lastBlock = await sdk?.getProvider().getBlockNumber();
      const events = await contract?.events.getAllEvents({ fromBlock: (lastBlock || 10000) - 10000, toBlock: (lastBlock || 0) });
      
      const trxs = events?.filter(x => x.eventName == "Transfer")
      .filter(x => parseFloat(ethers.utils.formatEther(x.data.value)) > 1)
      .filter((value, index, self) =>
        index === self.findIndex(x => (x.transaction.transactionHash === value.transaction.transactionHash))
      )
      .slice(0, 25)
      .map(x => { 
        return {
          hash: x.transaction.transactionHash, 
          block: x.transaction.blockNumber,
          from: x.data.from,
          to: x.data.to,
          value: ethers.utils.formatEther(x.data.value)
        } 
      });
      
      setTransactions(trxs);
    }

    init();
  }, [sdk])

  return (
    <Box>
      <Heading size="md" textAlign="center" marginBottom={6}>
        Last Transactions
      </Heading>
      <TableContainer borderWidth='2px' borderRadius='lg' pl={4} pr={4}>
        {
          transactions && transactions.length > 0 
          ?
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Trx Hash</Th>
                <Th>Block</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {              
                transactions?.map((trx: any) => (
                  <Tr key={trx.hash}>
                    <Td>
                      <Link href={"https://bscscan.com/tx/" + trx.hash} color={colorMode === "dark" ? "#90cdf4" : "#3182ce"} isExternal>
                        {trx.hash.slice(0, 20) + "..."}
                      </Link>
                    </Td>
                    <Td>{trx.block}</Td>
                    <Td>
                      <Link href={"https://bscscan.com/address/" + trx.from} color={colorMode === "dark" ? "#90cdf4" : "#3182ce"} isExternal>
                        {trx.from.slice(0, 20) + "..."}
                      </Link>
                    </Td>
                    <Td>
                      <Link href={"https://bscscan.com/address/" + trx.from} color={colorMode === "dark" ? "#90cdf4" : "#3182ce"} isExternal>
                        {trx.to.slice(0, 20) + "..."}
                      </Link>
                    </Td>
                    <Td>{trx.value} BTCB</Td>
                  </Tr>
                ))
              }
            </Tbody>
          </Table>
          : 
          <Box textAlign="center" p="5">
            <Spinner size='xl' color={colorMode === "dark" ? "#90cdf4" : "#3182ce"}/>
          </Box>
        }
      </TableContainer>
    </Box>
  );
};

export default Home;
