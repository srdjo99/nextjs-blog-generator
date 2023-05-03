import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async function handler(req: any, res: any) {
  try {
    const {
      user: { sub },
    }: any = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db('BlogStandard');
    const userProfile = await db.collection('users').findOne({
      auth0Id: sub,
    });

    const { lastPostDate } = req.body;
    const posts = await db
      .collection('posts')
      .find({
        userId: userProfile?._id,
        createdAt: { $lt: new Date(lastPostDate) },
      })
      .limit(5)
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({ posts });
  } catch (error) {}
});
