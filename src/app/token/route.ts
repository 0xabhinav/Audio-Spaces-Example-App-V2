import { API } from '@huddle01/server-sdk/api';
import { AccessToken, Role } from '@huddle01/server-sdk/auth';

export const dynamic = 'force-dynamic';

const createToken = async (
  roomId: string,
  role: string,
  displayName: string,
) => {
  const accessToken = new AccessToken({
    apiKey: process.env.API_KEY as string,
    roomId: roomId as string,
    role: role,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
    options: {
      metadata: {
        displayName,
      },
    },
  });

  const token = await accessToken.toJwt();

  return token;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const api = new API({
    apiKey: process.env.API_KEY!,
  });

  const roomId = searchParams.get('roomId');
  const name = searchParams.get('name');

  if (!roomId) {
    return new Response('Missing roomId', { status: 400 });
  }

  let token: string;

  try {
    // const data = await api.getLivePartipantsDetails({ roomId });

    // token = await createToken(
    //   roomId,
    //   data.length > 0 ? Role.LISTENER : Role.HOST,
    //   name ?? 'Guest',
    // );
    const response = await fetch(
      `https://infra-api.huddle01.workers.dev/api/v1/live-meeting/preview-peers?roomId=${roomId}`,
      {
        headers: {
          'x-api-key': process.env.API_KEY ?? '',
        },
      },
    );
    const data = await response.json();
    const { previewPeers } = data;

    token = await createToken(
      roomId,
      previewPeers.length > 0 ? Role.LISTENER : Role.HOST,
      name ?? 'Guest',
    );
  } catch (error) {
    token = await createToken(roomId, Role.HOST, name ?? 'Guest');
  }

  return new Response(token, { status: 200 });
}
