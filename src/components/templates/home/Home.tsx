import { Box } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, TableContainer, Heading } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react';
import { useSDK } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import BTCB_ABI from '../../../utils/BTCB_ABI.json'

const Home = () => {
  const sdk = useSDK();
  const [transactions, setTransactions] = useState<any>([]);
  useEffect(() => {
    const init = async () => {
      let contract = await sdk?.getContractFromAbi(process.env.NEXT_PUBLIC_BTCB_ADDRESS || "", BTCB_ABI);
      const events = await contract?.events.getAllEvents({ fromBlock: 23917314, toBlock: 23927314 })
  
      const trxs = events?.filter(x => x.eventName == "Transfer")
      .filter(x => parseFloat(ethers.utils.formatEther(x.data.value)) > 1)
      .filter((value, index, self) =>
        index === self.findIndex(x => (x.transaction.transactionHash === value.transaction.transactionHash))
      )
      .slice(0, 25)
      .map(x => { 
        return {
          hash: x.transaction.transactionHash, 
          age: 0,
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
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Trx Hash</Th>
              <Th>Age</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              transactions?.map((trx: any) => (
                <Tr key={trx.hash}>
                  <td>{trx.hash}</td>
                  <td>{trx.age}</td>
                  <td>{trx.from}</td>
                  <td>{trx.to}</td>
                  <td>{trx.value} BTCB</td>
                </Tr>
              ))
            }
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Home;
