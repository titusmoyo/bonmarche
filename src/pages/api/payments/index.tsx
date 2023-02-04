// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    let firstName = req.body.firstName;
    let secondName = req.body.secondName;

    console.log("body ici");
    console.log(req.body);

    res.status(200).json({ name: 'John Doe' })
}
