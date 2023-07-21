export interface AccessTokenPayload {
  email: string;

  /**
   * user's ID will be used as the subject
   */
  sub: string;
}
