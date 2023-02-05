// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { privateKey } from '@utils/rsa_keys/keys';
const NodeRSA = require('node-rsa');


type Data = {
  name: string
}

export default function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    let ciphertext = req.body.data;

    const decryptionKey = new NodeRSA(privateKey);
    const decrypted = decryptionKey.decrypt(ciphertext, 'utf8');
    let final_result = JSON.parse(decrypted);

    console.log(ciphertext);
    console.log("In_between");
    console.log(final_result);

    res.status(200).json({ name: 'John Doe' })
}
