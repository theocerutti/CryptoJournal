export type JwtPayloadAccessToken = {
  email: string;
  userId: number;
};

export type JwtPayloadRefreshToken = {
  userId: number;
  refreshTokenId: number;
};

export const jwtConstants = {
  secret: 'secretKey', // TODO: get from env
};
