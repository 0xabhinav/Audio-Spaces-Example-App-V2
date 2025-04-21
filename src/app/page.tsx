'use server';
import IntroPage from '@/components/IntroPage/IntroPage';
import { API } from '@huddle01/server-sdk/api';

interface RoomDetails {
  message: string;
  data: {
    roomId: string;
  };
}

const createRandomRoom = async () => {
  const api = new API({
    apiKey: process.env.API_KEY!,
  });

  const data = await api.createRoom({
    roomLocked: true,
    metadata: JSON.stringify({
      title: 'Test Room',
    }),
  });
  const { roomId } = data;

  // const res = await fetch('https://infra-api.huddle01.workers.dev/api/v1/create-room', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     title: 'Test Room',
  //   }),
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'x-api-key': process.env.API_KEY ?? '',
  //   },
  //   cache: 'no-store',
  // });
  // const data: RoomDetails = await res.json();
  // const { roomId } = data.data;
  return roomId;
};

export default async function Home() {
  const roomId = await createRandomRoom();
  return <IntroPage roomId={roomId} />;
}
